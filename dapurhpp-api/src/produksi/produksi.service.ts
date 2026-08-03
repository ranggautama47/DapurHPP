import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
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
          select: { nama: true, fotoUrl: true },
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
            fotoUrl: true,
          },
        },
        penjualan: true,
        detailProduksi: true,
      },
    });
    if (!item) {
      throw new NotFoundException('Produksi tidak ditemukan');
    }
    return item;
  }

  async create(userId: number, dto: CreateProduksiDto) {
    const resep = await this.prisma.resep.findFirst({
      where: { id: dto.resepId, userId, deletedAt: null },
      include: { detailResep: true },
    });
    if (!resep) throw new NotFoundException('Resep tidak ditemukan');
    if (resep.estimasiHasil === 0) {
      throw new BadRequestException('Estimasi hasil resep tidak boleh 0');
    }

    const scale = dto.hasilNyata / resep.estimasiHasil;

    const newProduksi = await this.prisma.$transaction(async (tx) => {
      const shortages: string[] = [];
      const bahanData = new Map<
        number,
        {
          kebutuhan: number;
          nama: string;
          satuan: string;
          hargaTerakhir: number;
        }
      >();

      for (const detail of resep.detailResep) {
        const kebutuhan = Number(detail.jumlah) * scale;
        const bahan = await tx.bahanBaku.findUnique({
          where: { id: detail.bahanBakuId },
        });
        if (!bahan) {
          throw new BadRequestException(
            `Bahan baku ID ${detail.bahanBakuId} tidak ditemukan`,
          );
        }

        if (Number(bahan.stok) < kebutuhan) {
          shortages.push(
            `${bahan.nama}: butuh ${kebutuhan.toFixed(3)}, tersedia ${Number(bahan.stok).toFixed(3)}`,
          );
        }

        bahanData.set(detail.bahanBakuId, {
          kebutuhan,
          nama: bahan.nama,
          satuan: detail.satuan,
          hargaTerakhir: Number(bahan.hargaTerakhir),
        });
      }

      if (shortages.length > 0) {
        throw new BadRequestException(
          `Stok tidak mencukupi: ${shortages.join('; ')}`,
        );
      }

      for (const [bahanBakuId, data] of bahanData) {
        await tx.bahanBaku.update({
          where: { id: bahanBakuId },
          data: { stok: { decrement: data.kebutuhan } },
        });
      }

      const totalBahan = resep.detailResep.reduce((sum, d) => {
        const data = bahanData.get(d.bahanBakuId);
        return sum + Number(d.jumlah) * (data?.hargaTerakhir ?? 0);
      }, 0);
      const hppPerPcs = totalBahan / resep.estimasiHasil;
      const totalModal = hppPerPcs * dto.hasilNyata;

      return tx.produksi.create({
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
          detailProduksi: {
            create: Array.from(bahanData.entries()).map(
              ([bahanBakuId, data]) => ({
                bahanBakuId,
                nama: data.nama,
                jumlah: data.kebutuhan,
                satuan: data.satuan as any,
                hargaTerakhir: data.hargaTerakhir,
                total: data.kebutuhan * data.hargaTerakhir,
              }),
            ),
          },
        },
      });
    });

    return this.findOne(newProduksi.id, userId);
  }

  async update(id: number, userId: number, dto: UpdateProduksiDto) {
    const produksi = await this.findOne(id, userId);
    if (produksi.status !== 'DRAFT') {
      throw new BadRequestException(
        'Hanya produksi berstatus DRAFT yang bisa diubah hasilNyata-nya',
      );
    }
    if (produksi.hasilNyata === dto.hasilNyata) return produksi;

    const oldDetails = await this.prisma.detailProduksi.findMany({
      where: { produksiId: id },
    });

    await this.prisma.$transaction(async (tx) => {
      for (const d of oldDetails) {
        await tx.bahanBaku.update({
          where: { id: d.bahanBakuId },
          data: { stok: { increment: Number(d.jumlah) } },
        });
      }

      await tx.detailProduksi.deleteMany({ where: { produksiId: id } });

      const resep = await tx.resep.findFirst({
        where: { id: produksi.resepId, userId, deletedAt: null },
        include: { detailResep: true },
      });
      if (!resep) throw new NotFoundException('Resep tidak ditemukan');
      if (resep.estimasiHasil === 0) {
        throw new BadRequestException('Estimasi hasil resep tidak boleh 0');
      }

      const scale = dto.hasilNyata / resep.estimasiHasil;

      const shortages: string[] = [];
      const bahanData = new Map<
        number,
        {
          kebutuhan: number;
          nama: string;
          satuan: string;
          hargaTerakhir: number;
        }
      >();

      for (const detail of resep.detailResep) {
        const kebutuhan = Number(detail.jumlah) * scale;
        const bahan = await tx.bahanBaku.findUnique({
          where: { id: detail.bahanBakuId },
        });
        if (!bahan) {
          throw new BadRequestException(
            `Bahan baku ID ${detail.bahanBakuId} tidak ditemukan`,
          );
        }

        if (Number(bahan.stok) < kebutuhan) {
          shortages.push(
            `${bahan.nama}: butuh ${kebutuhan.toFixed(3)}, tersedia ${Number(bahan.stok).toFixed(3)}`,
          );
        }

        bahanData.set(detail.bahanBakuId, {
          kebutuhan,
          nama: bahan.nama,
          satuan: detail.satuan,
          hargaTerakhir: Number(bahan.hargaTerakhir),
        });
      }

      if (shortages.length > 0) {
        throw new BadRequestException(
          `Stok tidak mencukupi: ${shortages.join('; ')}`,
        );
      }

      for (const [bahanBakuId, data] of bahanData) {
        await tx.bahanBaku.update({
          where: { id: bahanBakuId },
          data: { stok: { decrement: data.kebutuhan } },
        });
      }

      const totalModal = Number(produksi.hppPerPcs) * dto.hasilNyata;

      await tx.produksi.update({
        where: { id },
        data: {
          hasilNyata: dto.hasilNyata,
          totalModal,
          detailProduksi: {
            create: Array.from(bahanData.entries()).map(
              ([bahanBakuId, data]) => ({
                bahanBakuId,
                nama: data.nama,
                jumlah: data.kebutuhan,
                satuan: data.satuan as any,
                hargaTerakhir: data.hargaTerakhir,
                total: data.kebutuhan * data.hargaTerakhir,
              }),
            ),
          },
        },
      });
    });

    return this.findOne(id, userId);
  }

  async selesai(id: number, userId: number) {
    const produksi = await this.findOne(id, userId);
    if (produksi.status !== 'DRAFT') {
      throw new BadRequestException(
        'Hanya produksi berstatus DRAFT yang bisa diselesaikan',
      );
    }

    await this.prisma.produksi.update({
      where: { id },
      data: { status: 'SELESAI' },
    });

    return this.findOne(id, userId);
  }

  async remove(id: number, userId: number) {
    const produksi = await this.findOne(id, userId);
    if (produksi.status !== 'DRAFT') {
      throw new BadRequestException(
        'Hanya produksi berstatus DRAFT yang bisa dibatalkan',
      );
    }

    await this.prisma.$transaction(async (tx) => {
      const details = await tx.detailProduksi.findMany({
        where: { produksiId: id },
      });

      for (const d of details) {
        await tx.bahanBaku.update({
          where: { id: d.bahanBakuId },
          data: { stok: { increment: Number(d.jumlah) } },
        });
      }

      await tx.produksi.update({
        where: { id },
        data: { status: 'BATAL' },
      });
    });

    return { message: 'Produksi berhasil dibatalkan' };
  }
}
