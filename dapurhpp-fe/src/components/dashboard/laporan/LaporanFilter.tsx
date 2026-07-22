"use client";

import { FilterState, FilterPeriod } from "@/types/laporan";

interface LaporanFilterProps {
  filter: FilterState;
  onFilterChange: (period: FilterPeriod) => void;
  onDateChange: (field: "tanggalMulai" | "tanggalAkhir", value: string) => void;
  onApplyCustom: () => void;
  isCustomApplied: boolean;
}

const presets: { label: string; value: FilterPeriod }[] = [
  { label: "Hari Ini", value: 1 },
  { label: "7 Hari", value: 7 },
  { label: "30 Hari", value: 30 },
  { label: "3 Bulan", value: 90 },
  { label: "6 Bulan", value: 180 },
  { label: "Custom", value: "custom" },
];

export function LaporanFilter({
  filter,
  onFilterChange,
  onDateChange,
  onApplyCustom,
  isCustomApplied,
}: LaporanFilterProps) {
  const isCustom = filter.period === "custom";

  return (
    <div className="bg-white rounded-[24px] border border-[#DDC1AE] p-4 sm:p-6 mb-6 sm:mb-8 shadow-[0_8px_30px_rgba(109,76,65,0.08)]">
      <p className="font-[var(--font-be-vietnam)] font-semibold text-xs sm:text-sm text-[#564334] mb-3 sm:mb-4">
        Filter Periode
      </p>

      {/* Preset Buttons Grid di mobile */}
      <div className="grid grid-cols-3 sm:flex sm:flex-wrap gap-2 mb-4">
        {presets.map((preset) => {
          const isActive = filter.period === preset.value;
          return (
            <button
              key={String(preset.value)}
              onClick={() => onFilterChange(preset.value)}
              className={
                isActive
                  ? "bg-[#FF8A00] text-white rounded-full px-3 py-2 text-xs sm:text-sm font-semibold transition-all text-center"
                  : "bg-white border border-[#DDC1AE] text-[#564334] rounded-full px-3 py-2 text-xs sm:text-sm hover:bg-[#FFF8F6] transition-all text-center"
              }
            >
              {preset.label}
            </button>
          );
        })}
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-3 sm:gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
          <div>
            <label className="block text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider text-[#8A7362] mb-1">
              Dari Tanggal
            </label>
            <input
              type="date"
              value={filter.tanggalMulai}
              onChange={(e) => onDateChange("tanggalMulai", e.target.value)}
              disabled={!isCustom}
              className="w-full bg-white border border-[#DDC1AE] rounded-[14px] px-3 py-2 text-xs sm:text-sm text-[#2A1711] disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:border-[#FF8A00]"
            />
          </div>
          <div>
            <label className="block text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider text-[#8A7362] mb-1">
              Sampai Tanggal
            </label>
            <input
              type="date"
              value={filter.tanggalAkhir}
              onChange={(e) => onDateChange("tanggalAkhir", e.target.value)}
              disabled={!isCustom}
              className="w-full bg-white border border-[#DDC1AE] rounded-[14px] px-3 py-2 text-xs sm:text-sm text-[#2A1711] disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:border-[#FF8A00]"
            />
          </div>
        </div>
        <button
          onClick={onApplyCustom}
          disabled={!isCustom || isCustomApplied}
          className="w-full sm:w-auto bg-[#FF8A00] text-white rounded-full px-6 py-2.5 font-semibold text-xs sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#E67E00] transition-all whitespace-nowrap"
        >
          Terapkan Filter
        </button>
      </div>
    </div>
  );
}