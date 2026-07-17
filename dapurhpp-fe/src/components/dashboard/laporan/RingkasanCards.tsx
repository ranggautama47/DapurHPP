"use client";

import { TrendingUp, ClipboardList, TrendingDown, Wallet, Percent } from "lucide-react";
import { RingkasanLaporan } from "@/types/laporan";

interface RingkasanCardsProps {
  data: RingkasanLaporan | null;
  loading: boolean;
}

function TrendBadge({ value, suffix = "%", invert = false }: { value: number; suffix?: string; invert?: boolean }) {
  const isGood = invert ? value <= 0 : value >= 0;
  return (
    <span className={`text-xs flex items-center gap-1 ${isGood ? "text-[#06D6A0]" : "text-[#EF4444]"}`}>
      {value >= 0 ? "↑" : "↓"} {Math.abs(value).toLocaleString("id-ID", { minimumFractionDigits: 1 })}{suffix} dari periode sebelumnya
    </span>
  );
}

function Skeleton() {
  return (
    <div className="bg-white rounded-[24px] border border-[#DDC1AE] p-6 shadow-[0_8px_30px_rgba(109,76,65,0.08)] animate-pulse">
      <div className="flex items-start justify-between mb-4">
        <div className="space-y-2">
          <div className="h-3 w-24 bg-[#F5E6D8] rounded" />
          <div className="h-3 w-32 bg-[#F5E6D8] rounded" />
        </div>
        <div className="w-10 h-10 rounded-xl bg-[#F5E6D8]" />
      </div>
      <div className="h-7 w-28 bg-[#F5E6D8] rounded mt-2" />
    </div>
  );
}

export function RingkasanCards({ data, loading }: RingkasanCardsProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} />
        ))}
      </div>
    );
  }

  const cards = [
    {
      label: "Total Pendapatan",
      value: `Rp ${(data?.totalPendapatan ?? 0).toLocaleString("id-ID")}`,
      tren: data?.tren.pendapatan ?? 0,
      invert: false,
      icon: TrendingUp,
      iconBg: "#E6FBF7",
      iconColor: "#06D6A0",
    },
    {
      label: "Total HPP",
      value: `Rp ${(data?.totalHpp ?? 0).toLocaleString("id-ID")}`,
      tren: data?.tren.hpp ?? 0,
      invert: true,
      icon: ClipboardList,
      iconBg: "#FFF3E5",
      iconColor: "#FF8A00",
    },
    {
      label: "Total Pengeluaran",
      value: `Rp ${(data?.totalPengeluaran ?? 0).toLocaleString("id-ID")}`,
      tren: data?.tren.pengeluaran ?? 0,
      invert: true,
      icon: TrendingDown,
      iconBg: "#FEE2E2",
      iconColor: "#EF4444",
    },
    {
      label: "Laba Bersih",
      value: `Rp ${(data?.totalLaba ?? 0).toLocaleString("id-ID")}`,
      tren: data?.tren.laba ?? 0,
      invert: false,
      icon: Wallet,
      iconBg: "#EDE9FE",
      iconColor: "#8B5CF6",
    },
    {
      label: "Margin Keuntungan",
      value: `${(data?.margin ?? 0).toLocaleString("id-ID", { minimumFractionDigits: 2 })}%`,
      tren: data?.tren.margin ?? 0,
      invert: false,
      icon: Percent,
      iconBg: "#E0F2FE",
      iconColor: "#00B4D8",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
      {cards.map((card, i) => (
        <div
          key={i}
          className="bg-white rounded-[24px] border border-[#DDC1AE] p-5 shadow-[0_8px_30px_rgba(109,76,65,0.08)] hover:-translate-y-1 transition-transform duration-300"
        >
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-[10px] text-[#8A7362] font-semibold uppercase tracking-wider mb-1">
                {card.label}
              </p>
              <TrendBadge value={card.tren} invert={card.invert} />
            </div>
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: card.iconBg }}
            >
              <card.icon size={18} strokeWidth={1.75} color={card.iconColor} />
            </div>
          </div>
          <p className="font-[var(--font-roboto-mono)] font-bold text-xl sm:text-2xl text-[#2A1711]">
            {card.value}
          </p>
        </div>
      ))}
    </div>
  );
}