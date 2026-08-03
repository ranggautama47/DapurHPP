export interface AktivitasQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  startDate?: string;
  endDate?: string;
  type?: "penjualan" | "belanja" | "produksi" | "pengeluaran" | "all";
}

export function buildAktivitasQuery(params: AktivitasQueryParams): string {
  const sp = new URLSearchParams();
  if (params.page) sp.set("page", String(params.page));
  if (params.limit) sp.set("limit", String(params.limit));
  if (params.search) sp.set("search", params.search);
  if (params.startDate) sp.set("startDate", params.startDate);
  if (params.endDate) sp.set("endDate", params.endDate);
  if (params.type) sp.set("type", params.type);
  const qs = sp.toString();
  return qs ? `?${qs}` : "";
}