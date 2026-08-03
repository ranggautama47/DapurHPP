export interface AktivitasItem {
  id: number;
  type: "penjualan" | "belanja" | "produksi" | "pengeluaran";
  title: string;
  subtitle?: string;
  time: string;
  amount?: number;
  amountType?: "positive" | "negative";
  status?: string;
}

export interface AktivitasResponse {
  data: AktivitasItem[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface AktivitasStats {
  today: number;
  thisWeek: number;
  thisMonth: number;
  topType: {
    type: "penjualan" | "belanja" | "produksi" | "pengeluaran";
    count: number;
  };
}