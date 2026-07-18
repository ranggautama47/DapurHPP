import { Package, Calendar, BarChart3, TrendingUp } from "lucide-react";
import type { PengeluaranStats } from "@/lib/pengeluaran-lain";
import { formatRupiah } from "@/lib/pengeluaran-lain";

interface StatsCardsProps {
  stats: PengeluaranStats;
  loading: boolean;
}

const cards = [
  {
    label: "Total Pengeluaran Hari Ini",
    key: "totalHariIni" as const,
    icon: Package,
    color: "text-[#06D6A0] bg-[#E6FBF7]",
  },
  {
    label: "Total Pengeluaran Minggu Ini",
    key: "totalMingguIni" as const,
    icon: Calendar,
    color: "text-[#FF8A00] bg-[#FFF3E5]",
  },
  {
    label: "Total Pengeluaran Bulan Ini",
    key: "totalBulanIni" as const,
    icon: BarChart3,
    color: "text-[#8B5CF6] bg-[#F3EEFF]",
  },
  {
    label: "Rata-rata per Hari Bulan Ini",
    key: "rataRataHari" as const,
    icon: TrendingUp,
    color: "text-[#10B981] bg-[#E6FBF7]",
  },
];

export function StatsCards({ stats, loading }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map((card) => {
        const Icon = card.icon;
        const value = stats[card.key];
        return (
          <div
            key={card.key}
            className="bg-white rounded-[24px] border border-[#DDC1AE] p-5 shadow-[0_8px_30px_rgba(109,76,65,0.08)]"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className={`p-2 rounded-xl ${card.color}`}>
                <Icon className="w-4 h-4" />
              </div>
              <p className="text-xs text-[#8A7362] font-medium">{card.label}</p>
            </div>
            {loading ? (
              <div className="h-8 w-[60%] bg-[#F5E6D8] rounded-lg animate-pulse" />
            ) : (
              <p className="font-[var(--font-roboto-mono)] font-bold text-2xl text-[#2A1711] break-all">
                {formatRupiah(value)}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
