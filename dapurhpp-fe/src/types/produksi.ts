export interface Produksi {
  id: number;
  resepId: number;
  tanggal: string;
  estimasiHasil: number;
  hasilNyata: number | null;
  hppPerPcs: number;
  hargaJualSaatProduksi: number | null;
  totalModal: number;
  status: 'DRAFT' | 'SELESAI' | 'BATAL';
  createdAt: string;
  updatedAt: string;
  resep: {
    id: number;
    nama: string;
    fotoUrl: string | null;
    estimasiHasil: number;
  };
  detailProduksi?: ProduksiDetail[];
}

export interface ProduksiDetail {
  bahanBakuId: number;
  nama: string;
  jumlah: number;
  satuan: string;
  hargaTerakhir: number;
  total: number;
}

export interface CreateProduksiDto {
  resepId: number;
  tanggal: string;
  hasilNyata: number;
}
