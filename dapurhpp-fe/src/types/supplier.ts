export interface Supplier {
  id: number;
  userId: number;
  nama: string;
  telepon: string | null;
  alamat: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface CreateSupplierDto {
  nama: string;
  telepon?: string;
  alamat?: string;
}

export interface UpdateSupplierDto {
  nama?: string;
  telepon?: string;
  alamat?: string;
}