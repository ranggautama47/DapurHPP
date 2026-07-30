"use client";
import { useEffect, useState } from "react";
import { ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, AreaChart, Area } from "recharts";
import { api } from "@/lib/axios";
import { buildLaporanQuery, type LaporanDateParams } from "@/lib/laporan-query";
import { useTranslation } from "@/context/language-context";

interface ProfitDataItem { label: string; laba: number; }

const formatRp = (v: number) =>
  v >= 1000000 ? "Rp " + (v/1000000).toFixed(1) + "M"
  : v >= 1000 ? "Rp " + (v/1000).toFixed(0) + "K"
  : "Rp " + v;

export function ProfitChart({ dateParams }: { dateParams?: LaporanDateParams }) {
  const { t } = useTranslation("dashboard");
  const [data, setData] = useState<ProfitDataItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);

  const fetchProfit = async () => {
    setLoading(true);
    setFetchError(false);
    try {
      const res = await api.get<ProfitDataItem[]>(`/laporan/grafik-laba${buildLaporanQuery(dateParams ?? {})}`);
      setData(res.data || []);
    } catch (err) {
      console.error("Gagal fetch grafik laba:", err);
      setFetchError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfit();
  }, [dateParams]);

  const isEmpty = !data || data.length === 0 || data.every(d => (d.laba ?? 0) === 0);

  return (
    <div className="bg-white rounded-[24px] border border-[#E8D5C4] p-6 shadow-[0_8px_30px_rgba(109,76,65,0.08)]">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-[var(--font-playfair)] font-bold text-lg text-[#2A1711]">
          {t("profitChart.title")}
        </h3>
      </div>

      <div className="h-[260px] w-full relative">
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex gap-1">
              {[0,1,2].map(i => (
                <div key={i} className="w-2 h-2 rounded-full bg-[#FF8A00] animate-bounce"
                  style={{ animationDelay: `${i * 0.15}s` }} />
              ))}
            </div>
          </div>
        ) : fetchError ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-[#8A7362]">
            <svg className="w-12 h-12 mb-2 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm mb-3">{t("profitChart.fetchError")}</p>
            <button
              onClick={fetchProfit}
              className="px-4 py-1.5 rounded-full bg-[#FF8A00] text-white text-xs font-medium hover:bg-[#E67E00] transition-colors"
            >
              {t("profitChart.retry")}
            </button>
          </div>
        ) : isEmpty ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-[#8A7362]">
            <svg className="w-12 h-12 mb-2 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <p className="text-sm">{t("profitChart.emptyData")}</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="labaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FF8A00" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#FF8A00" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#DDC1AE" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#8A7362" }} axisLine={false} tickLine={false} dy={10} />
              <YAxis tickFormatter={formatRp} tick={{ fontSize: 11, fill: "#8A7362" }} axisLine={false} tickLine={false} width={70} />
              <Tooltip
                formatter={(value: any) => ["Rp " + (value ?? 0).toLocaleString("id-ID"), t("profitChart.tooltipLabel")]}
                contentStyle={{ borderRadius: 12, border: "1px solid #E8D5C4", fontSize: 12 }}
              />
              <Area type="monotone" dataKey="laba" stroke="#FF8A00" strokeWidth={2.5}
                fill="url(#labaGradient)" dot={{ fill: "#FF8A00", r: 4, strokeWidth: 0 }}
                activeDot={{ r: 6, fill: "#FF8A00" }} />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}