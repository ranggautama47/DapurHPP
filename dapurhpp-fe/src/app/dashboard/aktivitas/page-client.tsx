"use client";

import { useState, useCallback } from "react";
import { format } from "date-fns";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { ActivityStatsCards } from "@/components/dashboard/activity/ActivityStatsCards";
import { ActivityFilterBar } from "@/components/dashboard/activity/ActivityFilterBar";
import { ActivityList } from "@/components/dashboard/activity/ActivityList";
import type { AktivitasQueryParams } from "@/lib/aktivitas-query";

export default function ActivityPageClient() {
  const [params, setParams] = useState<AktivitasQueryParams>({
    page: 1,
    limit: 10,
  });

  const updateParams = useCallback((updates: Partial<AktivitasQueryParams>) => {
    setParams((prev) => ({ ...prev, ...updates }));
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setParams((prev) => ({ ...prev, page }));
  }, []);

  const handleExport = useCallback(() => {
    const sp = new URLSearchParams();
    if (params.search) sp.set("search", params.search);
    if (params.startDate) sp.set("startDate", params.startDate);
    if (params.endDate) sp.set("endDate", params.endDate);
    if (params.type && params.type !== "all") sp.set("type", params.type);
    window.open(`/api/aktivitas/export?${sp.toString()}`, "_blank");
  }, [params]);

  const hasFilters = Boolean(
    params.search || params.startDate || params.endDate || (params.type && params.type !== "all")
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-2">
        <div>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1 text-sm text-[#8A7362] hover:text-[#FF8A00] transition-colors mb-3"
          >
            <ChevronLeft className="w-4 h-4" />
            Kembali ke Dashboard
          </Link>
          <h1 className="font-[var(--font-playfair)] font-bold text-3xl md:text-4xl text-[#2A1711] mb-2">
            Aktivitas
          </h1>
          <p className="text-[#564334] text-lg">Riwayat seluruh aktivitas usaha.</p>
        </div>
      </div>

      <ActivityStatsCards />

      <ActivityFilterBar
        search={params.search || ""}
        onSearchChange={(value) => updateParams({ search: value || undefined, page: 1 })}
        onSearchSubmit={() => {}}
        startDate={params.startDate ? new Date(params.startDate) : undefined}
        endDate={params.endDate ? new Date(params.endDate) : undefined}
        onDateChange={(start, end) =>
          updateParams({
            startDate: start ? format(start, "yyyy-MM-dd") : undefined,
            endDate: end ? format(end, "yyyy-MM-dd") : undefined,
            page: 1,
          })
        }
        activityType={(params.type as "penjualan" | "belanja" | "produksi" | "pengeluaran" | "all") || "all"}
        onActivityTypeChange={(type) => updateParams({ type: type === "all" ? undefined : type, page: 1 })}
        onReset={() => updateParams({ search: undefined, startDate: undefined, endDate: undefined, type: undefined, page: 1 })}
        onExport={handleExport}
        hasFilters={hasFilters}
      />

      <div className="bg-white rounded-[24px] border border-[#E8D5C4] p-6 shadow-[0_8px_30px_rgba(109,76,65,0.08)]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-[var(--font-playfair)] font-bold text-lg text-[#2A1711]">
            Semua Aktivitas
          </h3>
          <p className="text-sm text-[#8A7362]">Riwayat seluruh aktivitas usaha.</p>
        </div>
        <ActivityList
          params={params}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}