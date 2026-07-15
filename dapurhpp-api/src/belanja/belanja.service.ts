import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBelanjaDto } from './dto/create-belanja.dto';
import { UpdateBelanjaDto } from './dto/update-belanja.dto';
import { BelanjaQueryDto } from './dto/belanja-query.dto';

@Injectable()
export class BelanjaService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: number, query: BelanjaQueryDto) {
    const where: any = { userId };

    if (query.tanggal) {
      const date = new Date(query.tanggal);
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      where.tanggal = { gte: startOfDay, lte: endOfDay };
    } else {
      if (query.tanggalMulai || query.tanggalAkhir) {
        where.tanggal = {};
        if (query.tanggalMulai) where.tanggal.gte = new Date(query.tanggalMulai);
        if (query.tanggalAkhir) {
          const end = new Date(query.tanggalAkhir);
          end.setHours(23, 59, 59, 999);
          where.tanggal.lte = end;
        }
      }
    }

    if (query.supplierId) {
      where.detailBelanja = {
        some: { supplierId: Number(query.supplierId) },
      };
    }

    const belanjaList = await this.prisma.belanja.findMany({
      where,
      orderBy: [{ tanggal: 'desc' }, { createdAt: 'desc' }],
      include: {
        detailBelanja: {
          include: {
            bahanBaku: { select: { id: true, nama: true, satuan: true, fotoUrl: true } },
            supplier: { select: { id: true, nama: true } },
          },
        },
      },
    });

