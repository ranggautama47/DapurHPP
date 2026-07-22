"use client";

import { useEffect, useState } from "react";
import {
  ShoppingCart,
  ChefHat,
  TrendingUp,
  DollarSign,
} from "lucide-react";
import { api } from "@/lib/axios";
import Link from "next/link";
import { buildLaporanQuery, type LaporanDateParams } from "@/lib/laporan-query";

interface ActivityItem {
  type: "penjualan" | "pengeluaran";
  description: string;
  time: string;
  amount: number;
  amountType: "positive" | "negative";
}

const ICON_MAP: Record<
  string,
  { icon: typeof ShoppingCart; iconBg: string; iconColor: string }
> = {
  penjualan: { icon: TrendingUp, iconBg: "#D0F4DE", iconColor: "#06D6A0" },
  pembayaran: { icon: DollarSign, iconBg: "#D0F4DE", iconColor: "#06D6A0" },
  belanja: { icon: ShoppingCart, iconBg: "#FFE9E4", iconColor: "#FF8A00" },
  produksi: { icon: ChefHat, iconBg: "#EAF2D7", iconColor: "#606C38" },
  pengeluaran: { icon: DollarSign, iconBg: "#FFE9E4", iconColor: "#FF8A00" },
};

export function RecentActivity({ dateParams }: { dateParams?: LaporanDateParams }) {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);

  const fetchActivities = async () => {
    setLoading(true);
    setFetchError(false);
    try {
      const res = await api.get<ActivityItem[]>(
        `/laporan/aktivitas-terbaru${buildLaporanQuery(dateParams ?? {})}`,
      );
      setActivities(res.data);
    } catch (err) {
      console.error("Gagal fetch aktivitas:", err);
      setFetchError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, [dateParams]);

  const formatTime = (timeStr: string) => {
    const d = new Date(timeStr);
    return (
      d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) +
      " WIB"
    );
  };

  return (
    <div className="bg-white rounded-[24px] border border-[#E8D5C4] p-6 shadow-[0_8px_30px_rgba(109,76,65,0.08)]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-[var(--font-playfair)] font-bold text-lg text-[#2A1711]">
          Aktivitas Terbaru
        </h3>
        <Link
          href="/dashboard/aktivitas"
          className="text-sm text-[#FF8A00] font-medium hover:underline transition-colors hover:text-[#E67E00]"
        >
          Lihat Semua
        </Link>
      </div>
      <div className="space-y-3">
        {loading ? (
          [...Array(5)].map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-3 py-2 border-b border-[#EFE3D7] last:border-b-0"
            >
              <div className="w-9 h-9 rounded-full bg-[#F5E6D8] animate-pulse" />
              <div className="flex-1 space-y-1">
                <div className="h-4 bg-[#F5E6D8] rounded w-3/4 animate-pulse" />
                <div className="h-3 bg-[#F5E6D8] rounded w-1/2 animate-pulse" />
              </div>
            </div>
          ))
        ) : fetchError ? (
          <div className="flex flex-col items-center justify-center py-8 text-[#8A7362]">
            <svg className="w-10 h-10 mb-2 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm mb-3">Gagal memuat aktivitas</p>
            <button
              onClick={fetchActivities}
              className="px-4 py-1.5 rounded-full bg-[#FF8A00] text-white text-xs font-medium hover:bg-[#E67E00] transition-colors"
            >
              Coba Lagi
            </button>
          </div>
        ) : activities.length === 0 ? (
          <p className="text-center text-[#8A7362] py-4">Belum ada aktivitas</p>
        ) : (
          activities.map((a, i) => {
            const iconConfig = ICON_MAP[a.type] ?? ICON_MAP.pengeluaran;
            const IconComp = iconConfig.icon;
            return (
              <div
                key={i}
                className="flex items-center gap-3 py-2 border-b border-[#EFE3D7] last:border-b-0"
              >
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: iconConfig.iconBg }}
                >
                  <IconComp
                    size={16}
                    strokeWidth={1.75}
                    color={iconConfig.iconColor}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#2A1711] truncate font-[var(--font-be-vietnam)]">
                    {a.description}
                  </p>
                  <p className="text-xs text-[#8A7362]">{formatTime(a.time)}</p>
                </div>
                <span
                  className={`text-xs font-[var(--font-roboto-mono)] font-semibold flex-shrink-0 ${a.amountType === "positive" ? "text-[#06D6A0]" : "text-[#EF4444]"}`}
                >
                  {a.amountType === "positive" ? "+" : "-"}Rp{" "}
                  {a.amount.toLocaleString("id-ID")}
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}