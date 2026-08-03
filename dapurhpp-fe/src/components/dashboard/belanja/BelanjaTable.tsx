"use client";

import { Eye } from "lucide-react";
import { useTranslation } from "@/context/language-context";

interface BelanjaTableItem {
  id: number;
  tanggal: string;
  jumlahItem: number;
  totalBelanja: number;
  suppliers: string[];
}

interface BelanjaTableProps {
  data: BelanjaTableItem[];
  onView: (id: number) => void;
}

export function BelanjaTable({ data, onView }: BelanjaTableProps) {
  const { t, language } = useTranslation("master");
  const localeStr = language === "id" ? "id-ID" : "en-US";

  return (
    <table className="w-full">
      <thead>
        <tr className="bg-[#FFF8F6] border-b border-[#DDC1AE]">
          <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.1em] text-[#564334]">
            {t("purchases.columns.date")}
          </th>
          <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.1em] text-[#564334]">
            {t("purchases.columns.supplier")}
          </th>
          <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.1em] text-[#564334]">
            {t("purchases.columns.items")}
          </th>
          <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.1em] text-[#564334]">
            {t("purchases.columns.total")}
          </th>
          <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.1em] text-[#564334]">
            {t("purchases.columns.actions")}
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-[#F5E6D8]">
        {data.map((item) => (
          <tr key={item.id} className="hover:bg-[#FFE9E4] transition-colors cursor-pointer" onClick={() => onView(item.id)}>
            <td className="px-6 py-4 font-medium text-[#2A1711]">
              {new Date(item.tanggal).toLocaleDateString(localeStr, {
                weekday: "long", day: "numeric", month: "long", year: "numeric",
              })}
            </td>
            <td className="px-6 py-4 text-[#564334] text-sm max-w-[200px] truncate">
              {item.suppliers && item.suppliers.length > 0 ? item.suppliers.join(", ") : <span className="text-[#8A7362]">—</span>}
            </td>
            <td className="px-6 py-4 text-[#564334]">{item.jumlahItem} item</td>
            <td className="px-6 py-4 font-[var(--font-roboto-mono)] font-semibold text-[#2A1711]">
              Rp {item.totalBelanja.toLocaleString(localeStr)}
            </td>
            <td className="px-6 py-4">
              <button
                onClick={(e) => { e.stopPropagation(); onView(item.id); }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#DDC1AE] text-[#564334] text-xs font-medium hover:bg-[#FFE9E4] hover:border-[#FF8A00] hover:text-[#FF8A00] transition-colors"
              >
                <Eye className="w-3.5 h-3.5" /> Detail
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
