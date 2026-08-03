export interface Penjualan {
  id: number;
  produksiId: number;
  tanggal: string;
  terjual: number;
  hargaJual: number;
  totalPendapatan: number;
  totalHpp: number;
  laba: number;
  status: 'OPEN' | 'CLOSED';
  produksi: {
    id: number;
    hppPerPcs: number;
    resep: {
      nama: string;
    };
  };
}

export interface PenjualanRingkasan {
  totalPendapatan: number;
  totalLaba: number;
  list: Penjualan[];
}