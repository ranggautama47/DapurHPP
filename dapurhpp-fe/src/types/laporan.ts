export interface RingkasanLaporan {
  totalPendapatan: number;
  totalHpp: number;
  totalPengeluaran: number;
  totalLaba: number;
  margin: number;
  penjualan: number;
  tren: {
    pendapatan: number;
    hpp: number;
    pengeluaran: number;
    laba: number;
    margin: number;
  };
}

export interface GrafikLabaItem {
  label: string;
  pendapatan: number;
  hpp: number;
  laba: number;
}

export interface DistribusiHppItem {
  nama: string;
  value: number;
  color?: string;
  pct: number;
}

export interface AktivitasTerbaru {
  type: "penjualan" | "pengeluaran";
  description: string;
  time: string;
  amount: number;
  amountType: "positive" | "negative";
}

export interface ProdukTerlaris {
  name: string;
  sold: string;
  revenue: string;
  laba: number;
}

export type FilterPeriod = 1 | 7 | 30 | 90 | 180 | "custom";

export interface FilterState {
  period: FilterPeriod;
  tanggalMulai: string;
  tanggalAkhir: string;
}