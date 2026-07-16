import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { LaporanQueryDto } from './dto/laporan-query.dto';

@Injectable()
export class LaporanService {
  constructor(private readonly prisma: PrismaService) {}

  // 1. GET /laporan/ringkasan - StatsCards Dinamis & Akurat
  async getRingkasan(userId: number, days: number = 7) {
    // Window periode sekarang & pembanding (periode sebelumnya dgn panjang sama)
    const hariIni = new Date();
    hariIni.setHours(23, 59, 59, 999);

    const awalPeriode = new Date();
    awalPeriode.setDate(awalPeriode.getDate() - days);
    awalPeriode.setHours(0, 0, 0, 0);

    const akhirPeriodeLalu = new Date(awalPeriode);
    akhirPeriodeLalu.setMilliseconds(akhirPeriodeLalu.getMilliseconds() - 1);

    const awalPeriodeLalu = new Date(awalPeriode);
    awalPeriodeLalu.setDate(awalPeriodeLalu.getDate() - days);

    const tujuhHariLalu = awalPeriode;
    const empatBelasHariLalu = awalPeriodeLalu;

    const [
      totalPendapatan,
      totalTerjual,
      totalModal,
      pengeluaranLain,
      // Query tambahan untuk pembanding Minggu Lalu (7-14 hari yang lalu)
      pendapatanLalu,
      terjualLalu,
      modalLalu,
      pengeluaranLalu,
    ] = await Promise.all([
      // --- PERIODE SEKARANG (7 HARI INI) ---
      this.prisma.penjualan.aggregate({
        where: { userId, tanggal: { gte: tujuhHariLalu, lte: hariIni } },
        _sum: { totalPendapatan: true },
      }),
      this.prisma.penjualan.aggregate({
        where: { userId, tanggal: { gte: tujuhHariLalu, lte: hariIni } },
        _sum: { terjual: true },
      }),
      this.prisma.penjualan.findMany({
        where: { userId, tanggal: { gte: tujuhHariLalu, lte: hariIni } },
        select: { terjual: true, produksi: { select: { hppPerPcs: true } } },
      }),
      this.prisma.pengeluaranLain.aggregate({
        where: { userId, tanggal: { gte: tujuhHariLalu, lte: hariIni } },
        _sum: { jumlah: true },
      }),

      // --- PERIODE SEBELUMNYA (MINGGU LALU) ---
      this.prisma.penjualan.aggregate({
        where: {
          userId,
          tanggal: { gte: empatBelasHariLalu, lt: tujuhHariLalu },
        },
        _sum: { totalPendapatan: true },
      }),
      this.prisma.penjualan.aggregate({
        where: {
          userId,
          tanggal: { gte: empatBelasHariLalu, lt: tujuhHariLalu },
        },
        _sum: { terjual: true },
      }),
      this.prisma.penjualan.findMany({
        where: {
          userId,
          tanggal: { gte: empatBelasHariLalu, lt: tujuhHariLalu },
        },
        select: { terjual: true, produksi: { select: { hppPerPcs: true } } },
      }),
      this.prisma.pengeluaranLain.aggregate({
        where: {
          userId,
          tanggal: { gte: empatBelasHariLalu, lt: tujuhHariLalu },
        },
        _sum: { jumlah: true },
      }),
    ]);

    // Kalkulasi Data Sekarang
    const totalPendapatanValue = Number(
      totalPendapatan._sum.totalPendapatan ?? 0,
    );
    const totalTerjualValue = totalTerjual._sum.terjual ?? 0;
    let totalModalValue = 0;
    for (const p of totalModal) {
      totalModalValue += Number(p.produksi?.hppPerPcs ?? 0) * p.terjual;
    }
    const pengeluaranLainValue = Number(pengeluaranLain._sum.jumlah ?? 0);
    const totalPengeluaran = totalModalValue + pengeluaranLainValue;
    const labaBersih = totalPendapatanValue - totalPengeluaran;
    const marginKeuntungan =
      totalPendapatanValue > 0 ? (labaBersih / totalPendapatanValue) * 100 : 0;

    // Kalkulasi Data Minggu Lalu (Pembanding)
    const pendapatanLaluVal = Number(pendapatanLalu._sum.totalPendapatan ?? 0);
    const terjualLaluVal = terjualLalu._sum.terjual ?? 0;
    let modalLaluVal = 0;
    for (const p of modalLalu) {
      modalLaluVal += Number(p.produksi?.hppPerPcs ?? 0) * p.terjual;
    }
    const pengeluaranLaluVal = Number(pengeluaranLalu._sum.jumlah ?? 0);
    const labaLaluVal = pendapatanLaluVal - (modalLaluVal + pengeluaranLaluVal);

    // Fungsi Pembantu Perubahan Persentase Bertipe Angka (Number)
    const hitungTren = (sekarang: number, lalu: number) => {
      if (lalu === 0) return sekarang > 0 ? 100 : 0;
      return Number((((sekarang - lalu) / lalu) * 100).toFixed(1));
    };

    return {
      totalPendapatan: totalPendapatanValue,
      totalHpp: totalModalValue,
      totalLaba: labaBersih,
      margin: Number(marginKeuntungan.toFixed(1)),
      penjualan: totalTerjualValue,
      tren: {
        pendapatan: hitungTren(totalPendapatanValue, pendapatanLaluVal),
        hpp: hitungTren(totalModalValue, modalLaluVal),
        laba: hitungTren(labaBersih, labaLaluVal),
        margin: Number(
          (
            marginKeuntungan -
            (pendapatanLaluVal > 0
              ? (labaLaluVal / pendapatanLaluVal) * 100
              : 0)
          ).toFixed(1),
        ),
      },
    };
  }

