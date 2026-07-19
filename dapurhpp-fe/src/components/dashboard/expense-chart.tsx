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

export function ExpenseChart({ dateParams }: { dateParams?: LaporanDateParams }) {
  const [data, setData] = useState<ExpenseDataItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchExpense() {
      setLoading(true);
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
      } finally {
        setLoading(false);
      }
    }
    fetchExpense();
  }, [dateParams]);

  const total = data.reduce((acc, d) => acc + d.value, 0);

  return (
    <div className="bg-white rounded-[24px] border border-[#E8D5C4] p-6 shadow-[0_8px_30px_rgba(109,76,65,0.08)]">
      <h3 className="font-[var(--font-playfair)] font-bold text-lg text-[#2A1711] mb-6">
        Distribusi Pengeluaran (HPP)
      </h3>
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
              <span className="font-[var(--font-roboto-mono)] text-[#2A1711]  text-base font-semibold flex-shrink-0">
                {fmt(d.value)}
              </span>
              <span className="text-[#8A7362] text-[11px] w-10 text-right flex-shrink-0">
                {d.pct.toFixed(0)}%
              </span>
            </div>
          ))}
        </div>
      </div>
      {loading && (
        <div className="flex items-center justify-center h-[180px] text-[#8A7362]">
          Memuat grafik...
        </div>
      )}
    </div>
  );
}