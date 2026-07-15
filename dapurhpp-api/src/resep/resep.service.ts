import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateResepDto } from './dto/create-resep.dto';
import { UpdateResepDto } from './dto/update-resep.dto';

@Injectable()
export class ResepService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: number) {
    const resepList = await this.prisma.resep.findMany({
      where: { userId, deletedAt: null },
      orderBy: { nama: 'asc' },
      include: {
        detailResep: {
          include: {
            bahanBaku: true,
          },
        },
      },
    });

    return resepList.map((resep) => {
      const totalBahan = resep.detailResep.reduce((sum, detail) => {
        const harga = Number(detail.bahanBaku.hargaTerakhir);
        const jumlah = Number(detail.jumlah);
        return sum + harga * jumlah;
      }, 0);

      const hppPerPcs = totalBahan / resep.estimasiHasil;

      return {
        id: resep.id,
        nama: resep.nama,
        catatan: resep.catatan,
        estimasiHasil: resep.estimasiHasil,
        hargaJual: resep.hargaJual,
        fotoUrl: resep.fotoUrl,
        createdAt: resep.createdAt,
        updatedAt: resep.updatedAt,
        hppPerPcs,
        totalBahan,
        detailCount: resep.detailResep.length,
      };
    });
  }

  async findOne(id: number, userId: number) {
    const resep = await this.prisma.resep.findFirst({
      where: { id, userId, deletedAt: null },
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

    const totalBahan = resep.detailResep.reduce((sum, detail) => {
      const harga = Number(detail.bahanBaku.hargaTerakhir);
      const jumlah = Number(detail.jumlah);
      return sum + harga * jumlah;
    }, 0);

    const hppPerPcs = totalBahan / resep.estimasiHasil;
    const hargaJualNum = Number(resep.hargaJual);
    const marginPersen =
      hargaJualNum > 0 ? ((hargaJualNum - hppPerPcs) / hargaJualNum) * 100 : 0;

    return {
      id: resep.id,
      nama: resep.nama,
      catatan: resep.catatan,
      estimasiHasil: resep.estimasiHasil,
      hargaJual: resep.hargaJual,
      fotoUrl: resep.fotoUrl,
      createdAt: resep.createdAt,
      updatedAt: resep.updatedAt,
      hppPerPcs,
      totalBahan,
      marginPersen,
      detailResep: resep.detailResep.map((detail) => ({
        id: detail.id,
        bahanBakuId: detail.bahanBakuId,
        jumlah: detail.jumlah,
        satuan: detail.satuan,
        bahanBaku: {
          nama: detail.bahanBaku.nama,
          hargaTerakhir: detail.bahanBaku.hargaTerakhir,
          satuan: detail.bahanBaku.satuan,
        },
        subtotal:
          Number(detail.jumlah) * Number(detail.bahanBaku.hargaTerakhir),
      })),
    };
  }

  async create(userId: number, dto: CreateResepDto) {
    // Validasi bahanBakuId milik user yang sama
    const bahanBakuIds = dto.detailResep.map((d) => d.bahanBakuId);
    const bahanBakuList = await this.prisma.bahanBaku.findMany({
      where: {
        id: { in: bahanBakuIds },
        userId,
        deletedAt: null,
      },
    });

    if (bahanBakuList.length < bahanBakuIds.length) {
      throw new BadRequestException(
        'Bahan baku tidak ditemukan atau bukan milik Anda',
      );
    }

    const resep = await this.prisma.resep.create({
      data: {
        userId,
        nama: dto.nama,
        estimasiHasil: dto.estimasiHasil,
        hargaJual: dto.hargaJual ?? 0,
        fotoUrl: null,
        catatan: dto.catatan ?? null,
        detailResep: {
          create: dto.detailResep.map((detail) => ({
            bahanBakuId: detail.bahanBakuId,
            jumlah: detail.jumlah,
            satuan: detail.satuan,
          })),
        },
      },
    });

    return this.findOne(resep.id, userId);
  }

  async update(id: number, userId: number, dto: UpdateResepDto) {
    // Cek exist via findOne (sudah handle NotFoundException)
    await this.findOne(id, userId);

    const resepData: any = {};
    if (dto.nama !== undefined) resepData.nama = dto.nama;
    if (dto.estimasiHasil !== undefined)
      resepData.estimasiHasil = dto.estimasiHasil;
    if (dto.hargaJual !== undefined) resepData.hargaJual = dto.hargaJual;
    if (dto.catatan !== undefined) resepData.catatan = dto.catatan;

    if (dto.detailResep !== undefined) {
      // Validasi ownership bahanBaku
      const bahanBakuIds = dto.detailResep.map((d) => d.bahanBakuId);
      const bahanBakuList = await this.prisma.bahanBaku.findMany({
        where: {
          id: { in: bahanBakuIds },
          userId,
          deletedAt: null,
        },
      });

      if (bahanBakuList.length < bahanBakuIds.length) {
        throw new BadRequestException(
          'Bahan baku tidak ditemukan atau bukan milik Anda',
        );
      }

      // Atomic transaction: delete old → update resep + create new
      await this.prisma.$transaction([
        this.prisma.detailResep.deleteMany({
          where: { resepId: id },
        }),
        this.prisma.resep.update({
          where: { id },
          data: {
            ...resepData,
            detailResep: {
              create: dto.detailResep.map((detail) => ({
                bahanBakuId: detail.bahanBakuId,
                jumlah: detail.jumlah,
                satuan: detail.satuan,
              })),
            },
          },
        }),
      ]);

      return this.findOne(id, userId);
    }

    await this.prisma.resep.update({
      where: { id },
      data: resepData,
    });

    return this.findOne(id, userId);
  }

  async remove(id: number, userId: number) {
    await this.findOne(id, userId);

    await this.prisma.resep.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    return { message: 'Resep berhasil dihapus' };
  }

  async updateFotoUrl(id: number, userId: number, fotoUrl: string | null) {
    await this.findOne(id, userId);
    return this.prisma.resep.update({
      where: { id },
      data: { fotoUrl },
    });
  }
}