    return belanjaList.map((b) => this.formatListItem(b));
  }

  async getRingkasan(userId: number, tanggal?: string) {
    const dateStr = tanggal ?? new Date().toISOString().split('T')[0];
    const date = new Date(dateStr);
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const list = await this.prisma.belanja.findMany({
      where: {
        userId,
        tanggal: { gte: startOfDay, lte: endOfDay },
      },
      orderBy: { createdAt: 'desc' },
      include: {
        detailBelanja: {
          include: {
            bahanBaku: { select: { id: true, nama: true, fotoUrl: true, satuan: true } },
            supplier: { select: { id: true, nama: true } },
          },
        },
      },
    });

    const totalBelanja = list.reduce((sum, b) => sum + Number(b.totalBelanja), 0);
    const jumlahItem = list.reduce((sum, b) => sum + b.detailBelanja.length, 0);
    const totalQty = list.reduce(
      (sum, b) =>
        sum + b.detailBelanja.reduce((s, d) => s + Number(d.jumlah), 0),
      0,
    );
    const supplierIds = new Set<number>();
    list.forEach((b) =>
      b.detailBelanja.forEach((d) => {
        if (d.supplier?.id) supplierIds.add(d.supplier.id);
      }),
    );

    return {
      tanggal: dateStr,
      totalBelanja,
      jumlahItem,
      totalQty,
      jumlahSupplier: supplierIds.size,
      list: list.map((b) => this.formatListItem(b)),
    };
  }

  async findOne(id: number, userId: number) {
    const belanja = await this.prisma.belanja.findFirst({
      where: { id, userId },
      include: {
        detailBelanja: {
          include: {
            bahanBaku: {
              select: {
                id: true,
                nama: true,
                fotoUrl: true,
                satuan: true,
                hargaTerakhir: true,
              },
            },
            supplier: { select: { id: true, nama: true } },
          },
        },
      },
    });

    if (!belanja) {
      throw new NotFoundException('Belanja tidak ditemukan');
    }

    return {
      id: belanja.id,
      tanggal: belanja.tanggal,
      totalBelanja: Number(belanja.totalBelanja),
      catatan: belanja.catatan,
      createdAt: belanja.createdAt,
      updatedAt: belanja.updatedAt,
      suppliers: [
        ...new Set(
          belanja.detailBelanja
            .map((d) => d.supplier?.nama)
            .filter(Boolean) as string[],
        ),
      ],
      jumlahItem: belanja.detailBelanja.length,
      detailBelanja: belanja.detailBelanja.map((d) => ({
        id: d.id,
        bahanBakuId: d.bahanBakuId,
        bahanBaku: d.bahanBaku,
        supplierId: d.supplierId,
        supplier: d.supplier,
        jumlah: Number(d.jumlah),
        satuan: d.satuan,
        hargaSatuan: Number(d.hargaSatuan),
        subtotal: Number(d.subtotal),
      })),
    };
  }

  async create(userId: number, dto: CreateBelanjaDto) {
    const bahanBakuIds = dto.detailBelanja.map((d) => d.bahanBakuId);
    const uniqueBahanIds = [...new Set(bahanBakuIds)];

    const bahanBakuList = await this.prisma.bahanBaku.findMany({
      where: {
        id: { in: uniqueBahanIds },
        userId,
        deletedAt: null,
      },
    });

    if (bahanBakuList.length < uniqueBahanIds.length) {
      throw new BadRequestException(
        'Bahan baku tidak ditemukan atau bukan milik Anda',
      );
    }

    const supplierIds = dto.detailBelanja
      .map((d) => d.supplierId)
      .filter((id): id is number => id !== undefined && id !== null);
    if (supplierIds.length > 0) {
      const uniqueSupplierIds = [...new Set(supplierIds)];
      const supplierList = await this.prisma.supplier.findMany({
        where: {
          id: { in: uniqueSupplierIds },
          userId,
          deletedAt: null,
        },
      });
      if (supplierList.length < uniqueSupplierIds.length) {
        throw new BadRequestException(
          'Supplier tidak ditemukan atau bukan milik Anda',
        );
      }
    }

    const detailWithSubtotal = dto.detailBelanja.map((d) => ({
      ...d,
      subtotal: d.jumlah * d.hargaSatuan,
    }));

    const totalBelanja = detailWithSubtotal.reduce(
      (sum, d) => sum + d.subtotal,
      0,
    );

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
              supplierId: d.supplierId ?? null,
              jumlah: d.jumlah,
              satuan: d.satuan,
              hargaSatuan: d.hargaSatuan,
              subtotal: d.subtotal,
            })),
          },
        },
      });

      for (const detail of detailWithSubtotal) {
        const belanjaLebihBaru = await tx.detailBelanja.findFirst({
          where: {
            bahanBakuId: detail.bahanBakuId,
            belanja: {
              userId,
              tanggal: { gt: new Date(dto.tanggal) },
              id: { not: created.id },
            },
          },
        });

        if (!belanjaLebihBaru) {
          await tx.bahanBaku.updateMany({
            where: { id: detail.bahanBakuId, userId },
            data: { hargaTerakhir: detail.hargaSatuan },
          });
        }
      }

      // UPDATE STOK: tambah stok sesuai jumlah yang dibeli
      for (const detail of detailWithSubtotal) {
        await tx.bahanBaku.updateMany({
          where: { id: detail.bahanBakuId, userId },
          data: {
            stok: {
              increment: detail.jumlah,
            },
          },
        });
      }

      return created;
    });

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
      const bahanBakuIds = dto.detailBelanja.map((d) => d.bahanBakuId);
      const uniqueBahanIds = [...new Set(bahanBakuIds)];

      const bahanBakuList = await this.prisma.bahanBaku.findMany({
        where: {
          id: { in: uniqueBahanIds },
          userId,
          deletedAt: null,
        },
      });

      if (bahanBakuList.length < uniqueBahanIds.length) {
        throw new BadRequestException(
          'Bahan baku tidak ditemukan atau bukan milik Anda',
        );
      }

      const supplierIds = dto.detailBelanja
        .map((d) => d.supplierId)
        .filter((id): id is number => id !== undefined && id !== null);
      if (supplierIds.length > 0) {
        const uniqueSupplierIds = [...new Set(supplierIds)];
        const supplierList = await this.prisma.supplier.findMany({
          where: {
            id: { in: uniqueSupplierIds },
            userId,
            deletedAt: null,
          },
        });
        if (supplierList.length < uniqueSupplierIds.length) {
          throw new BadRequestException(
            'Supplier tidak ditemukan atau bukan milik Anda',
          );
        }
      }

      const detailWithSubtotal = dto.detailBelanja.map((d) => ({
        ...d,
        subtotal: d.jumlah * d.hargaSatuan,
      }));

      const totalBelanja = detailWithSubtotal.reduce(
        (sum, d) => sum + d.subtotal,
        0,
      );

      const tanggalPatokan = updateData.tanggal ?? new Date(dto.tanggal ?? '');

      await this.prisma.$transaction(async (tx) => {
        // Ambil detail lama sebelum dihapus untuk rollback stok
        const detailLama = await tx.detailBelanja.findMany({
          where: { belanjaId: id },
          select: { bahanBakuId: true, jumlah: true },
        });

        // Kurangi stok dari detail lama (tidak boleh negatif)
        for (const d of detailLama) {
          const current = await tx.bahanBaku.findUnique({
            where: { id: d.bahanBakuId },
            select: { stok: true },
          });
          const newStok = Math.max(0, Number(current?.stok ?? 0) - Number(d.jumlah));
          await tx.bahanBaku.update({
            where: { id: d.bahanBakuId },
            data: { stok: newStok },
          });
        }

        await tx.detailBelanja.deleteMany({ where: { belanjaId: id } });

        await tx.belanja.update({
          where: { id },
          data: {
            ...updateData,
            totalBelanja,
            detailBelanja: {
              create: detailWithSubtotal.map((d) => ({
                bahanBakuId: d.bahanBakuId,
                supplierId: d.supplierId ?? null,
                jumlah: d.jumlah,
                satuan: d.satuan,
                hargaSatuan: d.hargaSatuan,
                subtotal: d.subtotal,
              })),
            },
          },
        });

        for (const detail of detailWithSubtotal) {
          const belanjaLebihBaru = await tx.detailBelanja.findFirst({
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
            await tx.bahanBaku.updateMany({
              where: { id: detail.bahanBakuId, userId },
              data: { hargaTerakhir: detail.hargaSatuan },
            });
          }
        }

        // TAMBAH STOK dari detail baru
        for (const detail of detailWithSubtotal) {
          await tx.bahanBaku.updateMany({
            where: { id: detail.bahanBakuId, userId },
            data: { stok: { increment: detail.jumlah } },
          });
        }
      });

      return this.findOne(id, userId);
    }

    await this.prisma.belanja.update({
      where: { id },
      data: updateData,
    });

    return this.findOne(id, userId);
  }

  async remove(id: number, userId: number) {
    await this.findOne(id, userId);

    await this.prisma.$transaction(async (tx) => {
      // Ambil detail sebelum dihapus untuk rollback stok
      const detailLama = await tx.detailBelanja.findMany({
        where: { belanjaId: id },
        select: { bahanBakuId: true, jumlah: true },
      });

      // Kurangi stok (tidak boleh negatif)
      for (const d of detailLama) {
        const current = await tx.bahanBaku.findUnique({
          where: { id: d.bahanBakuId },
          select: { stok: true },
        });
        const newStok = Math.max(0, Number(current?.stok ?? 0) - Number(d.jumlah));
        await tx.bahanBaku.update({
          where: { id: d.bahanBakuId },
          data: { stok: newStok },
        });
      }

      // Hapus detail dan belanja
      await tx.detailBelanja.deleteMany({ where: { belanjaId: id } });
      await tx.belanja.delete({ where: { id } });
    });

    return { message: 'Belanja berhasil dihapus' };
  }

  private formatListItem(b: any) {
    const supplierNames = [
      ...new Set(
        b.detailBelanja
          .map((d: any) => d.supplier?.nama)
          .filter(Boolean),
      ),
    ] as string[];

    return {
      id: b.id,
      tanggal: b.tanggal,
      totalBelanja: Number(b.totalBelanja),
      catatan: b.catatan,
      jumlahItem: b.detailBelanja.length,
      suppliers: supplierNames,
    };
  }
}
