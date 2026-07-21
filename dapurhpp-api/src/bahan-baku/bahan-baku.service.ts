import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBahanBakuDto } from './dto/create-bahan-baku.dto';
import { UpdateBahanBakuDto } from './dto/update-bahan-baku.dto';

@Injectable()
export class BahanBakuService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(userId: number) {
    return this.prisma.bahanBaku.findMany({
      where: { userId, deletedAt: null },
      orderBy: { nama: 'asc' },
    });
  }

  async findOne(id: number, userId: number) {
    const item = await this.prisma.bahanBaku.findFirst({
      where: { id, userId, deletedAt: null },
    });
    if (!item) {
      throw new NotFoundException('Bahan baku tidak ditemukan');
    }
    return item;
  }

  async create(userId: number, dto: CreateBahanBakuDto) {
    return this.prisma.$transaction(async (tx) => {
      const existing = await tx.bahanBaku.findFirst({
        where: { userId, nama: dto.nama },
      });

      if (existing) {
        if (existing.deletedAt === null) {
          throw new BadRequestException(
            `Nama bahan "${dto.nama}" sudah dipakai. Gunakan nama lain.`,
          );
        }

        const refCount =
          (await tx.detailBelanja.count({
            where: { bahanBakuId: existing.id },
          })) +
          (await tx.detailResep.count({
            where: { bahanBakuId: existing.id },
          }));

        if (refCount > 0) {
          throw new BadRequestException(
            `Nama "${dto.nama}" pernah dipakai bahan yang sudah dihapus dan masih punya riwayat transaksi. Gunakan nama lain.`,
          );
        }

        await tx.bahanBaku.delete({ where: { id: existing.id } });
      }

      return tx.bahanBaku.create({
        data: {
          userId,
          nama: dto.nama,
          satuan: dto.satuan,
          kategori: dto.kategori,
          hargaTerakhir: dto.hargaTerakhir ?? 0,
          fotoUrl: dto.fotoUrl ?? null,
          stok: dto.stok ?? 0,
          stokMinimal: dto.stokMinimal ?? 0,
        },
      });
    });
  }

  async update(id: number, userId: number, dto: UpdateBahanBakuDto) {
    // Will throw NotFoundException if not found or not owned by user
    await this.findOne(id, userId);

    return this.prisma.bahanBaku.update({
      where: { id },
      data: {
        ...(dto.nama !== undefined && { nama: dto.nama }),
        ...(dto.satuan !== undefined && { satuan: dto.satuan }),
        ...(dto.kategori !== undefined && { kategori: dto.kategori }),
        ...(dto.hargaTerakhir !== undefined && {
          hargaTerakhir: dto.hargaTerakhir,
        }),
        ...(dto.fotoUrl !== undefined && { fotoUrl: dto.fotoUrl }),
        ...(dto.stok !== undefined && { stok: dto.stok }),
        ...(dto.stokMinimal !== undefined && { stokMinimal: dto.stokMinimal }),
      },
    });
  }

  async getRiwayatHarga(bahanId: number, userId: number) {
    await this.findOne(bahanId, userId);

    const riwayat = await this.prisma.detailBelanja.findMany({
      where: {
        bahanBakuId: bahanId,
        belanja: { userId },
      },
      include: {
        belanja: { select: { tanggal: true } },
      },
      orderBy: { belanja: { tanggal: 'asc' } },
    });

    const grouped = new Map<
      string,
      { label: string; harga: number; tanggal: Date }
    >();

    for (const item of riwayat) {
      const date = item.belanja.tanggal;
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const label = date.toLocaleDateString('id-ID', { month: 'short' });

      grouped.set(key, {
        label,
        harga: Number(item.hargaSatuan),
        tanggal: date,
      });
    }

    const result = Array.from(grouped.values())
      .sort((a, b) => a.tanggal.getTime() - b.tanggal.getTime())
      .slice(-6)
      .map(({ label, harga }) => ({ label, harga }));

    return result;
  }

  async updateFotoUrl(id: number, userId: number, fotoUrl: string | null) {
    await this.findOne(id, userId);
    return this.prisma.bahanBaku.update({
      where: { id },
      data: { fotoUrl },
    });
  }

  async remove(id: number, userId: number) {
    // Will throw NotFoundException if not found or not owned by user
    await this.findOne(id, userId);

    return this.prisma.bahanBaku.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
