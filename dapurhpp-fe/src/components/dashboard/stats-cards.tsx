"use client";

import { useEffect, useState } from "react";
import { TrendingUp, ShoppingBag, ShoppingCart, PieChart } from "lucide-react";
import { api } from "@/lib/axios";

interface StatsResponse {
  pendapatan: number;
  modal: number;
  penjualan: number;
  marginKeuntungan: number;
  pendapatanChange: string;
  modalChange: string;
  penjualanChange: string;
  marginChange: string;
}

interface StatCard {
  label: string;
  value: string;
  change: string;
  positive: boolean;
  icon: typeof TrendingUp;
  iconBg: string;
  iconColor: string;
}

const defaultCards: StatCard[] = [
  { label: "Pendapatan", value: "Rp 0", change: "+0% dari kemarin", positive: true, icon: TrendingUp, iconBg: "#D0F4DE", iconColor: "#06D6A0" },
  { label: "Modal (HPP)", value: "Rp 0", change: "+0% dari kemarin", positive: false, icon: ShoppingBag, iconBg: "#FFE9E4", iconColor: "#FF8A00" },
  { label: "Penjualan", value: "Rp 0", change: "+0% dari kemarin", positive: true, icon: ShoppingCart, iconBg: "#FFE9E4", iconColor: "#FF8A00" },
  { label: "Margin Keuntungan", value: "0%", change: "+0% dari kemarin", positive: true, icon: PieChart, iconBg: "#E8E8F4", iconColor: "#2E294E" },
];

export function StatsCards() {
  const [cards, setCards] = useState<StatCard[]>(defaultCards);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await api.get<StatsResponse>("/laporan/ringkasan");
        const d = res.data;
        setCards([
          {
            label: "Pendapatan",
            value: `Rp ${(d.pendapatan ?? 0).toLocaleString()}`,
            change: d.pendapatanChange ?? "+0%",
            positive: true,
            icon: TrendingUp,
            iconBg: "#D0F4DE",
            iconColor: "#06D6A0",
          },
          {
            label: "Modal (HPP)",
            value: `Rp ${(d.modal ?? 0).toLocaleString()}`,
            change: d.modalChange ?? "+0%",
            positive: false,
            icon: ShoppingBag,
            iconBg: "#FFE9E4",
            iconColor: "#FF8A00",
          },
          {
            label: "Penjualan",
            value: `Rp ${(d.penjualan ?? 0).toLocaleString()}`,
            change: d.penjualanChange ?? "+0%",
            positive: true,
            icon: ShoppingCart,
            iconBg: "#FFE9E4",
            iconColor: "#FF8A00",
          },
          {
            label: "Margin Keuntungan",
            value: `${(d.marginKeuntungan ?? 0).toLocaleString('id-ID', { minimumFractionDigits: 2 })}%`,
            change: d.marginChange ?? "+0%",
            positive: true,
            icon: PieChart,
            iconBg: "#E8E8F4",
            iconColor: "#2E294E",
          },
        ]);
      } catch (err) {
        console.error("Gagal fetch stats:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((s, i) => (
        <div key={i} className="bg-white rounded-[24px] border border-[#E8D5C4] p-6 shadow-[0_8px_30px_rgba(109,76,65,0.08)] hover:-translate-y-1 transition-transform duration-300">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm text-[#564334] font-[var(--font-be-vietnam)] mb-1">{s.label}</p>
              <p className={`text-xs flex items-center gap-1 ${s.positive ? "text-[#06D6A0]" : "text-[#EF4444]"}`}>
                {s.positive ? "↑" : "↑"} {s.change}
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: s.iconBg }}>
              <s.icon size={18} strokeWidth={1.75} color={s.iconColor} />
            </div>
          </div>
          <p className="text-2xl font-bold text-[#2A1711] font-[var(--font-roboto-mono)]">
            {loading ? "—" : s.value}
          </p>
        </div>
      ))}
    </div>
  );
}