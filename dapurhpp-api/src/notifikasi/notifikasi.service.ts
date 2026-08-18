import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as crypto from 'crypto';

interface NotifItem {
  id: number;
  tipe: string;
  judul: string;
  deskripsi: string | null;
  icon: string;
  link: string | null;
  relatedId: number | null;
  isRead: boolean;
  createdAt: Date;
}

@Injectable()
export class NotifikasiService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(userId: number) {
    const [data, unreadCount] = await Promise.all([
      this.prisma.notifikasi.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 50,
      }),
      this.prisma.notifikasi.count({
        where: { userId, isRead: false },
      }),
    ]);
    return { data, unreadCount };
  }

  async generate(userId: number) {
    const now = new Date();
    const todayStart = new Date(now);
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date(now);
    todayEnd.setHours(23, 59, 59, 999);

    const weekStart = new Date(now);
    const dayOfWeek = now.getDay();
    const diff = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    weekStart.setDate(now.getDate() - diff);
    weekStart.setHours(0, 0, 0, 0);
    const weekEnd = new Date(now);
    weekEnd.setHours(23, 59, 59, 999);

    // === STALE CLEANUP (parallel where possible) ===
    const [belanjaAda, penjualanAda] = await Promise.all([
      this.prisma.belanja.findFirst({
        where: { userId, tanggal: { gte: weekStart, lte: weekEnd } },
        select: { id: true },
      }),
      this.prisma.penjualan.findFirst({
        where: { userId, tanggal: { gte: todayStart, lte: todayEnd } },
        select: { id: true },
      }),
    ]);

    const staleDeletes: Promise<any>[] = [];
    if (belanjaAda) {
      staleDeletes.push(
        this.prisma.notifikasi.deleteMany({
          where: { userId, tipe: 'reminder_belanja' },
        }),
      );
    }
    if (penjualanAda) {
      staleDeletes.push(
        this.prisma.notifikasi.deleteMany({
          where: { userId, tipe: 'reminder_penjualan' },
        }),
      );
    }
    // always delete old daily notifs
    staleDeletes.push(
      this.prisma.notifikasi.deleteMany({
        where: {
          userId,
          tipe: {
            in: ['penjualan_hari_ini', 'omzet_hari_ini', 'produksi_selesai'],
          },
          createdAt: { lt: todayStart },
        },
      }),
    );
    await Promise.all(staleDeletes);

    const candidates: {
      tipe: string;
      judul: string;
      deskripsi: string;
      icon: string;
      link: string | null;
      relatedId: number | null;
      hash: string;
    }[] = [];

    const [
      bahanBakuList,
      produksiDraftList,
      penjualanHariIni,
      penjualanAgg,
      produksiSelesaiHariIni,
      belanjaMingguIni,
    ] = await Promise.all([
      this.prisma.bahanBaku.findMany({
        where: { userId, deletedAt: null },
        select: {
          id: true,
          nama: true,
          stok: true,
          stokMinimal: true,
          satuan: true,
        },
      }),
      this.prisma.produksi.findMany({
        where: { userId, status: 'DRAFT' },
        select: { id: true, resep: { select: { nama: true } } },
      }),
      this.prisma.penjualan.findMany({
        where: { userId, tanggal: { gte: todayStart, lte: todayEnd } },
        select: {
          id: true,
          produksi: { select: { resep: { select: { nama: true } } } },
          terjual: true,
        },
      }),
      this.prisma.penjualan.aggregate({
        where: { userId, tanggal: { gte: todayStart, lte: todayEnd } },
        _sum: { totalPendapatan: true },
      }),
      this.prisma.produksi.findMany({
        where: {
          userId,
          status: 'SELESAI',
          createdAt: { gte: todayStart, lte: todayEnd },
        },
        select: {
          id: true,
          resep: { select: { nama: true } },
          hasilNyata: true,
        },
      }),
      this.prisma.belanja.findFirst({
        where: { userId, tanggal: { gte: weekStart, lte: weekEnd } },
        select: { id: true },
      }),
    ]);

    // Build candidates: combine stok loops
    for (const b of bahanBakuList) {
      const stokNum = Number(b.stok);
      if (stokNum === 0) {
        const hash = this.makeHash(`stok-habis-${b.id}`);
        candidates.push({
          tipe: 'stok_habis',
          judul: `${b.nama} habis`,
          deskripsi: `Stok ${b.nama} sudah habis (0 ${b.satuan}). Segera lakukan pembelian.`,
          icon: '📦',
          link: '/dashboard/bahan-baku',
          relatedId: b.id,
          hash,
        });
      } else if (stokNum <= Number(b.stokMinimal)) {
        const hash = this.makeHash(`stok-hampir-habis-${b.id}`);
        candidates.push({
          tipe: 'stok_hampir_habis',
          judul: `${b.nama} hampir habis`,
          deskripsi: `Sisa stok ${stokNum} ${b.satuan}. Segera lakukan pembelian.`,
          icon: '📦',
          link: '/dashboard/bahan-baku',
          relatedId: b.id,
          hash,
        });
      }
    }

    // Warning: produksi DRAFT
    for (const p of produksiDraftList) {
      const hash = this.makeHash(`produksi-draft-${p.id}`);
      candidates.push({
        tipe: 'produksi_draft',
        judul: `Produksi ${p.resep?.nama ?? '-'} masih DRAFT`,
        deskripsi: `Ada produksi yang belum diselesaikan.`,
        icon: '🏭',
        link: `/dashboard/produksi`,
        relatedId: p.id,
        hash,
      });
    }

    // Info: penjualan hari ini
    if (penjualanHariIni.length > 0) {
      const totalTerjual = penjualanHariIni.reduce(
        (sum, p) => sum + p.terjual,
        0,
      );
      const hash = this.makeHash(
        `penjualan-hari-${todayStart.toISOString().slice(0, 10)}`,
      );
      candidates.push({
        tipe: 'penjualan_hari_ini',
        judul: `Penjualan hari ini`,
        deskripsi: `${totalTerjual} pcs terjual dari ${penjualanHariIni.length} transaksi.`,
        icon: '🛒',
        link: '/dashboard/penjualan',
        relatedId: null,
        hash,
      });
    }

    // Info: omzet hari ini
    const omzet = Number(penjualanAgg._sum.totalPendapatan ?? 0);
    if (omzet > 0) {
      const hash = this.makeHash(
        `omzet-hari-${todayStart.toISOString().slice(0, 10)}`,
      );
      candidates.push({
        tipe: 'omzet_hari_ini',
        judul: `Omzet hari ini`,
        deskripsi: `Rp${omzet.toLocaleString('id-ID')}`,
        icon: '📈',
        link: '/dashboard/laporan',
        relatedId: null,
        hash,
      });
    }

    // Info: produksi selesai hari ini
    for (const p of produksiSelesaiHariIni) {
      const hash = this.makeHash(`produksi-selesai-${p.id}`);
      candidates.push({
        tipe: 'produksi_selesai',
        judul: `Produksi ${p.resep?.nama ?? '-'} selesai`,
        deskripsi: `${p.hasilNyata} pcs siap dijual.`,
        icon: '🏭',
        link: '/dashboard/produksi',
        relatedId: p.id,
        hash,
      });
    }

    // Reminder: belum ada belanja minggu ini
    if (!belanjaMingguIni) {
      const hash = this.makeHash(
        `reminder-belanja-minggu-${weekStart.toISOString().slice(0, 10)}`,
      );
      candidates.push({
        tipe: 'reminder_belanja',
        judul: `Belum ada belanja minggu ini`,
        deskripsi: `Jangan lupa belanja bahan baku untuk produksi minggu ini.`,
        icon: '⚠',
        link: '/dashboard/belanja',
        relatedId: null,
        hash,
      });
    }

    // Reminder: belum ada penjualan hari ini
    if (penjualanHariIni.length === 0) {
      const hash = this.makeHash(
        `reminder-penjualan-hari-${todayStart.toISOString().slice(0, 10)}`,
      );
      candidates.push({
        tipe: 'reminder_penjualan',
        judul: `Belum ada penjualan hari ini`,
        deskripsi: `Catat penjualan hari ini agar data tetap akurat.`,
        icon: '⚠',
        link: '/dashboard/penjualan',
        relatedId: null,
        hash,
      });
    }

    // Simpan candidates yang belum ada (dedup by hash)
    const existingHashes = await this.prisma.notifikasi.findMany({
      where: { userId, hash: { in: candidates.map((c) => c.hash) } },
      select: { hash: true },
    });
    const existingSet = new Set(existingHashes.map((e) => e.hash));

    const newNotifs = candidates
      .filter((c) => !existingSet.has(c.hash))
      .map((c) => ({
        userId,
        tipe: c.tipe,
        judul: c.judul,
        deskripsi: c.deskripsi,
        icon: c.icon,
        link: c.link,
        relatedId: c.relatedId,
        hash: c.hash,
      }));

    if (newNotifs.length > 0) {
      await this.prisma.notifikasi.createMany({
        data: newNotifs,
        skipDuplicates: true,
      });
    }

    // Hapus notifikasi yang tidak relevan lagi
    const staleHashes = new Set<string>();

    for (const b of bahanBakuList) {
      const stokNum = Number(b.stok);
      if (stokNum > 0) staleHashes.add(this.makeHash(`stok-habis-${b.id}`));
      if (stokNum > Number(b.stokMinimal))
        staleHashes.add(this.makeHash(`stok-hampir-habis-${b.id}`));
    }

    const draftIds = new Set(produksiDraftList.map((p) => p.id));
    const allProdIds = await this.prisma.produksi.findMany({
      where: { userId },
      select: { id: true },
    });
    for (const p of allProdIds) {
      if (!draftIds.has(p.id))
        staleHashes.add(this.makeHash(`produksi-draft-${p.id}`));
    }

    if (staleHashes.size > 0) {
      await this.prisma.notifikasi.deleteMany({
        where: { userId, hash: { in: Array.from(staleHashes) } },
      });
    }

    return this.findAll(userId);
  }

  async markAsRead(id: number, userId: number) {
    await this.prisma.notifikasi.updateMany({
      where: { id, userId },
      data: { isRead: true },
    });
    return { success: true };
  }

  async markAllAsRead(userId: number) {
    await this.prisma.notifikasi.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
    return { success: true };
  }

  async remove(id: number, userId: number) {
    await this.prisma.notifikasi.deleteMany({ where: { id, userId } });
    return { success: true };
  }

  private makeHash(key: string): string {
    return crypto.createHash('sha256').update(key).digest('hex').slice(0, 16);
  }
}
