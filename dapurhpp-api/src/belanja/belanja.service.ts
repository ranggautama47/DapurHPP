import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBelanjaDto } from './dto/create-belanja.dto';
import { UpdateBelanjaDto } from './dto/update-belanja.dto';

@Injectable()
export class BelanjaService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: number, tanggal?: string) {
    const where: any = { userId };
    if (tanggal) {
      where.tanggal = new Date(tanggal);
    }

    const belanjaList = await this.prisma.belanja.findMany({
      where,
      orderBy: [{ tanggal: 'desc' }, { createdAt: 'desc' }],
      include: {
        detailBelanja: {
          include: {
            bahanBaku: { select: { id: true, nama: true } },
            supplier: { select: { id: true, nama: true } },
          },
        },
      },
    });

    return belanjaList;
  }

  async findOne(id: number, userId: number) {
    const belanja = await this.prisma.belanja.findFirst({
      where: { id, userId },
      include: {
        detailBelanja: {
          include: {
            bahanBaku: { select: { id: true, nama: true } },
            supplier: { select: { id: true, nama: true } },
          },
        },
      },
    });

    if (!belanja) {
      throw new NotFoundException('Belanja tidak ditemukan');
    }

    return belanja;
  }

  async create(userId: number, dto: CreateBelanjaDto) {
    // Validasi bahanBaku
    const bahanBakuIds = dto.detailBelanja.map((d) => d.bahanBakuId);
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

    // Validasi supplier (jika ada)
    const supplierIds = dto.detailBelanja
      .map((d) => d.supplierId)
      .filter((id): id is number => id !== undefined && id !== null);
    if (supplierIds.length > 0) {
      const supplierList = await this.prisma.supplier.findMany({
        where: {
          id: { in: supplierIds },
          userId,
          deletedAt: null,
        },
      });
      if (supplierList.length < new Set(supplierIds).size) {
        throw new BadRequestException(
          'Supplier tidak ditemukan atau bukan milik Anda',
        );
      }
    }

    // Hitung subtotal dan totalBelanja
    const detailWithSubtotal = dto.detailBelanja.map((d) => ({
      bahanBakuId: d.bahanBakuId,
      supplierId: d.supplierId ?? null,
      jumlah: d.jumlah,
      satuan: d.satuan,
      hargaSatuan: d.hargaSatuan,
      subtotal: d.jumlah * d.hargaSatuan,
    }));

    const totalBelanja = detailWithSubtotal.reduce(
      (sum, d) => sum + d.subtotal,
      0,
    );

    // Create dalam transaction
    const belanja = await this.prisma.$transaction(async (tx) => {
      const created = await tx.belanja.create({
        data: {
          userId,
          tanggal: new Date(dto.tanggal),
          totalBelanja,
          catatan: dto.catatan ?? null,
          detailBelanja: {
            create: detailWithSubtotal.map((d) => ({
              bahanBakuId: d.bahanBakuId,
              supplierId: d.supplierId,
              jumlah: d.jumlah,
              satuan: d.satuan,
              hargaSatuan: d.hargaSatuan,
              subtotal: d.subtotal,
            })),
          },
        },
        include: { detailBelanja: true },
      });
      return created;
    });

    // Update hargaTerakhir per bahan (logika cek tanggal terbaru)
    for (const detail of belanja.detailBelanja) {
      const belanjaLebihBaru = await this.prisma.detailBelanja.findFirst({
        where: {
          bahanBakuId: detail.bahanBakuId,
          belanja: {
            userId,
            tanggal: { gt: new Date(dto.tanggal) },
            id: { not: belanja.id },
          },
        },
      });

      if (!belanjaLebihBaru) {
        await this.prisma.bahanBaku.update({
          where: { id: detail.bahanBakuId },
          data: { hargaTerakhir: detail.hargaSatuan },
        });
      }
    }

    return this.findOne(belanja.id, userId);
  }

  async update(id: number, userId: number, dto: UpdateBelanjaDto) {
    await this.findOne(id, userId);

    const updateData: any = {};
    if (dto.tanggal !== undefined) {
      updateData.tanggal = new Date(dto.tanggal);
    }
    if (dto.catatan !== undefined) {
      updateData.catatan = dto.catatan;
    }

    if (dto.detailBelanja !== undefined) {
      // Validasi bahanBaku
      const bahanBakuIds = dto.detailBelanja.map((d) => d.bahanBakuId);
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

      // Validasi supplier
      const supplierIds = dto.detailBelanja
        .map((d) => d.supplierId)
        .filter((id): id is number => id !== undefined && id !== null);
      if (supplierIds.length > 0) {
        const supplierList = await this.prisma.supplier.findMany({
          where: {
            id: { in: supplierIds },
            userId,
            deletedAt: null,
          },
        });
        if (supplierList.length < new Set(supplierIds).size) {
          throw new BadRequestException(
            'Supplier tidak ditemukan atau bukan milik Anda',
          );
        }
      }

      // Hitung subtotal dan totalBelanja
      const detailWithSubtotal = dto.detailBelanja.map((d) => ({
        bahanBakuId: d.bahanBakuId,
        supplierId: d.supplierId ?? null,
        jumlah: d.jumlah,
        satuan: d.satuan,
        hargaSatuan: d.hargaSatuan,
        subtotal: d.jumlah * d.hargaSatuan,
      }));

      const totalBelanja = detailWithSubtotal.reduce(
        (sum, d) => sum + d.subtotal,
        0,
      );

      // Transaction: delete lama, update header, create baru
      const belanja = await this.prisma.$transaction(async (tx) => {
        await tx.detailBelanja.deleteMany({
          where: { belanjaId: id },
        });

        await tx.belanja.update({
          where: { id },
          data: {
            ...updateData,
            totalBelanja,
            detailBelanja: {
              create: detailWithSubtotal.map((d) => ({
                bahanBakuId: d.bahanBakuId,
                supplierId: d.supplierId,
                jumlah: d.jumlah,
                satuan: d.satuan,
                hargaSatuan: d.hargaSatuan,
                subtotal: d.subtotal,
              })),
            },
          },
          include: { detailBelanja: true },
        });

        return tx.belanja.findFirst({
          where: { id },
          include: { detailBelanja: true },
        });
      });

      // Update hargaTerakhir per bahan
      const existingBelanja = await this.prisma.belanja.findUnique({
        where: { id },
        select: { tanggal: true },
      });
      const tanggalPatokan = updateData.tanggal || existingBelanja!.tanggal;

      // Update hargaTerakhir per bahan
      for (const detail of belanja!.detailBelanja) {
        const belanjaLebihBaru = await this.prisma.detailBelanja.findFirst({
          where: {
            bahanBakuId: detail.bahanBakuId,
            belanja: {
              userId,
              tanggal: { gt: tanggalPatokan },
              id: { not: id },
            },
          },
        });

        if (!belanjaLebihBaru) {
          await this.prisma.bahanBaku.update({
            where: { id: detail.bahanBakuId },
            data: { hargaTerakhir: detail.hargaSatuan },
          });
        }
      }

      return this.findOne(id, userId);
    } else {
      // Update header saja
      await this.prisma.belanja.update({
        where: { id },
        data: updateData,
      });
      return this.findOne(id, userId);
    }
  }

  async remove(id: number, userId: number) {
    await this.findOne(id, userId);

    // 1. HAPUS detail_belanja dulu (child rows)
    await this.prisma.detailBelanja.deleteMany({
      where: { belanjaId: id },
    });

    // Hard delete (detail ikut terhapus via cascade)
    await this.prisma.belanja.delete({
      where: { id },
    });

    return { message: 'Belanja berhasil dihapus' };
  }
}
