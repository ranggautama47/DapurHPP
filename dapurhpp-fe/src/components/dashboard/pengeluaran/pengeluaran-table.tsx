import { useState, useMemo } from "react";
import { Pencil, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation } from "@/context/language-context";
import type { Pengeluaran, Kategori } from "@/types/pengeluaran";
import { formatRupiah, detectKategori } from "@/lib/pengeluaran-lain";
import { KategoriBadge } from "./kategori-badge";

const ITEMS_PER_PAGE = 10;

interface PengeluaranTableProps {
  data: Pengeluaran[];
  loading: boolean;
  onEdit: (item: Pengeluaran) => void;
  onDelete: (id: number) => void;
}

export function PengeluaranTable({
  data,
  loading,
  onEdit,
  onDelete,
}: PengeluaranTableProps) {
  const { t, language } = useTranslation("master");
  const localeStr = language === "id" ? "id-ID" : "en-US";

  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(data.length / ITEMS_PER_PAGE));
  const paginatedData = useMemo(
    () => data.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE),
    [data, page],
  );
  const totalJumlah = useMemo(
    () => data.reduce((sum, i) => sum + Number(i.jumlah), 0),
    [data],
  );

  if (page > totalPages) setPage(totalPages);

  if (loading) {
    return (
      <div className="bg-white rounded-[24px] border border-[#DDC1AE] shadow-[0_8px_30px_rgba(109,76,65,0.08)] overflow-hidden">
        <div className="p-8 text-center text-[#8A7362]">
          <div className="w-8 h-8 border-4 border-[#FFE9E4] border-t-[#FF8A00] rounded-full animate-spin mx-auto mb-3" />
          {t("expenses.table.loading")}
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-[24px] border border-[#DDC1AE] shadow-[0_8px_30px_rgba(109,76,65,0.08)] overflow-hidden">
        <div className="flex flex-col items-center justify-center py-16">
          <div className="w-16 h-16 rounded-2xl bg-[#FFF3E5] flex items-center justify-center mb-4">
            <svg
              className="w-8 h-8 text-[#DDC1AE]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <p className="text-[#564334] text-lg font-medium mb-1">
            {t("expenses.table.emptyState")}
          </p>
          <p className="text-[#8A7362] text-sm">
            {t("expenses.table.emptyHint")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[24px] border border-[#DDC1AE] shadow-[0_8px_30px_rgba(109,76,65,0.08)] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-[#FFF8F6] border-b border-[#DDC1AE]">
              <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-[0.1em] text-[#564334] w-12">
                No
              </th>
              <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-[0.1em] text-[#564334]">
                {t("common.labels.date")}
              </th>
              <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-[0.1em] text-[#564334]">
                {t("expenses.table.nameColumn")}
              </th>
              <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-[0.1em] text-[#564334]">
                {t("expenses.table.categoryColumn")}
              </th>
              <th className="px-4 py-4 text-right text-xs font-semibold uppercase tracking-[0.1em] text-[#564334]">
                {t("expenses.table.amountColumn")}
              </th>
              <th className="px-4 py-4 text-center text-xs font-semibold uppercase tracking-[0.1em] text-[#564334] w-20">
                {t("common.labels.actions")}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F5E6D8]">
            {paginatedData.map((item, index) => {
              const no = (page - 1) * ITEMS_PER_PAGE + index + 1;
              const kategori: Kategori = detectKategori(item.nama);
              return (
                <tr
                  key={item.id}
                  className="hover:bg-[#FFF8F6] transition-colors"
                >
                  <td className="px-4 py-3.5 text-[#8A7362] text-sm">{no}</td>
                  <td className="px-4 py-3.5 text-[#2A1711] text-sm font-medium whitespace-nowrap">
                    {new Date(item.tanggal).toLocaleDateString(
                      localeStr,
                      { day: "numeric", month: "short", year: "numeric" },
                    )}
                  </td>
                  <td className="px-4 py-3.5 text-[#564334] text-sm">
                    {item.nama}
                  </td>
                  <td className="px-4 py-3.5">
                    <KategoriBadge kategori={item.kategori} />
                  </td>
                  <td className="px-4 py-3.5 text-right font-[var(--font-roboto-mono)] font-semibold text-[#2A1711] text-sm whitespace-nowrap">
                    {formatRupiah(item.jumlah)}
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => onEdit(item)}
                        className="p-1.5 rounded-full hover:bg-[#FFF3E5] text-[#FF8A00] transition-colors"
                        title={t("common.buttons.edit")}
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(item.id)}
                        className="p-1.5 rounded-full hover:bg-[#FEE2E2] text-[#EF4444] transition-colors"
                        title={t("common.buttons.delete")}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="border-t border-[#DDC1AE] bg-[#FFF8F6] px-4 py-3 flex items-center justify-between">
        <span className="text-xs text-[#8A7362]">
          {t("expenses.table.showing")} {paginatedData.length} {t("expenses.table.of")} {data.length} {t("expenses.table.data")}
        </span>
        <span className="font-[var(--font-roboto-mono)] font-bold text-[#2A1711]">
          {t("expenses.table.totalLabel")} {formatRupiah(totalJumlah)}
        </span>
      </div>

      {totalPages > 1 && (
        <div className="border-t border-[#DDC1AE] px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="p-1.5 rounded-full hover:bg-[#FFF8F6] text-[#564334] disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs text-[#8A7362]">
            {t("expenses.table.page")} {page} {t("expenses.table.ofPages")} {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="p-1.5 rounded-full hover:bg-[#FFF8F6] text-[#564334] disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
