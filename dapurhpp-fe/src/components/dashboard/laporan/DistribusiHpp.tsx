"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { DistribusiHppItem } from "@/types/laporan";
import { useTranslation } from "@/context/language-context";

interface DistribusiHppProps {
  data: DistribusiHppItem[];
  totalHpp: number;
  loading: boolean;
}

function CustomTooltip({ active, payload, localeStr }: any) {
  if (!active || !payload?.length) return null;
  const item = payload[0].payload;
  return (
    <div className="bg-white rounded-2xl border border-[#DDC1AE] shadow-[0_8px_30px_rgba(109,76,65,0.12)] p-3">
      <p className="text-xs font-[var(--font-be-vietnam)] font-semibold text-[#2A1711]">
        {item.nama}
      </p>
      <p className="text-xs font-[var(--font-roboto-mono)] text-[#564334]">
        Rp {item.value.toLocaleString(localeStr)} ({item.pct}%)
      </p>
    </div>
  );
}

function Skeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-[250px] bg-[#F5E6D8] rounded-2xl" />
    </div>
  );
}

export function DistribusiHpp({ data, totalHpp, loading }: DistribusiHppProps) {
  const { t, language } = useTranslation("master");
  const localeStr = language === "id" ? "id-ID" : "en-US";

  if (loading) return <Skeleton />;

  if (!data || data.length === 0 || totalHpp === 0) {
    return (
      <div className="bg-white rounded-[24px] border border-[#DDC1AE] p-4 sm:p-6 shadow-[0_8px_30px_rgba(109,76,65,0.08)]">
        <h3 className="font-[var(--font-playfair)] font-bold text-base sm:text-lg text-[#2A1711] mb-4">
          {t("reports.distribution.title")}
        </h3>
        <div className="flex flex-col items-center justify-center h-[180px] text-[#8A7362]">
          <svg className="w-10 h-10 mb-2 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <p className="text-xs sm:text-sm">{t("reports.distribution.emptyState")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[24px] border border-[#DDC1AE] p-4 sm:p-6 shadow-[0_8px_30px_rgba(109,76,65,0.08)]">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h3 className="font-[var(--font-playfair)] font-bold text-base sm:text-lg text-[#2A1711]">
          {t("reports.distribution.title")}
        </h3>
        <span className="text-[9px] sm:text-[10px] font-semibold text-[#8A7362] uppercase tracking-wider bg-[#FFF8F6] px-2.5 py-1 rounded-full border border-[#DDC1AE]">
          {t("reports.distribution.top")} {data.length}
        </span>
      </div>

      <div className="flex flex-col items-center">
        <div className="relative w-[180px] h-[180px] sm:w-[200px] sm:h-[200px] mx-auto">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={2} dataKey="value">
                {data.map((entry, index) => (
                  <Cell key={index} fill={entry.color || `#FF8A00`} stroke="none" />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip localeStr={localeStr} />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center">
              <p className="text-[8px] text-[#8A7362] font-semibold uppercase tracking-wider">{t("reports.distribution.totalHpp")}</p>
              <p className="font-[var(--font-roboto-mono)] font-bold text-xs sm:text-sm text-[#2A1711]">
                Rp {totalHpp.toLocaleString(localeStr)}
              </p>
            </div>
          </div>
        </div>

        <div className="w-full mt-4 space-y-2">
          {data.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 truncate">
                <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color || "#FF8A00" }} />
                <span className="text-[#564334] font-[var(--font-be-vietnam)] truncate">{item.nama}</span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="font-[var(--font-roboto-mono)] text-[#2A1711]">Rp {item.value.toLocaleString(localeStr)}</span>
                <span className="font-[var(--font-be-vietnam)] font-semibold text-[#8A7362] w-8 text-right">{item.pct}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}