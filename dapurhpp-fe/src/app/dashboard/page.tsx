"use client";

import { useState } from "react";
import { format } from "date-fns";
import { id } from "date-fns/locale/id";
import { Calendar as CalendarIcon } from "lucide-react";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { ProfitChart } from "@/components/dashboard/profit-chart";
import { ExpenseChart } from "@/components/dashboard/expense-chart";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { TopProducts } from "@/components/dashboard/top-products";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

export default function DashboardPage() {
  const [date, setDate] = useState<Date | undefined>(new Date());

  // Format tanggal untuk API (Contoh: "2026-07-09")
  const dateForAPI = date ? format(date, "yyyy-MM-dd") : undefined;

  return (
    <div className="space-y-6">
      <div className="flex justify-end mb-6">
        <Popover>
          <PopoverTrigger asChild>
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-[#DDC1AE] rounded-full text-sm text-[#564334] font-medium shadow-[0_2px_10px_rgba(109,76,65,0.05)] hover:bg-[#FFF8F6] transition-colors focus:outline-none focus:ring-2 focus:ring-[#FF8A00]">
              <CalendarIcon size={16} className="text-[#8A7362]" />
              <span>
                {date
                  ? format(date, "EEEE, d MMMM yyyy", { locale: id })
                  : "Pilih tanggal"}
              </span>
              <svg className="w-4 h-4 ml-1 text-[#8A7362]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-auto p-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
            />
          </PopoverContent>
        </Popover>
      </div>

      <StatsCards selectedDate={dateForAPI} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <ProfitChart />
          <ExpenseChart selectedDate={dateForAPI} />
        </div>
        <div className="space-y-6">
          <RecentActivity selectedDate={dateForAPI} />
          <TopProducts selectedDate={dateForAPI} />
        </div>
      </div>
    </div>
  );
}
