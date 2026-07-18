export interface Pengeluaran {
  id: number;
  userId: number;
  tanggal: string;
  nama: string;
  jumlah: number;
  kategori: Kategori;
  createdAt: string;
  updatedAt: string;
}

export type Kategori = "UTILITAS" | "KEMASAN" | "TRANSPORTASI" | "KEBERSIHAN" | "LAINNYA";