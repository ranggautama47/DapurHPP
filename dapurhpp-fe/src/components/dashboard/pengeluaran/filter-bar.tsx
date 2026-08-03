import { Calendar, Search, RotateCcw } from "lucide-react";
import { useRef } from "react";
import { useTranslation } from "@/context/language-context";
import type { Kategori } from "@/types/pengeluaran";

interface FilterBarProps {
  tanggal: string;
  tanggalMulai: string;
  tanggalAkhir: string;
  kategori: Kategori | "Semua";
  onTanggalChange: (val: string) => void;
  onTanggalMulaiChange: (val: string) => void;
  onTanggalAkhirChange: (val: string) => void;
  onKategoriChange: (val: Kategori | "Semua") => void;
  onApply: () => void;
  onReset: () => void;
}

export function FilterBar({
  tanggal,
  tanggalMulai,
  tanggalAkhir,
  kategori,
  onTanggalChange,
  onTanggalMulaiChange,
  onTanggalAkhirChange,
  onKategoriChange,
  onApply,
  onReset,
}: FilterBarProps) {
  const { t, language } = useTranslation("master");
  const localeStr = language === "id" ? "id-ID" : "en-US";
  const dateInputRef = useRef<HTMLInputElement>(null);

  const KATEGORI_LIST: { value: Kategori | "Semua"; label: string }[] = [
    { value: "Semua", label: t("expenses.filter.allCategories") },
    { value: "UTILITAS", label: t("expenses.categories.utilities") },
    { value: "KEMASAN", label: t("expenses.categories.packaging") },
    { value: "TRANSPORTASI", label: t("expenses.categories.transport") },
    { value: "KEBERSIHAN", label: t("expenses.categories.cleaning") },
    { value: "LAINNYA", label: t("expenses.categories.other") },
  ];

  return (
    <div className="bg-white rounded-[24px] border border-[#DDC1AE] p-5 shadow-[0_8px_30px_rgba(109,76,65,0.08)] mb-6">
      <div className="flex flex-wrap items-end gap-4">
        {/* Single Date */}
        <div className="flex-1 min-w-[140px]">
          <label className="block text-xs font-semibold text-[#564334] mb-1.5">
            {t("common.labels.date")}
          </label>
          <div className="relative">
            <button
              type="button"
              onClick={() => dateInputRef.current?.showPicker()}
              className="flex items-center gap-2 w-full h-12 px-4 rounded-[16px] border-2 border-[#DDC1AE] bg-white text-[#2A1711] text-sm hover:border-[#FF8A00] transition-colors"
            >
              <Calendar className="w-4 h-4 text-[#8A7362]" />
              <span>
                {tanggal
                  ? new Date(tanggal + "T00:00:00").toLocaleDateString(
                      localeStr,
                      {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      },
                    )
                  : t("expenses.form.datePlaceholder", {
                      defaultValue: "Pilih tanggal",
                    })}
              </span>
            </button>
            <input
              ref={dateInputRef}
              type="date"
              value={tanggal}
              onChange={(e) => onTanggalChange(e.target.value)}
              className="absolute inset-0 w-0 h-0 opacity-0 pointer-events-none"
            />
          </div>
        </div>

        {/* Tanggal Mulai */}
        <div className="flex-1 min-w-[140px]">
          <label className="block text-xs font-semibold text-[#564334] mb-1.5">
            {t("expenses.filter.fromDate")}
          </label>
          <input
            type="date"
            value={tanggalMulai}
            onChange={(e) => onTanggalMulaiChange(e.target.value)}
            className="w-full h-12 px-4 rounded-[16px] border-2 border-[#DDC1AE] bg-white text-[#2A1711] text-sm focus:outline-none focus:border-[#FF8A00] focus:ring-2 focus:ring-[#FF8A00]/20"
          />
        </div>

        {/* Tanggal Akhir */}
        <div className="flex-1 min-w-[140px]">
          <label className="block text-xs font-semibold text-[#564334] mb-1.5">
            {t("expenses.filter.toDate")}
          </label>
          <input
            type="date"
            value={tanggalAkhir}
            onChange={(e) => onTanggalAkhirChange(e.target.value)}
            className="w-full h-12 px-4 rounded-[16px] border-2 border-[#DDC1AE] bg-white text-[#2A1711] text-sm focus:outline-none focus:border-[#FF8A00] focus:ring-2 focus:ring-[#FF8A00]/20"
          />
        </div>

        {/* Kategori */}
        <div className="flex-1 min-w-[140px]">
          <label className="block text-xs font-semibold text-[#564334] mb-1.5">
            {t("common.labels.category")}
          </label>
          <select
            value={kategori}
            onChange={(e) =>
              onKategoriChange(e.target.value as Kategori | "Semua")
            }
            className="w-full h-12 px-4 rounded-[16px] border-2 border-[#DDC1AE] bg-white text-[#2A1711] text-sm focus:outline-none focus:border-[#FF8A00] focus:ring-2 focus:ring-[#FF8A00]/20"
          >
            {KATEGORI_LIST.map((k) => (
              <option key={k.value} value={k.value}>
                {k.label}
              </option>
            ))}
          </select>
        </div>

        {/* Tombol Filter & Reset */}
        <div className="flex items-center gap-2">
          <button
            onClick={onApply}
            className="h-12 px-6 rounded-full bg-[#FF8A00] text-white font-semibold text-sm hover:bg-[#E67E00] transition-all flex items-center gap-2 shadow-[0_4px_12px_rgba(255,138,0,0.25)]"
          >
            <Search className="w-4 h-4" />
            {t("expenses.filter.applyFilter")}
          </button>
          <button
            type="button"
            onClick={onReset}
            className="h-12 px-4 rounded-full border-2 border-[#DDC1AE] text-[#564334] font-semibold text-sm hover:bg-[#FFF8F6] transition-all flex items-center gap-1.5"
            title="Reset Filter"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
