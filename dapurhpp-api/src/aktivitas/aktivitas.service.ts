import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { QueryAktivitasDto } from './dto/query-aktivitas.dto';

export interface AktivitasItem {
  id: string;
  type: 'penjualan' | 'belanja' | 'produksi' | 'pengeluaran';
  title: string;
  subtitle: string;
  time: string;
  amount?: number;
  amountType?: 'positive' | 'negative';
  status?: string;
}

@Injectable()
export class AktivitasService {
  constructor(private readonly prisma: PrismaService) {}

  private getDateRange(query: QueryAktivitasDto) {
    const { startDate: qStart, endDate: qEnd } = query;
    let startDate: Date;
    let endDate: Date;

    if (qStart && qEnd) {
      startDate = new Date(qStart);
      startDate.setHours(0, 0, 0, 0);
      endDate = new Date(qEnd);
      endDate.setHours(23, 59, 59, 999);
    } else if (qStart) {
      startDate = new Date(qStart);
      startDate.setHours(0, 0, 0, 0);
      endDate = new Date(qStart);
      endDate.setHours(23, 59, 59, 999);
    } else {
      endDate = new Date();
      endDate.setHours(23, 59, 59, 999);
      startDate = new Date();
      startDate.setDate(startDate.getDate() - 7);
      startDate.setHours(0, 0, 0, 0);
    }

    return { startDate, endDate };
  }

  private getMonthRange() {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    startOfMonth.setHours(0, 0, 0, 0);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    endOfMonth.setHours(23, 59, 59, 999);
    return { startOfMonth, endOfMonth };
  }

