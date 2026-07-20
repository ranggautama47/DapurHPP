"use client";

import { useState } from "react";
import { Search, Calendar, Filter, RotateCcw, Download } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar as CalendarComp } from "@/components/ui/calendar";
import { format } from "date-fns";
import { id } from "date-fns/locale/id";
import type { DateRange } from "react-day-picker";
import type { AktivitasQueryParams } from "@/lib/aktivitas-query";

interface ActivityFilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  onSearchSubmit: () => void;
  startDate: Date | undefined;
  endDate: Date | undefined;
  onDateChange: (start: Date | undefined, end: Date | undefined) => void;
  activityType: "penjualan" | "belanja" | "produksi" | "pengeluaran" | "all";
  onActivityTypeChange: (type: "penjualan" | "belanja" | "produksi" | "pengeluaran" | "all") => void;
  onReset: () => void;
  onExport: () => void;
  hasFilters: boolean;
  isLoading?: boolean;
}

const ACTIVITY_TYPES = [
  { value: "all", label: "Semua Jenis" },
  { value: "penjualan", label: "Penjualan" },
  { value: "belanja", label: "Belanja Bahan" },
  { value: "produksi", label: "Produksi" },
  { value: "pengeluaran", label: "Pengeluaran Lain" },
] as const;

export function ActivityFilterBar({
  search,
  onSearchChange,
  onSearchSubmit,
  startDate,
  endDate,
  onDateChange,
  activityType,
  onActivityTypeChange,
  onReset,
  onExport,
  hasFilters,
  isLoading,
}: ActivityFilterBarProps) {
  const [isDatePopoverOpen, setIsDatePopoverOpen] = useState(false);
  const [dateMode, setDateMode] = useState<"single" | "range">("single");
  const [singleDate, setSingleDate] = useState<Date | undefined>(startDate);
  const [range, setRange] = useState<DateRange | undefined>(
    startDate && endDate ? { from: startDate, to: endDate } : undefined
  );
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchSubmit();
  };

  const labelText =
    dateMode === "range" && range?.from && range?.to
      ? `${format(range.from, "d MMM", { locale: id })} – ${format(range.to, "d MMM yyyy", { locale: id })}`
      : singleDate
      ? format(singleDate, "EEEE, d MMMM yyyy", { locale: id })
      : "Pilih Tanggal";

  const handleDateApply = () => {
    if (dateMode === "single" && singleDate) {
      onDateChange(singleDate, singleDate);
    } else if (dateMode === "range" && range?.from && range?.to) {
      onDateChange(range.from, range.to);
    }
    setIsDatePopoverOpen(false);
  };

  const handleResetDate = () => {
    setSingleDate(undefined);
    setRange(undefined);
    onDateChange(undefined, undefined);
  };

  return (
    <div className="bg-white rounded-[24px] border border-[#E8D5C4] p-5 shadow-[0_8px_30px_rgba(109,76,65,0.08)] mb-6">
      <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8A7362]" />
          <input
            type="text"
            placeholder="Cari aktivitas..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-[#FFF8F6] border border-[#DDC1AE] rounded-full text-[#2A1711] placeholder-[#8A7362] font-[var(--font-be-vietnam)] text-sm focus:outline-none focus:ring-2 focus:ring-[#FF8A00] focus:border-transparent transition-all"
          />
        </div>

        <Popover open={isDatePopoverOpen} onOpenChange={setIsDatePopoverOpen}>
          <PopoverTrigger asChild>
            <button
              type="button"
              className={`inline-flex items-center gap-2 px-4 py-3 bg-white border rounded-full text-sm font-medium font-[var(--font-be-vietnam)] transition-all ${
                startDate
                  ? "border-[#FF8A00] text-[#FF8A00]"
                  : "border-[#DDC1AE] text-[#564334] hover:border-[#FF8A00] hover:text-[#FF8A00]"
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>{labelText}</span>
              <svg className="w-4 h-4 ml-1 text-[#8A7362]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-auto p-0">
            <div className="flex items-center gap-1 p-2 border-b border-[#F5E6D8]">
              <button
                type="button"
                onClick={() => setDateMode("single")}
                className={`flex-1 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                  dateMode === "single"
                    ? "bg-[#FF8A00] text-white"
                    : "text-[#564334] hover:bg-[#FFF8F6]"
                }`}
              >
                Tanggal Tunggal
              </button>
              <button
                type="button"
                onClick={() => setDateMode("range")}
                className={`flex-1 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                  dateMode === "range"
                    ? "bg-[#FF8A00] text-white"
                    : "text-[#564334] hover:bg-[#FFF8F6]"
                }`}
              >
                Rentang Tanggal
              </button>
            </div>
            {dateMode === "single" ? (
              <CalendarComp
                mode="single"
                selected={singleDate}
                onSelect={setSingleDate}
              />
            ) : (
              <CalendarComp
                mode="range"
                selected={range}
                onSelect={setRange}
                numberOfMonths={2}
              />
            )}
            <div className="flex items-center justify-end gap-2 p-2 border-t border-[#F5E6D8]">
              <button
                type="button"
                onClick={handleResetDate}
                className="px-3 py-1.5 text-xs font-medium text-[#8A7362] hover:text-[#FF8A00] transition-colors"
              >
                Hapus
              </button>
              <button
                type="button"
                onClick={handleDateApply}
                className="px-4 py-1.5 rounded-full bg-[#FF8A00] text-white text-xs font-semibold font-[var(--font-be-vietnam)] hover:bg-[#E67E00] transition-colors"
              >
                Terapkan
              </button>
            </div>
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <button
              type="button"
              className={`inline-flex items-center gap-2 px-4 py-3 bg-white border rounded-full text-sm font-medium font-[var(--font-be-vietnam)] transition-all ${
                activityType !== "all"
                  ? "border-[#FF8A00] text-[#FF8A00]"
                  : "border-[#DDC1AE] text-[#564334] hover:border-[#FF8A00] hover:text-[#FF8A00]"
              }`}
            >
              <Filter className="w-4 h-4" />
              <span>
                {ACTIVITY_TYPES.find((t) => t.value === activityType)?.label ||
                  "Jenis Aktivitas"}
              </span>
            </button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-48 p-1">
            {ACTIVITY_TYPES.map((type) => (
              <button
                key={type.value}
                type="button"
                onClick={() => onActivityTypeChange(type.value as typeof activityType)}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium font-[var(--font-be-vietnam)] transition-colors ${
                  activityType === type.value
                    ? "bg-[#FFE9E4] text-[#FF8A00]"
                    : "text-[#564334] hover:bg-[#FFF8F6]"
                }`}
              >
                {type.label}
              </button>
            ))}
          </PopoverContent>
        </Popover>

        <button
          type="button"
          onClick={onExport}
          disabled={isLoading}
          className="inline-flex items-center gap-2 px-4 py-3 bg-white border border-[#DDC1AE] rounded-full text-sm font-medium text-[#564334] font-[var(--font-be-vietnam)] hover:bg-[#FFF8F6] hover:border-[#FF8A00] hover:text-[#FF8A00] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download className="w-4 h-4" />
          <span>Export</span>
        </button>

        {hasFilters && (
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-2 px-4 py-3 bg-white border border-[#DDC1AE] rounded-full text-sm font-medium text-[#8A7362] font-[var(--font-be-vietnam)] hover:border-[#FF8A00] hover:text-[#FF8A00] hover:bg-[#FFF8F6] transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset</span>
          </button>
        )}
      </form>
    </div>
  );
}