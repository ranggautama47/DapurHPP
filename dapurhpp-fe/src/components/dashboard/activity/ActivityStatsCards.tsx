"use client";

import { useEffect, useState } from "react";
import {
  Clock,
  Calendar,
  CalendarDays,
  BarChart2,
} from "lucide-react";
import { api } from "@/lib/axios";
import { buildAktivitasQuery, type AktivitasQueryParams } from "@/lib/aktivitas-query";

interface StatsResponse {
  today: number;
  thisWeek: number;
  thisMonth: number;
  topType: {
    type: "penjualan" | "belanja" | "produksi" | "pengeluaran";
    count: number;
  };
}

const ICON_CONFIG = {
  today: { icon: Clock, bg: "#D0F4DE", color: "#06D6A0", label: "Total Aktivitas Hari Ini" },
  week: { icon: Calendar, bg: "#FFF3E0", color: "#FFB020", label: "Aktivitas Minggu Ini" },
  month: { icon: CalendarDays, bg: "#EAF2D7", color: "#606C38", label: "Aktivitas Bulan Ini" },
  topType: { icon: BarChart2, bg: "#F3E8FF", color: "#6B21A8", label: "Jenis Aktivitas Terbanyak" },
};

export function ActivityStatsCards() {
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);

  const fetchStats = async () => {
    setLoading(true);
    setFetchError(false);
    try {
      const res = await api.get<StatsResponse>(`/aktivitas/stats${buildAktivitasQuery({})}`);
      setStats(res.data);
    } catch (err) {
      console.error("Gagal fetch stats aktivitas:", err);
      setFetchError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const topTypeLabel = stats?.topType?.type
    ? stats.topType.type.charAt(0).toUpperCase() + stats.topType.type.slice(1)
    : "—";

  const cards = [
    {
      ...ICON_CONFIG.today,
      value: stats?.today ?? 0,
      suffix: "aktivitas",
      subLabel: undefined as string | undefined,
    },
    {
      ...ICON_CONFIG.week,
      value: stats?.thisWeek ?? 0,
      suffix: "aktivitas",
      subLabel: undefined as string | undefined,
    },
    {
      ...ICON_CONFIG.month,
      value: stats?.thisMonth ?? 0,
      suffix: "aktivitas",
      subLabel: undefined as string | undefined,
    },
    {
      ...ICON_CONFIG.topType,
      value: stats?.topType?.count ?? 0,
      suffix: "x",
      subLabel: topTypeLabel,
    },
  ];

  if (fetchError) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-[#8A7362]">
        <svg className="w-12 h-12 mb-3 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-base mb-4">Gagal memuat statistik aktivitas</p>
        <button
          onClick={fetchStats}
          className="px-5 py-2 rounded-full bg-[#FF8A00] text-white text-sm font-medium hover:bg-[#E67E00] transition-colors"
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((card, i) => (
        <div
          key={i}
          className="bg-white rounded-[24px] border border-[#E8D5C4] p-6 shadow-[0_8px_30px_rgba(109,76,65,0.08)] hover:-translate-y-1 transition-transform duration-300"
        >
          {loading ? (
            <>
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-[#E8D5C4] rounded-lg w-[55%] animate-pulse" />
                </div>
                <div className="w-10 h-10 rounded-xl bg-[#F5E6D8] animate-pulse flex-shrink-0" />
              </div>
              <div className="h-8 bg-[#E8D5C4] rounded-lg w-[40%] animate-pulse" />
            </>
          ) : (
            <>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-xs font-medium text-[#8A7362] font-[var(--font-be-vietnam)]">
                    {card.label}
                  </p>
                  {card.subLabel && (
                    <p className="text-xs text-[#FF8A00] font-medium mt-0.5 font-[var(--font-be-vietnam)]">
                      {card.subLabel}
                    </p>
                  )}
                </div>
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: card.bg }}
                >
                  <card.icon size={18} strokeWidth={1.75} color={card.color} />
                </div>
              </div>
              <p
                className="text-2xl font-bold font-[var(--font-roboto-mono)] text-[#2A1711]"
                style={{ color: card.color }}
              >
                {card.value.toLocaleString("id-ID")}
                <span className="text-lg font-normal text-[#8A7362] ml-1">
                  {card.suffix}
                </span>
              </p>
            </>
          )}
        </div>
      ))}
    </div>
  );
}