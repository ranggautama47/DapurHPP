export interface LaporanDateParams {
  date?: string;
  startDate?: string;
  endDate?: string;
  days?: number;
}

export function buildLaporanQuery(params: LaporanDateParams): string {
  const sp = new URLSearchParams();
  if (params.startDate && params.endDate) {
    sp.set("startDate", params.startDate);
    sp.set("endDate", params.endDate);
  } else if (params.date) {
    sp.set("date", params.date);
  } else {
    sp.set("days", String(params.days ?? 7));
  }
  const qs = sp.toString();
  return qs ? `?${qs}` : "";
}