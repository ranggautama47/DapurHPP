import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { LaporanQueryDto } from './dto/laporan-query.dto';

@Injectable()
export class LaporanService {
  constructor(private readonly prisma: PrismaService) {}

  // Helper untuk menentukan tanggal dinamis berdasarkan query
  private batasiTanggal(query: LaporanQueryDto) {
    const { days = 7, date } = query;
    let startDate: Date;
    let endDate: Date;
    let prevStartDate: Date;

    if (date) {
      // Jika user pilih tanggal spesifik di kalender
      startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);

      endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);

      // Periode lalu untuk komparasi tren = 1 hari sebelumnya
      prevStartDate = new Date(startDate);
      prevStartDate.setDate(prevStartDate.getDate() - 1);
    } else {
      // Jika menggunakan filter default / rentang hari
      endDate = new Date();
      endDate.setHours(23, 59, 59, 999);

      startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
      startDate.setHours(0, 0, 0, 0);

      // Periode lalu = mundur sebanyak X hari lagi
      prevStartDate = new Date(startDate);
      prevStartDate.setDate(prevStartDate.getDate() - days);
    }

    return {
      startDate,
      endDate,
      prevStartDate,
      effectiveDays: date ? 1 : days,
    };
  }

  // 1. GET /laporan/ringkasan
  async getRingkasan(userId: number, query: LaporanQueryDto) {
    const { startDate, endDate, prevStartDate } = this.batasiTanggal(query);

    const [
      totalPendapatan,
      totalTerjual,
      totalModal,
      pengeluaranLain,
      pendapatanLalu,
      terjualLalu,
      modalLalu,
      pengeluaranLalu,
    ] = await Promise.all([
      this.prisma.penjualan.aggregate({
        where: { userId, tanggal: { gte: startDate, lte: endDate } },
        _sum: { totalPendapatan: true },
      }),
      this.prisma.penjualan.aggregate({
        where: { userId, tanggal: { gte: startDate, lte: endDate } },
        _sum: { terjual: true },
      }),
      this.prisma.penjualan.findMany({
        where: { userId, tanggal: { gte: startDate, lte: endDate } },
        select: { terjual: true, produksi: { select: { hppPerPcs: true } } },
      }),
      this.prisma.pengeluaranLain.aggregate({
        where: { userId, tanggal: { gte: startDate, lte: endDate } },
        _sum: { jumlah: true },
      }),
      this.prisma.penjualan.aggregate({
        where: { userId, tanggal: { gte: prevStartDate, lt: startDate } },
        _sum: { totalPendapatan: true },
      }),
      this.prisma.penjualan.aggregate({
        where: { userId, tanggal: { gte: prevStartDate, lt: startDate } },
        _sum: { terjual: true },
      }),
      this.prisma.penjualan.findMany({
        where: { userId, tanggal: { gte: prevStartDate, lt: startDate } },
        select: { terjual: true, produksi: { select: { hppPerPcs: true } } },
      }),
      this.prisma.pengeluaranLain.aggregate({
        where: { userId, tanggal: { gte: prevStartDate, lt: startDate } },
        _sum: { jumlah: true },
      }),
    ]);

    // Menghitung data periode sekarang
    const totalPendapatanValue = Number(
      totalPendapatan._sum.totalPendapatan ?? 0,
    );
    const totalTerjualValue = totalTerjual._sum.terjual ?? 0;
    let totalModalValue = 0;
    for (const p of totalModal) {
      const hpp = p.produksi?.hppPerPcs ?? 0;
      totalModalValue += Number(hpp) * p.terjual;
    }
    const pengeluaranLainValue = Number(pengeluaranLain._sum.jumlah ?? 0);
    const totalPengeluaran = totalModalValue + pengeluaranLainValue;
    const labaBersih = totalPendapatanValue - totalPengeluaran;
    const marginKeuntungan =
      totalPendapatanValue > 0 ? (labaBersih / totalPendapatanValue) * 100 : 0;

    // Menghitung data periode lalu
    const pendapatanLaluVal = Number(pendapatanLalu._sum.totalPendapatan ?? 0);
    let modalLaluVal = 0;
    for (const p of modalLalu) {
      const hpp = p.produksi?.hppPerPcs ?? 0;
      modalLaluVal += Number(hpp) * p.terjual;
    }
    const pengeluaranLaluVal = Number(pengeluaranLalu._sum.jumlah ?? 0);
    const totalPengeluaranLaluVal = modalLaluVal + pengeluaranLaluVal;
    const labaLaluVal = pendapatanLaluVal - totalPengeluaranLaluVal;

    const hitungTren = (sekarang: number, lalu: number) => {
      if (lalu === 0) return sekarang > 0 ? 100 : 0;
      return Number((((sekarang - lalu) / lalu) * 100).toFixed(1));
    };

    return {
      totalPendapatan: totalPendapatanValue,
      totalHpp: totalModalValue,
      totalPengeluaran,
      totalLaba: labaBersih,
      margin: Number(marginKeuntungan.toFixed(1)),
      penjualan: totalTerjualValue,
      tren: {
        pendapatan: hitungTren(totalPendapatanValue, pendapatanLaluVal),
        hpp: hitungTren(totalModalValue, modalLaluVal),
        pengeluaran: hitungTren(totalPengeluaran, totalPengeluaranLaluVal),
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

  // 2. GET /laporan/grafik-laba
  async getGrafikLaba(userId: number, query: LaporanQueryDto) {
    const { startDate, endDate, effectiveDays } = this.batasiTanggal(query);

    const penjualan = await this.prisma.penjualan.findMany({
      where: { userId, tanggal: { gte: startDate, lte: endDate } },
      select: {
        tanggal: true,
        totalPendapatan: true,
        produksi: { select: { hppPerPcs: true } },
        terjual: true,
      },
    });

    const pengeluaranLain = await this.prisma.pengeluaranLain.findMany({
      where: { userId, tanggal: { gte: startDate, lte: endDate } },
      select: { tanggal: true, jumlah: true },
    });

    const isMonthly = effectiveDays > 30;
    const aggregated = new Map<
      string,
      { pendapatan: number; modal: number; pengeluaran: number }
    >();

    const fmtLabel = (d: Date) =>
      isMonthly
        ? d.toLocaleDateString('id-ID', { month: 'short', year: 'numeric' })
        : d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });

    if (isMonthly) {
      const cursor = new Date(startDate);
      while (cursor <= endDate) {
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
      for (let i = 0; i < effectiveDays; i++) {
        const d = new Date(startDate);
        d.setDate(d.getDate() + i);
        aggregated.set(fmtLabel(d), {
          pendapatan: 0,
          modal: 0,
          pengeluaran: 0,
        });
      }
    }

    for (const p of penjualan) {
      const label = fmtLabel(new Date(p.tanggal));
      const existing = aggregated.get(label);
      if (existing) {
        const hpp = p.produksi?.hppPerPcs ?? 0;
        existing.pendapatan += Number(p.totalPendapatan);
        existing.modal += Number(hpp) * p.terjual;
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

  // 3. GET /laporan/distribusi-hpp
  async getDistribusiHpp(userId: number, query: LaporanQueryDto) {
    const { startDate, endDate } = this.batasiTanggal(query);

    const penjualan = await this.prisma.penjualan.findMany({
      where: { userId, tanggal: { gte: startDate, lte: endDate } },
      select: {
        terjual: true,
        produksi: {
          select: { hppPerPcs: true, resep: { select: { nama: true } } },
        },
      },
    });

    const grouped = new Map<string, number>();
    for (const p of penjualan) {
      if (!p.produksi) continue;
      const nama = p.produksi.resep?.nama ?? 'Tanpa Nama';
      const modal = p.terjual * Number(p.produksi.hppPerPcs ?? 0);
      grouped.set(nama, (grouped.get(nama) ?? 0) + modal);
    }

    const total = Array.from(grouped.values()).reduce((a, b) => a + b, 0);
    const colors = [
      '#FF8A00',
      '#F4D03F',
      '#06D6A0',
      '#2E294E',
      '#00B4D8',
      '#606C38',
    ];

    return Array.from(grouped.entries())
      .map(([nama, value], index) => ({
        nama,
        value: Math.round(value),
        color: colors[index % colors.length],
        pct: total > 0 ? Number(((value / total) * 100).toFixed(1)) : 0,
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  }

  // 4. GET /laporan/aktivitas-terbaru
  async getAktivitasTerbaru(userId: number, query: LaporanQueryDto) {
    const { startDate, endDate } = this.batasiTanggal(query);

    const [penjualan, pengeluaran] = await Promise.all([
      this.prisma.penjualan.findMany({
        where: { userId, tanggal: { gte: startDate, lte: endDate } },
        include: {
          produksi: { select: { resep: { select: { nama: true } } } },
        },
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
      this.prisma.pengeluaranLain.findMany({
        where: { userId, tanggal: { gte: startDate, lte: endDate } },
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
    ]);

    const activities = [
      ...penjualan.map((p) => ({
        type: 'penjualan',
        description: `Penjualan: ${p.terjual} pcs ${p.produksi?.resep?.nama ?? ''}`,
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

  // 5. GET /laporan/produk-terlaris
  // 5. GET /laporan/produk-terlaris
  async getProdukTerlaris(userId: number, query: LaporanQueryDto) {
    const { startDate, endDate } = this.batasiTanggal(query);

    const penjualan = await this.prisma.penjualan.findMany({
      where: { userId, tanggal: { gte: startDate, lte: endDate } },
      include: {
        produksi: {
          select: {
            hppPerPcs: true,
            // Ikut sertakan fotoUrl dari table resep
            // Catatan: Jika di schema.prisma Anda tertulis foto_url (menggunakan snake_case), ubah jadi foto_url: true
            resep: { select: { nama: true, fotoUrl: true } },
          },
        },
      },
    });

    // Deklarasi tipe data Map secara eksplisit agar TypeScript tidak error lagi
    const grouped = new Map<
      string,
      { sold: number; revenue: number; laba: number; fotoUrl: string | null }
    >();

    for (const p of penjualan) {
      if (!p.produksi) continue;

      const nama = p.produksi.resep?.nama ?? 'Tanpa Nama';
      const fotoUrl = p.produksi.resep?.fotoUrl ?? null; // Ambil foto dari database

      const revenue = Number(p.totalPendapatan);
      const modal = p.terjual * Number(p.produksi.hppPerPcs ?? 0);
      const currentLaba = revenue - modal;

      const existing = grouped.get(nama);

      if (existing) {
        // Jika produk sudah ada di Map, akumulasikan nilainya
        existing.sold += p.terjual;
        existing.revenue += revenue;
        existing.laba += currentLaba;
      } else {
        // Jika belum ada, buat data baru beserta properti fotoUrl
        grouped.set(nama, {
          sold: p.terjual,
          revenue: revenue,
          laba: currentLaba,
          fotoUrl: fotoUrl,
        });
      }
    }

    return Array.from(grouped.entries())
      .map(([name, data]) => ({
        name,
        sold: `${data.sold} pcs`,
        revenue: `Rp ${data.revenue.toLocaleString('id-ID')}`,
        laba: Math.round(data.laba),
        fotoUrl: data.fotoUrl, // Kirim ke frontend
      }))
      .sort(
        (a, b) =>
          Number(b.sold.replace(' pcs', '')) -
          Number(a.sold.replace(' pcs', '')),
      )
      .slice(0, 5);
  }
}
