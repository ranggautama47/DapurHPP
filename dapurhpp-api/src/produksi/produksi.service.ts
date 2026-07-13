import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProduksiDto } from './dto/create-produksi.dto';
import { UpdateProduksiDto } from './dto/update-produksi.dto';

@Injectable()
export class ProduksiService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(userId: number, tanggal?: string) {
    return this.prisma.produksi.findMany({
      where: {
        userId,
        ...(tanggal && { tanggal: new Date(tanggal) }),
      },
      include: {
        resep: {
          select: {
            nama: true,
          },
        },
      },
      orderBy: {
        tanggal: 'desc',
      },
    });
  }

  async findOne(id: number, userId: number) {
    const item = await this.prisma.produksi.findFirst({
      where: { id, userId },
      include: {
        resep: {
          select: {
            nama: true,
            estimasiHasil: true,
          },
        },
        penjualan: true,
      },
    });
    if (!item) {
      throw new NotFoundException('Produksi tidak ditemukan');
    }
    return item;
  }

  async create(userId: number, dto: CreateProduksiDto) {
    // 1. Find resep owned by user
    const resep = await this.prisma.resep.findFirst({
      where: { id: dto.resepId, userId, deletedAt: null },
      include: {
        detailResep: {
          include: {
            bahanBaku: true,
          },
        },
      },
    });
    if (!resep) {
      throw new NotFoundException('Resep tidak ditemukan');
    }

    // 2. Calculate HPP snapshot
    const totalBahan = resep.detailResep.reduce((sum, d) => {
      return sum + Number(d.jumlah) * Number(d.bahanBaku.hargaTerakhir);
    }, 0);
    
    const hppPerPcs = resep.estimasiHasil > 0 ? totalBahan / resep.estimasiHasil : 0;
    const totalModal = hppPerPcs * dto.hasilNyata;

    // 3. Create produksi record
    const newProduksi = await this.prisma.produksi.create({
      data: {
        userId,
        resepId: dto.resepId,
        tanggal: new Date(dto.tanggal),
        estimasiHasil: resep.estimasiHasil,
        hasilNyata: dto.hasilNyata,
        hppPerPcs,
        hargaJualSaatProduksi: resep.hargaJual,
        totalModal,
        status: 'DRAFT',
      },
    });

    // 4. Return complete record
    return this.findOne(newProduksi.id, userId);
  }

  async update(id: number, userId: number, dto: UpdateProduksiDto) {
    // 1. Check existence and ownership
    const produksi = await this.findOne(id, userId);

    // 2. Validate status: ONLY DRAFT can be updated
    if (produksi.status !== 'DRAFT') {
      throw new BadRequestException('Hanya produksi berstatus DRAFT yang bisa diupdate');
    }

    // 3. Recalculate totalModal with new hasilNyata
    const totalModal = Number(produksi.hppPerPcs) * dto.hasilNyata;

    // 4. Update record to status SELESAI
    await this.prisma.produksi.update({
      where: { id },
      data: {
        hasilNyata: dto.hasilNyata,
        totalModal,
        status: 'SELESAI',
      },
    });

    // 5. Return updated record
    return this.findOne(id, userId);
  }

  async remove(id: number, userId: number) {
    // 1. Check existence and ownership
    const produksi = await this.findOne(id, userId);

    // 2. Validate status: ONLY DRAFT can be canceled
    if (produksi.status !== 'DRAFT') {
      throw new BadRequestException('Hanya produksi berstatus DRAFT yang bisa dibatalkan');
    }

    // 3. Update status to BATAL
    await this.prisma.produksi.update({
      where: { id },
      data: {
        status: 'BATAL',
      },
    });

    return { message: 'Produksi berhasil dibatalkan' };
  }
}
