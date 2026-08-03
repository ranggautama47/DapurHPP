"use client";

import { GrafikLabaItem } from "@/types/laporan";
import { useTranslation } from "@/context/language-context";

interface DetailPerformaProps {
  data: GrafikLabaItem[];
  loading: boolean;
}

function Skeleton() {
  return (
    <div className="animate-pulse space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="h-8 bg-[#F5E6D8] rounded" />
      ))}
    </div>
  );
}

export function DetailPerforma({ data, loading }: DetailPerformaProps) {
  const { t, language } = useTranslation("master");
  const localeStr = language === "id" ? "id-ID" : "en-US";

  if (loading) return <Skeleton />;

  const totals = data.reduce(
    (acc, item) => ({
      pendapatan: acc.pendapatan + item.pendapatan,
      hpp: acc.hpp + item.hpp,
      laba: acc.laba + item.laba,
    }),
    { pendapatan: 0, hpp: 0, laba: 0 },
  );

  const avgMargin =
    totals.pendapatan > 0 ? (totals.laba / totals.pendapatan) * 100 : 0;

  return (
    <div className="bg-white rounded-[24px] border border-[#DDC1AE] p-4 sm:p-6 shadow-[0_8px_30px_rgba(109,76,65,0.08)] overflow-hidden">
      <h3 className="font-[var(--font-playfair)] font-bold text-base sm:text-lg text-[#2A1711] mb-4 sm:mb-6">
        {t("reports.detailPerformance")}
      </h3>

      <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
        <table className="w-full text-left min-w-[500px]">
          <thead>
            <tr className="border-b border-[#E8D5C4]">
              <th className="bg-[#FFF8F6] px-3 py-2.5 text-[9px] sm:text-[10px] uppercase tracking-wider text-[#8A7362] font-semibold">
                {t("reports.columns.period")}
              </th>
              <th className="bg-[#FFF8F6] px-3 py-2.5 text-[9px] sm:text-[10px] uppercase tracking-wider text-[#8A7362] font-semibold text-right">
                {t("reports.columns.revenue")}
              </th>
              <th className="bg-[#FFF8F6] px-3 py-2.5 text-[9px] sm:text-[10px] uppercase tracking-wider text-[#8A7362] font-semibold text-right">
                {t("reports.columns.hpp")}
              </th>
              <th className="bg-[#FFF8F6] px-3 py-2.5 text-[9px] sm:text-[10px] uppercase tracking-wider text-[#8A7362] font-semibold text-right">
                {t("reports.columns.profit")}
              </th>
              <th className="bg-[#FFF8F6] px-3 py-2.5 text-[9px] sm:text-[10px] uppercase tracking-wider text-[#8A7362] font-semibold text-right">
                {t("reports.columns.margin")}
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, idx) => {
              const margin =
                item.pendapatan > 0 ? (item.laba / item.pendapatan) * 100 : 0;
              return (
                <tr
                  key={idx}
                  className="border-b border-[#F5E6D8] hover:bg-[#FFF8F6] transition-colors"
                >
                  <td className="px-3 py-2.5 text-xs text-[#2A1711]">
                    {item.label}
                  </td>
                  <td className="px-3 py-2.5 text-xs font-[var(--font-roboto-mono)] text-[#2A1711] text-right">
                    Rp {item.pendapatan.toLocaleString(localeStr)}
                  </td>
                  <td className="px-3 py-2.5 text-xs font-[var(--font-roboto-mono)] text-[#564334] text-right">
                    Rp {item.hpp.toLocaleString(localeStr)}
                  </td>
                  <td className="px-3 py-2.5 text-xs font-[var(--font-roboto-mono)] text-[#2A1711] text-right">
                    Rp {item.laba.toLocaleString(localeStr)}
                  </td>
                  <td className="px-3 py-2.5 text-xs font-[var(--font-roboto-mono)] text-right">
                    <span
                      className={
                        margin >= 0 ? "text-[#06D6A0]" : "text-[#EF4444]"
                      }
                    >
                      {margin.toFixed(1)}%
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-[#DDC1AE] bg-[#FFF8F6]">
              <td className="px-3 py-2.5 text-xs font-bold text-[#2A1711]">
                {t("reports.total")}
              </td>
              <td className="px-3 py-2.5 text-xs font-bold font-[var(--font-roboto-mono)] text-[#2A1711] text-right">
                Rp {totals.pendapatan.toLocaleString(localeStr)}
              </td>
              <td className="px-3 py-2.5 text-xs font-bold font-[var(--font-roboto-mono)] text-[#564334] text-right">
                Rp {totals.hpp.toLocaleString(localeStr)}
              </td>
              <td className="px-3 py-2.5 text-xs font-bold font-[var(--font-roboto-mono)] text-[#2A1711] text-right">
                Rp {totals.laba.toLocaleString(localeStr)}
              </td>
              <td className="px-3 py-2.5 text-xs font-bold font-[var(--font-roboto-mono)] text-right">
                <span
                  className={
                    avgMargin >= 0 ? "text-[#06D6A0]" : "text-[#EF4444]"
                  }
                >
                  {avgMargin.toFixed(1)}%
                </span>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
