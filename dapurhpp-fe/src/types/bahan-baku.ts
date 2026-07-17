export type Satuan = "kg" | "gram" | "liter" | "ml" | "bungkus" | "buah" | "pcs" | "sdm" | "sdt";
export type KategoriBahan = "TEPUNG" | "MINYAK" | "SAYURAN" | "BUMBU" | "DAGING" | "LAINNYA";

export interface BahanBaku {
  id: number;
  userId: number;
  nama: string;
  satuan: Satuan;
  kategori: KategoriBahan;
  hargaTerakhir: number;
  fotoUrl?: string | null;
  stok: number;
  stokMinimal: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface CreateBahanBakuDto {
  nama: string;
  satuan: Satuan;
  kategori?: KategoriBahan;
  hargaTerakhir?: number;
  fotoUrl?: string;
  stok?: number;
  stokMinimal?: number;
}

export interface UpdateBahanBakuDto {
  nama?: string;
  satuan?: Satuan;
  kategori?: KategoriBahan;
  hargaTerakhir?: number;
  fotoUrl?: string;
  stok?: number;
  stokMinimal?: number;
}

export interface RiwayatHarga {
  label: string;
  harga: number;
}
