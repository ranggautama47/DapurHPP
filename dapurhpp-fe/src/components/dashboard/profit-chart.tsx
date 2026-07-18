"use client";
import { useEffect, useState } from "react";
import { ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, AreaChart, Area } from "recharts";
import { api } from "@/lib/axios";

interface ProfitDataItem { label: string; laba: number; }

const formatRp = (v: number) =>
  v >= 1000000 ? "Rp " + (v/1000000).toFixed(1) + "M"
  : v >= 1000 ? "Rp " + (v/1000).toFixed(0) + "K"
  : "Rp " + v;

const RANGES = [
  { label: "7 Hari", days: 7 },
  { label: "30 Hari", days: 30 },
  { label: "3 Bulan", days: 90 },
  { label: "6 Bulan", days: 180 },
];

export function ProfitChart() {
  const [data, setData] = useState<ProfitDataItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeDays, setActiveDays] = useState(7);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    (async () => {
      try {
        const res = await api.get<ProfitDataItem[]>(`/laporan/grafik-laba?days=${activeDays}`);
        if (!cancelled) setData(res.data);
      } catch (err) {
        if (!cancelled) console.error("Gagal fetch grafik laba:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [activeDays]);

  return (
    <div className="bg-white rounded-[24px] border border-[#E8D5C4] p-6 shadow-[0_8px_30px_rgba(109,76,65,0.08)]">

      <div className="flex items-center justify-between mb-6">
        <h3 className="font-[var(--font-playfair)] font-bold text-lg text-[#2A1711]">
          Grafik Laba
        </h3>

        <div className="relative">
          <select
            value={activeDays}
            onChange={(e) => setActiveDays(Number(e.target.value))}
            className="appearance-none pl-4 pr-9 py-2 text-xs font-semibold rounded-xl bg-[#FDF8F5] text-[#2A1711] border border-[#E8D5C4] outline-none cursor-pointer transition-all duration-200 hover:border-[#FF8A00] focus:border-[#FF8A00] bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%238A7362%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:10px_10px] bg-[right_14px_center] bg-no-repeat"
          >
            {RANGES.map((r) => (
              <option key={r.days} value={r.days}>
                {r.label}
              </option>
            ))}
          </select>
        </div>
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
        ) : data.length === 0 ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-[#8A7362]">
            <svg className="w-12 h-12 mb-2 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <p className="text-sm">Belum ada data untuk periode ini</p>
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
                formatter={(value: any) => ["Rp " + (value ?? 0).toLocaleString("id-ID"), "Laba"]}
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
