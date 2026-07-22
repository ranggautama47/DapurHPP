"use client";

import { Package, ShoppingCart, ShoppingBag, FileText } from "lucide-react";

interface RingkasanOperasionalProps {
  counts: {
    totalProduksi: number;
    totalPenjualan: number;
    totalBelanja: number;
    totalPengeluaranLain: number;
  };
  loading: boolean;
}

const items = [
  { key: "totalProduksi" as const, label: "Total Produksi", icon: Package, color: "#FF8A00", bg: "#FFF3E5" },
  { key: "totalPenjualan" as const, label: "Total Penjualan", icon: ShoppingCart, color: "#06D6A0", bg: "#E6FBF7" },
  { key: "totalBelanja" as const, label: "Total Belanja Bahan", icon: ShoppingBag, color: "#8B5CF6", bg: "#EDE9FE" },
  { key: "totalPengeluaranLain" as const, label: "Total Pengeluaran Lain", icon: FileText, color: "#EF4444", bg: "#FEE2E2" },
];

function Skeleton() {
  return (
    <div className="animate-pulse space-y-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#F5E6D8]" />
          <div className="flex-1 space-y-1.5">
            <div className="h-2.5 w-24 bg-[#F5E6D8] rounded" />
            <div className="h-3 w-16 bg-[#F5E6D8] rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function RingkasanOperasional({ counts, loading }: RingkasanOperasionalProps) {
  if (loading) return <Skeleton />;

  return (
    <div className="bg-white rounded-[24px] border border-[#DDC1AE] p-4 sm:p-6 shadow-[0_8px_30px_rgba(109,76,65,0.08)]">
      <h3 className="font-[var(--font-playfair)] font-bold text-base sm:text-lg text-[#2A1711] mb-4 sm:mb-6">
        Ringkasan Operasional
      </h3>

      <div className="grid grid-cols-2 sm:grid-cols-1 gap-3 sm:gap-4">
        {items.map((item) => (
          <div key={item.key} className="flex items-center gap-2.5 sm:gap-3">
            <div
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: item.bg }}
            >
              <item.icon className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={1.75} color={item.color} />
            </div>
            <div>
              <p className="text-[10px] sm:text-xs text-[#8A7362] font-medium">{item.label}</p>
              <p className="font-[var(--font-roboto-mono)] font-bold text-xs sm:text-sm text-[#2A1711]">
                {counts[item.key]} kali
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}