  private getWeekRange() {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const diff = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - diff);
    startOfWeek.setHours(0, 0, 0, 0);
    const endOfWeek = new Date(now);
    endOfWeek.setHours(23, 59, 59, 999);
    return { startOfWeek, endOfWeek };
  }

  async findAll(userId: number, query: QueryAktivitasDto) {
    const { search, type, page = 1, limit = 10 } = query;
    const { startDate, endDate } = this.getDateRange(query);
    const skip = (page - 1) * limit;

    const promises: Promise<AktivitasItem[]>[] = [];

    if (!type || type === 'all' || type === 'penjualan') {
      promises.push(this.fetchPenjualan(userId, startDate, endDate, search));
    }
    if (!type || type === 'all' || type === 'belanja') {
      promises.push(this.fetchBelanja(userId, startDate, endDate, search));
    }
    if (!type || type === 'all' || type === 'produksi') {
      promises.push(this.fetchProduksi(userId, startDate, endDate, search));
    }
    if (!type || type === 'all' || type === 'pengeluaran') {
      promises.push(this.fetchPengeluaran(userId, startDate, endDate, search));
    }

    const results = await Promise.all(promises);
    let allItems = results.flat();

    // search di application layer untuk belanja (field tidak searchable di Prisma)
    if (search) {
      const q = search.toLowerCase();
      allItems = allItems.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.subtitle.toLowerCase().includes(q),
      );
    }

    allItems.sort(
      (a, b) => new Date(b.time).getTime() - new Date(a.time).getTime(),
    );

    const total = allItems.length;
    const totalPages = Math.ceil(total / limit);
    const data = allItems.slice(skip, skip + limit);

    return { data, page, limit, total, totalPages };
  }

  async getStats(userId: number) {
    const now = new Date();

    // Hari ini
    const todayStart = new Date(now);
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date(now);
    todayEnd.setHours(23, 59, 59, 999);

    const { startOfWeek, endOfWeek } = this.getWeekRange();
    const { startOfMonth, endOfMonth } = this.getMonthRange();

    const [
      penjualanHariIni,
      belanjaHariIni,
      produksiHariIni,
      pengeluaranHariIni,
      penjualanMinggu,
      belanjaMinggu,
      produksiMinggu,
      pengeluaranMinggu,
      penjualanBulan,
      belanjaBulan,
      produksiBulan,
      pengeluaranBulan,
    ] = await Promise.all([
      this.prisma.penjualan.count({
        where: { userId, createdAt: { gte: todayStart, lte: todayEnd } },
      }),
      this.prisma.belanja.count({
        where: { userId, createdAt: { gte: todayStart, lte: todayEnd } },
      }),
      this.prisma.produksi.count({
        where: { userId, createdAt: { gte: todayStart, lte: todayEnd } },
      }),
      this.prisma.pengeluaranLain.count({
        where: { userId, createdAt: { gte: todayStart, lte: todayEnd } },
      }),
      this.prisma.penjualan.count({
        where: { userId, createdAt: { gte: startOfWeek, lte: endOfWeek } },
      }),
      this.prisma.belanja.count({
        where: { userId, createdAt: { gte: startOfWeek, lte: endOfWeek } },
      }),
      this.prisma.produksi.count({
        where: { userId, createdAt: { gte: startOfWeek, lte: endOfWeek } },
      }),
      this.prisma.pengeluaranLain.count({
        where: { userId, createdAt: { gte: startOfWeek, lte: endOfWeek } },
      }),
      this.prisma.penjualan.count({
        where: { userId, createdAt: { gte: startOfMonth, lte: endOfMonth } },
      }),
      this.prisma.belanja.count({
        where: { userId, createdAt: { gte: startOfMonth, lte: endOfMonth } },
      }),
      this.prisma.produksi.count({
        where: { userId, createdAt: { gte: startOfMonth, lte: endOfMonth } },
      }),
      this.prisma.pengeluaranLain.count({
        where: { userId, createdAt: { gte: startOfMonth, lte: endOfMonth } },
      }),
    ]);

    const today =
      penjualanHariIni + belanjaHariIni + produksiHariIni + pengeluaranHariIni;
    const thisWeek =
      penjualanMinggu + belanjaMinggu + produksiMinggu + pengeluaranMinggu;
    const thisMonth =
      penjualanBulan + belanjaBulan + produksiBulan + pengeluaranBulan;

    const typeCounts = [
      { type: 'penjualan' as const, count: penjualanBulan },
      { type: 'belanja' as const, count: belanjaBulan },
      { type: 'produksi' as const, count: produksiBulan },
      { type: 'pengeluaran' as const, count: pengeluaranBulan },
    ];
    typeCounts.sort((a, b) => b.count - a.count);
    const topType = typeCounts[0];

    return { today, thisWeek, thisMonth, topType };
  }

  private async fetchPenjualan(
    userId: number,
    startDate: Date,
    endDate: Date,
    search?: string,
  ): Promise<AktivitasItem[]> {
    const where: any = {
      userId,
      createdAt: { gte: startDate, lte: endDate },
    };

    if (search) {
      where.produksi = {
        resep: { nama: { contains: search } },
      };
    }

    const data = await this.prisma.penjualan.findMany({
      where,
      include: {
        produksi: {
          select: {
            resep: { select: { nama: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return data.map((p) => ({
      id: `penjualan-${p.id}`,
      type: 'penjualan' as const,
      title: `Penjualan ${p.produksi?.resep?.nama ?? ''}`,
      subtitle: `${p.terjual} pcs terjual`,
      time: p.createdAt.toISOString(),
      amount: Number(p.totalPendapatan),
      amountType: 'positive' as const,
    }));
  }

  private async fetchBelanja(
    userId: number,
    startDate: Date,
    endDate: Date,
    _search?: string,
  ): Promise<AktivitasItem[]> {
    const where: any = {
      userId,
      createdAt: { gte: startDate, lte: endDate },
    };

    const data = await this.prisma.belanja.findMany({
      where,
      include: {
        detailBelanja: {
          include: {
            bahanBaku: { select: { nama: true } },
            supplier: { select: { nama: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return data.map((b) => {
      const bahanNames = b.detailBelanja.map((d) => d.bahanBaku.nama);
      const uniqueBahan = [...new Set(bahanNames)];
      const subtitle =
        uniqueBahan.length > 0
          ? uniqueBahan.slice(0, 3).join(', ') +
            (uniqueBahan.length > 3 ? '...' : '')
          : 'Belanja Pasar';

      return {
        id: `belanja-${b.id}`,
        type: 'belanja' as const,
        title: `Belanja ${b.detailBelanja.length} bahan baku`,
        subtitle,
        time: b.createdAt.toISOString(),
        amount: Number(b.totalBelanja),
        amountType: 'negative' as const,
      };
    });
  }

  private async fetchProduksi(
    userId: number,
    startDate: Date,
    endDate: Date,
    search?: string,
  ): Promise<AktivitasItem[]> {
    const where: any = {
      userId,
      createdAt: { gte: startDate, lte: endDate },
    };

    if (search) {
      where.resep = { nama: { contains: search } };
    }

    const data = await this.prisma.produksi.findMany({
      where,
      include: {
        resep: { select: { nama: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return data.map((p) => {
      const isBatal = p.status === 'BATAL';
      return {
        id: `produksi-${p.id}`,
        type: 'produksi' as const,
        title: `Produksi ${p.resep?.nama ?? ''}`,
        subtitle: `Hasil: ${p.hasilNyata} pcs`,
        time: p.createdAt.toISOString(),
        amount: isBatal ? undefined : Number(p.totalModal),
        amountType: isBatal ? undefined : ('negative' as const),
        status: p.status,
      };
    });
  }

  private async fetchPengeluaran(
    userId: number,
    startDate: Date,
    endDate: Date,
    search?: string,
  ): Promise<AktivitasItem[]> {
    const where: any = {
      userId,
      createdAt: { gte: startDate, lte: endDate },
    };

    if (search) {
      where.nama = { contains: search };
    }

    const data = await this.prisma.pengeluaranLain.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return data.map((p) => ({
      id: `pengeluaran-${p.id}`,
      type: 'pengeluaran' as const,
      title: `Pengeluaran: ${p.nama}`,
      subtitle: `Kategori: ${p.kategori}`,
      time: p.createdAt.toISOString(),
      amount: Number(p.jumlah),
      amountType: 'negative' as const,
    }));
  }
}
