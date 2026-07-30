"use client";

import { useState } from "react";
import { format } from "date-fns";
import { id } from "date-fns/locale/id";
import { enUS } from "date-fns/locale/en-US";
import { Calendar as CalendarIcon } from "lucide-react";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { ProfitChart } from "@/components/dashboard/profit-chart";
import { ExpenseChart } from "@/components/dashboard/expense-chart";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { TopProducts } from "@/components/dashboard/top-products";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import type { LaporanDateParams } from "@/lib/laporan-query";
import type { DateRange } from "react-day-picker";
import { useTranslation } from "@/context/language-context";

export default function DashboardPage() {
  const { t, locale } = useTranslation("dashboard");
  const [mode, setMode] = useState<"single" | "range">("single");
  const [singleDate, setSingleDate] = useState<Date | undefined>(new Date());
  const [range, setRange] = useState<DateRange | undefined>(undefined);

  const dateLocale = locale === "en" ? enUS : id;

  const dateParams: LaporanDateParams =
    mode === "range" && range?.from && range?.to
      ? { startDate: format(range.from, "yyyy-MM-dd"), endDate: format(range.to, "yyyy-MM-dd") }
      : mode === "single" && singleDate
        ? { date: format(singleDate, "yyyy-MM-dd") }
        : { days: 7 };

  const labelText =
    mode === "range" && range?.from && range?.to
      ? `${format(range.from, "d MMM", { locale: dateLocale })} – ${format(range.to, "d MMM yyyy", { locale: dateLocale })}`
      : singleDate
        ? format(singleDate, "EEEE, d MMMM yyyy", { locale: dateLocale })
        : t("datePicker.selectDate");

  return (
    <div className="space-y-6">
      <div className="flex justify-end mb-6">
        <Popover>
          <PopoverTrigger asChild>
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-[#DDC1AE] rounded-full text-sm text-[#564334] font-medium shadow-[0_2px_10px_rgba(109,76,65,0.05)] hover:bg-[#FFF8F6] transition-colors focus:outline-none focus:ring-2 focus:ring-[#FF8A00]">
              <CalendarIcon size={16} className="text-[#8A7362]" />
              <span>{labelText}</span>
              <svg className="w-4 h-4 ml-1 text-[#8A7362]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-auto p-0">
            <div className="flex items-center gap-1 p-2 border-b border-[#F5E6D8]">
              <button
                onClick={() => setMode("single")}
                className={`flex-1 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                  mode === "single" ? "bg-[#FF8A00] text-white" : "text-[#564334] hover:bg-[#FFF8F6]"
                }`}
              >
                {t("datePicker.singleDate")}
              </button>
              <button
                onClick={() => setMode("range")}
                className={`flex-1 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                  mode === "range" ? "bg-[#FF8A00] text-white" : "text-[#564334] hover:bg-[#FFF8F6]"
                }`}
              >
                {t("datePicker.dateRange")}
              </button>
            </div>
            {mode === "single" ? (
              <Calendar mode="single" selected={singleDate} onSelect={setSingleDate} />
            ) : (
              <Calendar mode="range" selected={range} onSelect={setRange} numberOfMonths={1} />
            )}
          </PopoverContent>
        </Popover>
      </div>

      <StatsCards dateParams={dateParams} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <ProfitChart dateParams={dateParams} />
          <ExpenseChart dateParams={dateParams} />
        </div>
        <div className="space-y-6">
          <RecentActivity dateParams={dateParams} />
          <TopProducts dateParams={dateParams} />
        </div>
      </div>
    </div>
  );
}