  // 2. GET /laporan/grafik-laba - ProfitChart
  async getGrafikLaba(userId: number, days: number = 7) {
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0);

    const penjualan = await this.prisma.penjualan.findMany({
      where: {
        userId,
        tanggal: {
          gte: startDate,
          lte: today,
        },
      },
      select: {
        tanggal: true,
        totalPendapatan: true,
        produksi: { select: { hppPerPcs: true } },
        terjual: true,
      },
    });

    const pengeluaranLain = await this.prisma.pengeluaranLain.findMany({
      where: {
        userId,
        tanggal: {
          gte: startDate,
          lte: today,
        },
      },
      select: {
        tanggal: true,
        jumlah: true,
      },
    });

    const isMonthly = days > 30;

    // Use Map keyed by formatted label
    const aggregated = new Map<
      string,
      { pendapatan: number; modal: number; pengeluaran: number }
    >();

    // Helper to format label based on range
    const fmtLabel = (d: Date) =>
      isMonthly
        ? d.toLocaleDateString('id-ID', { month: 'short', year: 'numeric' })
        : d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });

    // Initialize periods
    if (isMonthly) {
      // Group by month: iterate month by month
      const cursor = new Date(startDate);
      while (cursor <= today) {
        const label = cursor.toLocaleDateString('id-ID', {
          month: 'short',
          year: 'numeric',
        });
        if (!aggregated.has(label)) {
          aggregated.set(label, { pendapatan: 0, modal: 0, pengeluaran: 0 });
        }
        cursor.setMonth(cursor.getMonth() + 1);
      }
    } else {
      // Initialize each day
      for (let i = 0; i < days; i++) {
        const d = new Date(startDate);
        d.setDate(d.getDate() + i);
        const label = fmtLabel(d);
        aggregated.set(label, { pendapatan: 0, modal: 0, pengeluaran: 0 });
      }
    }

    for (const p of penjualan) {
      const label = fmtLabel(new Date(p.tanggal));
      const existing = aggregated.get(label);
      if (existing) {
        existing.pendapatan += Number(p.totalPendapatan);
        existing.modal += Number(p.produksi.hppPerPcs) * p.terjual;
      }
    }

    for (const p of pengeluaranLain) {
      const label = fmtLabel(new Date(p.tanggal));
      const existing = aggregated.get(label);
      if (existing) {
        existing.pengeluaran += Number(p.jumlah);
      }
    }

    return Array.from(aggregated.entries()).map(([label, data]) => ({
      label,
      pendapatan: data.pendapatan,
      hpp: data.modal,
      laba: data.pendapatan - data.modal - data.pengeluaran,
    }));
  }

  // 3. GET /laporan/distribusi-hpp - ExpenseChart
  async getDistribusiHpp(userId: number) {
    const pengeluaran = await this.prisma.pengeluaranLain.findMany({
      where: { userId },
      select: { nama: true, jumlah: true },
    });

    // Group by nama
    const grouped = new Map<string, number>();
    for (const p of pengeluaran) {
      const existing = grouped.get(p.nama) ?? 0;
      grouped.set(p.nama, existing + Number(p.jumlah));
    }

    const total = Array.from(grouped.values()).reduce((a, b) => a + b, 0);

    // Warna untuk kategori
    const colors = [
      '#FF8A00', // orange primary
      '#F4D03F', // yellow
      '#06D6A0', // green
      '#2E294E', // dark purple
      '#00B4D8', // cyan
      '#606C38', // olive
    ];

    return Array.from(grouped.entries())
      .map(([nama, value], index) => ({
        nama,
        value,
        color: colors[index % colors.length],
        pct: total > 0 ? Number(((value / total) * 100).toFixed(1)) : 0,
      }))
      .sort((a, b) => b.value - a.value);
  }

  // 4. GET /laporan/aktivitas-terbaru - RecentActivity
  async getAktivitasTerbaru(userId: number) {
    const [penjualan, pengeluaran] = await Promise.all([
      this.prisma.penjualan.findMany({
        where: { userId },
        include: {
          produksi: { select: { resep: { select: { nama: true } } } },
        },
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
      this.prisma.pengeluaranLain.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
    ]);

    // Gabungkan dan urutkan
    const activities = [
      ...penjualan.map((p) => ({
        type: 'penjualan',
        description: `Penjualan: ${p.terjual} pcs ${p.produksi.resep.nama}`,
        time: p.createdAt,
        amount: Number(p.totalPendapatan),
        amountType: 'positive' as const,
      })),
      ...pengeluaran.map((p) => ({
        type: 'pengeluaran',
        description: `Pengeluaran: ${p.nama}`,
        time: p.createdAt,
        amount: Number(p.jumlah),
        amountType: 'negative' as const,
      })),
    ];

    activities.sort(
      (a, b) => new Date(b.time).getTime() - new Date(a.time).getTime(),
    );

    return activities.slice(0, 5);
  }

  // 5. GET /laporan/produk-terlaris - TopProducts
  async getProdukTerlaris(userId: number) {
    const penjualan = await this.prisma.penjualan.findMany({
      where: { userId },
      include: {
        produksi: {
          select: { hppPerPcs: true, resep: { select: { nama: true } } },
        },
      },
    });

    // Group by resep
    const grouped = new Map<
      string,
      { sold: number; revenue: number; laba: number }
    >();
    for (const p of penjualan) {
      const nama = p.produksi.resep.nama;
      const existing = grouped.get(nama) ?? { sold: 0, revenue: 0, laba: 0 };
      const revenue = Number(p.totalPendapatan);
      const modal = p.terjual * Number(p.produksi.hppPerPcs);
      existing.sold += p.terjual;
      existing.revenue += revenue;
      existing.laba += revenue - modal;
      grouped.set(nama, existing);
    }

    return Array.from(grouped.entries())
      .map(([name, data]) => ({
        name,
        sold: `${data.sold} pcs`,
        revenue: `Rp ${data.revenue.toLocaleString('id-ID')}`,
        laba: Math.round(data.laba),
      }))
      .sort(
        (a, b) =>
          Number(b.sold.replace(' pcs', '')) -
          Number(a.sold.replace(' pcs', '')),
      )
      .slice(0, 5);
  }
}