"use client";

import { GrafikLabaItem } from "@/types/laporan";

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
  if (loading) return <Skeleton />;

  const totals = data.reduce(
    (acc, item) => ({
      pendapatan: acc.pendapatan + item.pendapatan,
      hpp: acc.hpp + item.hpp,
      laba: acc.laba + item.laba,
    }),
    { pendapatan: 0, hpp: 0, laba: 0 }
  );

  const avgMargin = totals.pendapatan > 0
    ? (totals.laba / totals.pendapatan * 100)
    : 0;

  return (
    <div className="bg-white rounded-[24px] border border-[#DDC1AE] p-6 shadow-[0_8px_30px_rgba(109,76,65,0.08)]">
      <h3 className="font-[var(--font-playfair)] font-bold text-lg text-[#2A1711] mb-6">
        Detail Performa
      </h3>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-[#E8D5C4]">
              <th className="bg-[#FFF8F6] px-4 py-3 text-[10px] uppercase tracking-[0.1em] text-[#8A7362] font-semibold">
                Periode
              </th>
              <th className="bg-[#FFF8F6] px-4 py-3 text-[10px] uppercase tracking-[0.1em] text-[#8A7362] font-semibold text-right">
                Pendapatan
              </th>
              <th className="bg-[#FFF8F6] px-4 py-3 text-[10px] uppercase tracking-[0.1em] text-[#8A7362] font-semibold text-right">
                HPP
              </th>
              <th className="bg-[#FFF8F6] px-4 py-3 text-[10px] uppercase tracking-[0.1em] text-[#8A7362] font-semibold text-right">
                Laba
              </th>
              <th className="bg-[#FFF8F6] px-4 py-3 text-[10px] uppercase tracking-[0.1em] text-[#8A7362] font-semibold text-right">
                Margin
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, idx) => {
              const margin = item.pendapatan > 0
                ? (item.laba / item.pendapatan * 100)
                : 0;
              return (
                <tr key={idx} className="border-b border-[#F5E6D8] hover:bg-[#FFF8F6] transition-colors">
                  <td className="px-4 py-3 text-xs font-[var(--font-be-vietnam)] text-[#2A1711]">
                    {item.label}
                  </td>
                  <td className="px-4 py-3 text-xs font-[var(--font-roboto-mono)] text-[#2A1711] text-right">
                    Rp {item.pendapatan.toLocaleString("id-ID")}
                  </td>
                  <td className="px-4 py-3 text-xs font-[var(--font-roboto-mono)] text-[#564334] text-right">
                    Rp {item.hpp.toLocaleString("id-ID")}
                  </td>
                  <td className="px-4 py-3 text-xs font-[var(--font-roboto-mono)] text-[#2A1711] text-right">
                    Rp {item.laba.toLocaleString("id-ID")}
                  </td>
                  <td className="px-4 py-3 text-xs font-[var(--font-roboto-mono)] text-right">
                    <span className={margin >= 0 ? "text-[#06D6A0]" : "text-[#EF4444]"}>
                      {margin.toFixed(2)}%
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-[#DDC1AE] bg-[#FFF8F6]">
              <td className="px-4 py-3 text-xs font-bold font-[var(--font-be-vietnam)] text-[#2A1711]">
                Total
              </td>
              <td className="px-4 py-3 text-xs font-bold font-[var(--font-roboto-mono)] text-[#2A1711] text-right">
                Rp {totals.pendapatan.toLocaleString("id-ID")}
              </td>
              <td className="px-4 py-3 text-xs font-bold font-[var(--font-roboto-mono)] text-[#564334] text-right">
                Rp {totals.hpp.toLocaleString("id-ID")}
              </td>
              <td className="px-4 py-3 text-xs font-bold font-[var(--font-roboto-mono)] text-[#2A1711] text-right">
                Rp {totals.laba.toLocaleString("id-ID")}
              </td>
              <td className="px-4 py-3 text-xs font-bold font-[var(--font-roboto-mono)] text-right">
                <span className={avgMargin >= 0 ? "text-[#06D6A0]" : "text-[#EF4444]"}>
                  {avgMargin.toFixed(2)}%
                </span>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}