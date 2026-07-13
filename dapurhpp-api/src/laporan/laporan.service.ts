import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LaporanService {
  constructor(private readonly prisma: PrismaService) {}

  // 1. GET /laporan/ringkasan - StatsCards
  async getRingkasan(userId: number) {
    const [totalPendapatan, totalTerjual, totalModal, pengeluaranLain] = await Promise.all([
      // Total pendapatan dari penjualan
      this.prisma.penjualan.aggregate({
        where: { userId },
        _sum: { totalPendapatan: true },
      }),
      // Total kuantitas terjual
      this.prisma.penjualan.aggregate({
        where: { userId },
        _sum: { terjual: true },
      }),
      // Total modal (HPP) dari produksi yang terkait dengan penjualan
      this.prisma.penjualan.findMany({
        where: { userId },
        select: {
          terjual: true,
          produksi: { select: { hppPerPcs: true } },
        },
      }),
      // Total pengeluaran lain
      this.prisma.pengeluaranLain.aggregate({
        where: { userId },
        _sum: { jumlah: true },
      }),
    ]);

    const totalPendapatanValue = Number(totalPendapatan._sum.totalPendapatan ?? 0);
    const totalTerjualValue = totalTerjual._sum.terjual ?? 0;
    
    // Hitung total modal dari produk yang terjual
    let totalModalValue = 0;
    for (const p of totalModal) {
      totalModalValue += Number(p.produksi.hppPerPcs) * p.terjual;
    }

    const pengeluaranLainValue = Number(pengeluaranLain._sum.jumlah ?? 0);
    const totalPengeluaran = totalModalValue + pengeluaranLainValue;
    const labaBersih = totalPendapatanValue - totalPengeluaran;
    const marginKeuntungan = totalPendapatanValue > 0 
      ? (labaBersih / totalPendapatanValue) * 100 
      : 0;

    return {
      pendapatan: totalPendapatanValue,
      modal: totalModalValue,
      penjualan: totalTerjualValue,
      marginKeuntungan: Number(marginKeuntungan.toFixed(2)),
      // Dummy persentase perubahan - bisa dikembangkan dengan perbandingan periode sebelumnya
      pendapatanChange: '+12.5%',
      modalChange: '+8.2%',
      penjualanChange: '+10.3%',
      marginChange: '+2.1%',
    };
  }

  // 2. GET /laporan/grafik-laba - ProfitChart
  async getGrafikLaba(userId: number, days: number = 7) {
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - days);

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
    const aggregated = new Map<string, { pendapatan: number; modal: number; pengeluaran: number }>();

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
        const label = cursor.toLocaleDateString('id-ID', { month: 'short', year: 'numeric' });
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
        include: { produksi: { select: { resep: { select: { nama: true } } } } },
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
      ...penjualan.map(p => ({
        type: 'penjualan',
        description: `Penjualan: ${p.terjual} pcs ${p.produksi.resep.nama}`,
        time: p.createdAt,
        amount: Number(p.totalPendapatan),
        amountType: 'positive' as const,
      })),
      ...pengeluaran.map(p => ({
        type: 'pengeluaran',
        description: `Pengeluaran: ${p.nama}`,
        time: p.createdAt,
        amount: Number(p.jumlah),
        amountType: 'negative' as const,
      })),
    ];

    activities.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());

    return activities.slice(0, 5);
  }

  // 5. GET /laporan/produk-terlaris - TopProducts
  async getProdukTerlaris(userId: number) {
    const penjualan = await this.prisma.penjualan.findMany({
      where: { userId },
      include: { produksi: { select: { resep: { select: { nama: true } } } } },
    });

    // Group by resep
    const grouped = new Map<string, { sold: number; revenue: number }>();
    for (const p of penjualan) {
      const nama = p.produksi.resep.nama;
      const existing = grouped.get(nama) ?? { sold: 0, revenue: 0 };
      existing.sold += p.terjual;
      existing.revenue += Number(p.totalPendapatan);
      grouped.set(nama, existing);
    }

    return Array.from(grouped.entries())
      .map(([name, data]) => ({
        name,
        sold: `${data.sold} pcs`,
        revenue: `Rp ${data.revenue.toLocaleString()}`,
        change: '+12%', // dummy untuk sekarang
      }))
      .sort((a, b) => Number(b.sold.replace(' pcs', '')) - Number(a.sold.replace(' pcs', '')))
      .slice(0, 5);
  }
}