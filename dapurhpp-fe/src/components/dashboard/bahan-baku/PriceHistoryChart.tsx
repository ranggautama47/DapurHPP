"use client";

import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { useEffect, useState } from "react";
import { api } from "@/lib/axios";
import { RiwayatHarga } from "@/types/bahan-baku";

interface PriceHistoryChartProps {
  bahanId: number;
}

const formatRp = (v: number) => "Rp " + (v / 1000).toFixed(0) + "K";

export function PriceHistoryChart({ bahanId }: PriceHistoryChartProps) {
  const [data, setData] = useState<RiwayatHarga[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchHistory() {
      try {
        setLoading(true);
        const res = await api.get<RiwayatHarga[]>(`/bahan-baku/${bahanId}/riwayat-harga`);
        setData(res.data);
      } catch (err) {
        console.error("Gagal fetch riwayat harga:", err);
        setError("Gagal memuat riwayat harga");
      } finally {
        setLoading(false);
      }
    }
    fetchHistory();
  }, [bahanId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[200px] bg-[#FFF8F6] rounded-[16px] border border-[#F5E6D8]">
        <div className="w-8 h-8 border-4 border-[#FFE9E4] border-t-[#FF8A00] rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[200px] bg-[#FFF8F6] rounded-[16px] border border-[#F5E6D8]">
        <p className="text-[#BA1A1A] text-sm">{error}</p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[200px] bg-[#FFF8F6] rounded-[16px] border border-[#F5E6D8]">
        <p className="text-[#8A7362] text-sm">Belum ada riwayat harga</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
            <defs>
              <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#FF8A00" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#FF8A00" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#DDC1AE" vertical={false} />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 11, fill: "#8A7362", fontFamily: "var(--font-be-vietnam)" }}
              axisLine={false}
              tickLine={false}
              dy={10}
            />
            <YAxis
              tickFormatter={formatRp}
              tick={{ fontSize: 11, fill: "#8A7362", fontFamily: "var(--font-roboto-mono)" }}
              axisLine={false}
              tickLine={false}
              width={70}
            />
            <Tooltip
              formatter={(v: any) => ["Rp " + (v ?? 0).toLocaleString("id-ID"), "Harga"]}
              labelStyle={{ color: "#2A1711", fontWeight: 600 }}
              contentStyle={{
                backgroundColor: "#fff",
                borderRadius: 12,
                border: "1px solid #E8D5C4",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                padding: "8px 12px",
                fontSize: 12,
              }}
            />
            <Line
              type="monotone"
              dataKey="harga"
              stroke="#FF8A00"
              strokeWidth={2.5}
              fill="url(#priceGradient)"
              dot={{ fill: "#FF8A00", r: 4, strokeWidth: 0 }}
              activeDot={{ r: 6, fill: "#FF8A00" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#FFF8F6] border-b border-[#DDC1AE]">
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.1em] text-[#564334] font-[var(--font-be-vietnam)]">
                Tanggal
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.1em] text-[#564334] font-[var(--font-be-vietnam)]">
                Harga
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.1em] text-[#564334] font-[var(--font-be-vietnam)]">
                Perubahan
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F5E6D8]">
            {data.map((d, i) => {
              const prev = i > 0 ? data[i - 1].harga : null;
              const diff = prev ? d.harga - prev : 0;
              const percent = prev ? ((diff / prev) * 100).toFixed(1) : null;
              const isUp = diff > 0;
              const isDown = diff < 0;

              return (
                <tr key={i} className="hover:bg-[#FFE9E4] transition-colors">
                  <td className="px-4 py-3 text-[#564334] font-[var(--font-be-vietnam)]">
                    {d.label}
                  </td>
                  <td className="px-4 py-3 font-[var(--font-roboto-mono)] font-semibold text-[#2A1711]">
                    Rp {d.harga.toLocaleString("id-ID")}
                  </td>
                  <td className="px-4 py-3">
                    {i === 0 ? (
                      <span className="text-[#8A7362] text-xs">—</span>
                    ) : (
                      <span className={`font-[var(--font-roboto-mono)] text-xs font-medium ${isUp ? "text-[#EF4444]" : isDown ? "text-[#06D6A0]" : "text-[#8A7362]"}`}>
                        {isUp ? "↑" : isDown ? "↓" : ""} Rp {Math.abs(diff).toLocaleString("id-ID")} ({isUp ? "+" : isDown ? "-" : ""}{percent}%)
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
