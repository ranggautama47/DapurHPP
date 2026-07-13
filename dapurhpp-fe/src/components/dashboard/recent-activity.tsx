"use client";

import { useEffect, useState } from "react";
import { ShoppingCart, ChefHat, TrendingUp, DollarSign, BookOpen } from "lucide-react";
import { api } from "@/lib/axios";

interface ActivityItem {
  type: 'penjualan' | 'pengeluaran';
  description: string;
  time: string;
  amount: number;
  amountType: 'positive' | 'negative';
}

const ICON_MAP: Record<string, { icon: typeof ShoppingCart; iconBg: string; iconColor: string }> = {
  penjualan: { icon: TrendingUp, iconBg: "#D0F4DE", iconColor: "#06D6A0" },
  pembayaran: { icon: DollarSign, iconBg: "#D0F4DE", iconColor: "#06D6A0" },
  belanja: { icon: ShoppingCart, iconBg: "#FFE9E4", iconColor: "#FF8A00" },
  produksi: { icon: ChefHat, iconBg: "#EAF2D7", iconColor: "#606C38" },
  pengeluaran: { icon: DollarSign, iconBg: "#FFE9E4", iconColor: "#FF8A00" },
};

export function RecentActivity() {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchActivities() {
      try {
        const res = await api.get<ActivityItem[]>("/laporan/aktivitas-terbaru");
        setActivities(res.data);
      } catch (err) {
        console.error("Gagal fetch aktivitas:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchActivities();
  }, []);

  const formatTime = (timeStr: string) => {
    const d = new Date(timeStr);
    return d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB';
  };

  return (
    <div className="bg-white rounded-[24px] border border-[#E8D5C4] p-6 shadow-[0_8px_30px_rgba(109,76,65,0.08)]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-[var(--font-playfair)] font-bold text-lg text-[#2A1711]">Aktivitas Terbaru</h3>
        <a href="#" className="text-sm text-[#FF8A00] font-medium hover:underline">Lihat Semua</a>
      </div>
      <div className="space-y-3">
        {loading ? (
          [...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-3 py-2 border-b border-[#EFE3D7] last:border-b-0">
              <div className="w-9 h-9 rounded-full bg-[#F5E6D8] animate-pulse" />
              <div className="flex-1 space-y-1">
                <div className="h-4 bg-[#F5E6D8] rounded w-3/4 animate-pulse" />
                <div className="h-3 bg-[#F5E6D8] rounded w-1/2 animate-pulse" />
              </div>
            </div>
          ))
        ) : activities.length === 0 ? (
          <p className="text-center text-[#8A7362] py-4">Belum ada aktivitas</p>
        ) : (
          activities.map((a, i) => {
            const iconConfig = ICON_MAP[a.type] ?? ICON_MAP.pengeluaran;
            const IconComp = iconConfig.icon;
            return (
              <div key={i} className="flex items-center gap-3 py-2 border-b border-[#EFE3D7] last:border-b-0">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: iconConfig.iconBg }}
                >
                  <IconComp size={16} strokeWidth={1.75} color={iconConfig.iconColor} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#2A1711] truncate font-[var(--font-be-vietnam)]">{a.description}</p>
                  <p className="text-xs text-[#8A7362]">{formatTime(a.time)}</p>
                </div>
                <span className={`text-xs font-[var(--font-roboto-mono)] font-semibold flex-shrink-0 ${a.amountType === 'positive' ? 'text-[#06D6A0]' : 'text-[#EF4444]'}`}>
                  {a.amountType === 'positive' ? '+' : '-'}Rp {a.amount.toLocaleString('id-ID')}
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}