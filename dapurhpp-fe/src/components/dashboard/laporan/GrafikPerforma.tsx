"use client";

import { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Info } from "lucide-react";
import { GrafikLabaItem } from "@/types/laporan";
import { useTranslation } from "@/context/language-context";

interface GrafikPerformaProps {
  data: GrafikLabaItem[];
  loading: boolean;
}

type ViewMode = "harian" | "mingguan" | "bulanan";

function formatRupiah(value: number) {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}jt`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(0)}K`;
  return `${value}`;
}

function CustomTooltip({ active, payload, label, localeStr, t }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white rounded-2xl border border-[#DDC1AE] shadow-[0_8px_30px_rgba(109,76,65,0.12)] p-3 sm:p-4 text-xs">
      <p className="font-[var(--font-be-vietnam)] font-semibold text-[#2A1711] mb-2">
        {label}
      </p>
      {payload.map((entry: any, idx: number) => (
        <div key={idx} className="flex items-center gap-2 mb-1">
          <span
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-[#564334]">
            {entry.name === "pendapatan"
              ? t("reports.chart.revenue")
              : entry.name === "hpp"
                ? t("reports.chart.hpp")
                : t("reports.chart.profit")}
          </span>
          <span className="font-[var(--font-roboto-mono)] font-semibold text-[#2A1711] ml-auto">
            Rp {entry.value.toLocaleString(localeStr)}
          </span>
        </div>
      ))}
    </div>
  );
}

function Skeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-[250px] sm:h-[300px] bg-[#F5E6D8] rounded-2xl" />
    </div>
  );
}

function aggregateByViewMode(
  data: GrafikLabaItem[] = [],
  mode: ViewMode,
): GrafikLabaItem[] {
  if (!data || data.length === 0) return [];
  if (mode === "harian") return data;

  const chunkSize = mode === "mingguan" ? 7 : 30;
  const result: GrafikLabaItem[] = [];

  for (let i = 0; i < data.length; i += chunkSize) {
    const chunk = data.slice(i, i + chunkSize);
    const sum = chunk.reduce(
      (acc, item) => ({
        pendapatan: acc.pendapatan + item.pendapatan,
        hpp: acc.hpp + item.hpp,
        laba: acc.laba + item.laba,
      }),
      { pendapatan: 0, hpp: 0, laba: 0 },
    );
    const label =
      chunk.length > 1
        ? `${chunk[0].label} - ${chunk[chunk.length - 1].label}`
        : chunk[0].label;
    result.push({ label, ...sum });
  }

  return result;
}

export function GrafikPerforma({ data = [], loading }: GrafikPerformaProps) {
  const { t, language } = useTranslation("master");
  const localeStr = language === "id" ? "id-ID" : "en-US";
  const [viewMode, setViewMode] = useState<ViewMode>("harian");

  if (loading) return <Skeleton />;

  const safeData = data ?? [];
  const chartData = aggregateByViewMode(safeData, viewMode);

  const isDataEmpty =
    !chartData ||
    chartData.length === 0 ||
    chartData.every(
      (item) => item.pendapatan === 0 && item.hpp === 0 && item.laba === 0,
    );

  return (
    <div className="bg-white rounded-[24px] border border-[#DDC1AE] p-4 sm:p-6 shadow-[0_8px_30px_rgba(109,76,65,0.08)]">
      {/* Header dibuat flex-col di mobile biar gak sesak */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 sm:mb-6">
        <div className="flex items-center gap-2">
          <h3 className="font-[var(--font-playfair)] font-bold text-base sm:text-lg text-[#2A1711]">
            {t("reports.chart.title")}
          </h3>
          <div className="relative group">
            <Info size={14} className="text-[#8A7362] cursor-help" />
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-[#2A1711] text-white text-[10px] rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
              {t("reports.chart.tooltipDescription")}
            </div>
          </div>
        </div>

        {/* Tab Switcher ringkas */}
        <div className="flex bg-[#FFF8F6] rounded-full p-0.5 border border-[#DDC1AE] self-start sm:self-auto">
          {(["harian", "mingguan", "bulanan"] as ViewMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={
                viewMode === mode
                  ? "px-2.5 sm:px-3 py-1 rounded-full text-[10px] font-semibold bg-[#FF8A00] text-white transition-all"
                  : "px-2.5 sm:px-3 py-1 rounded-full text-[10px] font-semibold text-[#564334] hover:bg-[#FFF8F6] transition-all"
              }
            >
              {mode === "harian"
                ? t("reports.chart.daily")
                : mode === "mingguan"
                  ? t("reports.chart.weekly")
                  : t("reports.chart.monthly")}
            </button>
          ))}
        </div>
      </div>

      <div className="h-[260px] sm:h-[300px] w-full">
        {isDataEmpty ? (
          <div className="flex flex-col items-center justify-center h-full text-[#8A7362]">
            <svg
              className="w-10 h-10 mb-2 opacity-30"
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
            <p className="text-xs sm:text-sm">
              {t("reports.chart.emptyState")}
            </p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient
                  id="gradientPendapatan"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopColor="#06D6A0" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#06D6A0" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradientHpp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FF8A00" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#FF8A00" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradientLaba" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#F5E6D8"
                vertical={false}
              />
              <XAxis
                dataKey="label"
                tick={{
                  fontSize: 9,
                  fill: "#8A7362",
                  fontFamily: "var(--font-be-vietnam)",
                }}
                tickLine={false}
                axisLine={{ stroke: "#E8D5C4" }}
                interval="preserveStartEnd"
              />
              <YAxis
                tickFormatter={formatRupiah}
                tick={{
                  fontSize: 9,
                  fill: "#8A7362",
                  fontFamily: "var(--font-roboto-mono)",
                }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip content={<CustomTooltip localeStr={localeStr} t={t} />} />
              <Legend
                verticalAlign="top"
                align="right"
                iconType="circle"
                iconSize={6}
                wrapperStyle={{ paddingBottom: "10px", fontSize: "10px" }}
                formatter={(value: string) => (
                  <span className="text-[10px] text-[#564334] font-[var(--font-be-vietnam)]">
                    {value === "pendapatan"
                      ? t("reports.chart.revenue")
                      : value === "hpp"
                        ? t("reports.chart.hpp")
                        : t("reports.chart.profit")}
                  </span>
                )}
              />
              <Area
                type="monotone"
                dataKey="pendapatan"
                stroke="#06D6A0"
                strokeWidth={2}
                fill="url(#gradientPendapatan)"
                dot={false}
              />
              <Area
                type="monotone"
                dataKey="hpp"
                stroke="#FF8A00"
                strokeWidth={2}
                fill="url(#gradientHpp)"
                dot={false}
              />
              <Area
                type="monotone"
                dataKey="laba"
                stroke="#8B5CF6"
                strokeWidth={2}
                fill="url(#gradientLaba)"
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
