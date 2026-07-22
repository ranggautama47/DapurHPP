"use client";

import { useEffect, useState } from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import { api } from "@/lib/axios";
import { buildLaporanQuery, type LaporanDateParams } from "@/lib/laporan-query";

interface ExpenseDataItem {
  nama: string;
  value: number;
  color: string;
  pct: number;
}

const COLORS = [
  "#FF8A00",
  "#F4D03F",
  "#06D6A0",
  "#2E294E",
  "#00B4D8",
  "#606C38",
  "#8B5CF6",
  "#EC4899",
];

const fmt = (v: number | undefined) => "Rp " + (v ?? 0).toLocaleString("id-ID");

export function ExpenseChart({
  dateParams,
}: {
  dateParams?: LaporanDateParams;
}) {
  const [data, setData] = useState<ExpenseDataItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);

  const fetchExpense = async () => {
    setLoading(true);
    setFetchError(false);
    try {
      const res = await api.get<ExpenseDataItem[]>(
        `/laporan/distribusi-hpp${buildLaporanQuery(dateParams ?? {})}`,
      );
      const withColors = res.data.map((d, i) => ({
        ...d,
        color: d.color ?? COLORS[i % COLORS.length],
      }));
      setData(withColors);
    } catch (err) {
      console.error("Gagal fetch distribusi HPP:", err);
      setFetchError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpense();
  }, [dateParams]);

  const total = data.reduce((acc, d) => acc + d.value, 0);

  return (
    <div className="bg-white rounded-[24px] border border-[#E8D5C4] p-6 shadow-[0_8px_30px_rgba(109,76,65,0.08)]">
      <h3 className="font-[var(--font-playfair)] font-bold text-lg text-[#2A1711] mb-6">
        Distribusi Pengeluaran (HPP)
      </h3>

      {/* 1. STATE LOADING */}
      {loading ? (
        <div className="flex flex-col md:flex-row items-center gap-6 animate-pulse">
          <div className="w-[180px] h-[180px] rounded-full bg-[#F5E6D8] flex-shrink-0" />
          <div className="flex-1 space-y-3 w-full">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-[#F5E6D8]" />
                <div className="h-4 bg-[#F5E6D8] rounded-lg flex-1" />
                <div className="h-4 bg-[#F5E6D8] rounded-lg w-[80px]" />
                <div className="h-4 bg-[#F5E6D8] rounded-lg w-[36px]" />
              </div>
            ))}
          </div>
        </div>
      ) : /* 2. STATE ERROR */
      fetchError ? (
        <div className="flex flex-col items-center justify-center h-[180px] text-[#8A7362]">
          <svg className="w-12 h-12 mb-2 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-sm mb-3">Gagal memuat data grafik</p>
          <button
            onClick={fetchExpense}
            className="px-4 py-1.5 rounded-full bg-[#FF8A00] text-white text-xs font-medium hover:bg-[#E67E00] transition-colors"
          >
            Coba Lagi
          </button>
        </div>
      ) : /* 3. STATE EMPTY (DATA KOSONG) */
      data.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[180px] text-[#8A7362]">
          <svg
            className="w-12 h-12 mb-2 opacity-30"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
          <p className="text-sm">
            Belum ada data pengeluaran untuk periode ini
          </p>
        </div>
      ) : (
        /* 3. STATE ADA DATA (RENDER CHART) */
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div
            className="relative flex-shrink-0"
            style={{ width: 180, height: 180 }}
          >
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-0">
              <span className="text-[11px] text-[#8A7362]">Total</span>
              <span className="text-sm font-bold font-[var(--font-roboto-mono)] text-[#2A1711]">
                {fmt(total)}
              </span>
            </div>

            <div className="relative z-10 w-full h-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    dataKey="value"
                    strokeWidth={0}
                  >
                    {data.map((d, i) => (
                      <Cell key={i} fill={d.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: any, _name: any, props: any) => [
                      fmt(value as number),
                      props.payload?.nama ?? _name,
                    ]}
                    labelStyle={{ display: "none" }}
                    wrapperStyle={{ zIndex: 100 }}
                    contentStyle={{
                      backgroundColor: "#fff",
                      borderRadius: "12px",
                      border: "1px solid #E8D5C4",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                      padding: "8px 12px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="flex-1 space-y-2.5 w-full">
            {data.map((d, i) => (
              <div key={i} className="flex items-center gap-1 text-xs">
                <span
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: d.color }}
                />
                <span className="flex-1 text-[#564334] md:text-lg font-[var(--font-be-vietnam)] truncate">
                  {d.nama}
                </span>
                <span className="font-[var(--font-roboto-mono)] text-[#2A1711] text-base font-semibold flex-shrink-0">
                  {fmt(d.value)}
                </span>
                <span className="text-[#8A7362] text-[11px] w-10 text-right flex-shrink-0">
                  {d.pct.toFixed(0)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
