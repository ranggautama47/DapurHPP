export type Satuan =
  | "kg"
  | "gram"
  | "liter"
  | "ml"
  | "pcs"
  | "buah"
  | "bungkus";

export interface DetailResep {
  id: number;
  bahanBakuId: number;
  jumlah: number;
  satuan: Satuan;
  bahanBaku: {
    nama: string;
    hargaTerakhir: number;
    satuan: Satuan;
  };
  subtotal: number;
}

export interface Resep {
  id: number;
  nama: string;
  fotoUrl: string | null;
  catatan?: string | null;
  estimasiHasil: number;
  hargaJual: number;
  hppPerPcs: number;
  totalBahan: number;
  marginPersen?: number;
  detailCount?: number;
  detailResep?: DetailResep[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateDetailResepInput {
  bahanBakuId: number;
  jumlah: number;
  satuan: Satuan;
}

export interface CreateResepDto {
  nama: string;
  estimasiHasil: number;
  hargaJual?: number;
  catatan?: string | null;
  detailResep: CreateDetailResepInput[];
}

export interface UpdateResepDto extends Partial<CreateResepDto> {}
