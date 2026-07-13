import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePenjualanDto } from './dto/create-penjualan.dto';
import { UpdatePenjualanDto } from './dto/update-penjualan.dto';

@Injectable()
export class PenjualanService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(userId: number, tanggal?: string) {
    return this.prisma.penjualan.findMany({
      where: {
        userId,
        ...(tanggal && { tanggal: new Date(tanggal) }),
      },
      include: {
        produksi: {
          select: {
            resepId: true,
            hasilNyata: true,
            status: true,
          },
        },
      },
      orderBy: {
        tanggal: 'desc',
      },
    });
  }

  async findOne(id: number, userId: number) {
    const item = await this.prisma.penjualan.findFirst({
      where: { id, userId },
      include: {
        produksi: true,
      },
    });
    if (!item) {
      throw new NotFoundException('Penjualan tidak ditemukan');
    }
    return item;
  }

  async create(userId: number, dto: CreatePenjualanDto) {
    // 1. Find production owned by user
    const produksi = await this.prisma.produksi.findFirst({
      where: { id: dto.produksiId, userId },
    });
    if (!produksi) {
      throw new NotFoundException('Produksi tidak ditemukan');
    }

    // 2. Validate production status: must be SELESAI
    if (produksi.status !== 'SELESAI') {
      throw new BadRequestException('Produksi harus berstatus SELESAI sebelum bisa dijual');
    }

    // 3. Calculate available stock
    const aggregate = await this.prisma.penjualan.aggregate({
      where: { produksiId: dto.produksiId },
      _sum: { terjual: true },
    });
    const totalTerjualSebelumnya = aggregate._sum.terjual ?? 0;
    const stokTersedia = produksi.hasilNyata - totalTerjualSebelumnya;

    // 4. Validate enough stock
    if (dto.terjual > stokTersedia) {
      throw new BadRequestException(`Stok tidak cukup. Tersedia: ${stokTersedia}`);
    }

    // 5. Calculate remaining and totalPendapatan
    const sisa = stokTersedia - dto.terjual;
    const totalPendapatan = dto.terjual * dto.hargaJual;

    // 6. Create sale record
    const newPenjualan = await this.prisma.penjualan.create({
      data: {
        userId,
        produksiId: dto.produksiId,
        tanggal: new Date(dto.tanggal),
        terjual: dto.terjual,
        hargaJual: dto.hargaJual,
        totalPendapatan,
        sisa,
        status: 'OPEN',
      },
    });

    return this.findOne(newPenjualan.id, userId);
  }

  async update(id: number, userId: number, dto: UpdatePenjualanDto) {
    // 1. Check existence and ownership
    const penjualan = await this.findOne(id, userId);

    // 2. Validate status: CLOSED cannot be modified
    if (penjualan.status === 'CLOSED') {
      throw new BadRequestException('Penjualan yang sudah CLOSED tidak bisa diubah');
    }

    // 3. Recalculate if sales quantity or price changes
    let totalPendapatan = penjualan.totalPendapatan;
    let sisa = penjualan.sisa;
    const terjualBaru = dto.terjual ?? penjualan.terjual;
    const hargaJualBaru = dto.hargaJual ?? Number(penjualan.hargaJual);

    if (dto.terjual !== undefined || dto.hargaJual !== undefined) {
      const aggregate = await this.prisma.penjualan.aggregate({
        where: {
          produksiId: penjualan.produksiId,
          id: { not: id },
        },
        _sum: { terjual: true },
      });
      const totalTerjualLain = aggregate._sum.terjual ?? 0;
      const stokTersedia = penjualan.produksi.hasilNyata - totalTerjualLain;

      if (terjualBaru > stokTersedia) {
        throw new BadRequestException(`Stok tidak cukup. Tersedia: ${stokTersedia}`);
      }

      totalPendapatan = terjualBaru * hargaJualBaru as any;
      sisa = stokTersedia - terjualBaru;
    }

    // 4. Update sale record
    await this.prisma.penjualan.update({
      where: { id },
      data: {
        ...(dto.terjual !== undefined && { terjual: dto.terjual }),
        ...(dto.hargaJual !== undefined && { hargaJual: dto.hargaJual }),
        ...(dto.status !== undefined && { status: dto.status }),
        ...(dto.terjual !== undefined || dto.hargaJual !== undefined
          ? { totalPendapatan, sisa }
          : {}),
      },
    });

    return this.findOne(id, userId);
  }
}
