import type { Pengeluaran, Kategori } from "@/types/pengeluaran";

export function formatRupiah(amount: number): string {
  return `Rp ${Number(amount).toLocaleString("id-ID")}`;
}

export function detectKategori(nama: string): Kategori {
  const lower = nama.toLowerCase();
  if (/listrik|elpiji|gas|air/.test(lower)) return "UTILITAS";
  if (/plastik|kemasan|kardus|box/.test(lower)) return "KEMASAN";
  if (/transport|bensin|motor|ojek/.test(lower)) return "TRANSPORTASI";
  if (/tisu|lap|sabun|kebersihan/.test(lower)) return "KEBERSIHAN";
  return "LAINNYA";
}

export function filterByKategori(
  items: Pengeluaran[],
  kategori: Kategori | "Semua"
): Pengeluaran[] {
  if (kategori === "Semua") return items;
  return items.filter((item) => item.kategori === kategori);
}

export function filterByDateRange(
  items: Pengeluaran[],
  from: string,
  to: string
): Pengeluaran[] {
  return items.filter((item) => item.tanggal >= from && item.tanggal <= to);
}


export interface PengeluaranStats {
  totalHariIni: number;
  totalMingguIni: number;
  totalBulanIni: number;
  rataRataHari: number;
}

export function calculateStats(
  items: Pengeluaran[],
  todayStr: string
): PengeluaranStats {
  const today = new Date(todayStr + "T00:00:00");

  const hariIni = items.filter((i) => i.tanggal === todayStr);

  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());
  const mingguIni = items.filter(
    (i) => i.tanggal >= formatLocalDate(startOfWeek) && i.tanggal <= todayStr
  );

  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const bulanIni = items.filter(
    (i) => i.tanggal >= formatLocalDate(startOfMonth) && i.tanggal <= todayStr
  );

  const totalHariIni = hariIni.reduce((sum, i) => sum + Number(i.jumlah), 0);
  const totalMingguIni = mingguIni.reduce((sum, i) => sum + Number(i.jumlah), 0);
  const totalBulanIni = bulanIni.reduce((sum, i) => sum + Number(i.jumlah), 0);
  const daysInMonth = new Date(
    today.getFullYear(),
    today.getMonth() + 1,
    0
  ).getDate();
  const rataRataHari = Math.round(totalBulanIni / daysInMonth);

  return { totalHariIni, totalMingguIni, totalBulanIni, rataRataHari };
}

function formatLocalDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}
