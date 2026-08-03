import { Satuan } from "./bahan-baku";

export interface BelanjaListItem {
  id: number;
  tanggal: string;
  totalBelanja: number;
  catatan?: string;
  jumlahItem: number;
  suppliers: string[];
}

export interface BelanjaRingkasan {
  tanggal: string;
  totalBelanja: number;
  jumlahItem: number;
  totalQty: number;
  jumlahSupplier: number;
  list: BelanjaListItem[];
}

export interface BelanjaDetail {
  id: number;
  tanggal: string;
  totalBelanja: number;
  catatan?: string;
  detailBelanja: {
    id: number;
    bahanBakuId: number;
    bahanBaku: { id: number; nama: string; fotoUrl: string | null; satuan: string };
    supplierId: number | null;
    supplier: { id: number; nama: string } | null;
    jumlah: number;
    satuan: string;
    hargaSatuan: number;
    subtotal: number;
  }[];
}

export interface DetailBelanja {
  id: number;
  bahanBakuId: number;
  supplierId: number | null;
  jumlah: number;
  satuan: Satuan;
  hargaSatuan: number;
  subtotal: number;
  bahanBaku: {
    id: number;
    nama: string;
    satuan: Satuan;
    fotoUrl: string | null;
  };
  supplier: {
    id: number;
    nama: string;
  } | null;
}

export interface Belanja {
  id: number;
  tanggal: string;
  totalBelanja: number;
  catatan: string | null;
  jumlahItem: number;
  suppliers: string[];
  detailBelanja: DetailBelanja[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateBelanjaDto {
  tanggal: string;
  catatan?: string;
  detailBelanja: {
    bahanBakuId: number;
    supplierId?: number;
    jumlah: number;
    satuan: Satuan;
    hargaSatuan: number;
  }[];
}