"use client";

import { useRouter } from "next/navigation";
import { ChefHat } from "lucide-react";
import { Resep } from "@/types/resep";

interface ResepCardProps {
  resep: Resep;
}

export function ResepCard({ resep }: ResepCardProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/dashboard/resep/${resep.id}`);
  };

  return (
    <button
      onClick={handleClick}
      className="group text-left bg-white rounded-[24px] border border-[#DDC1AE] shadow-[0_8px_30px_rgba(109,76,65,0.08)] overflow-hidden transition-all duration-300 hover:shadow-[0_12px_40px_rgba(109,76,65,0.12)] hover:-translate-y-1 hover:border-[#FF8A00]/40"
    >
      <div className="relative aspect-[4/3] bg-[#FFF8F6] overflow-hidden">
        {resep.fotoUrl ? (
          <img
            src={resep.fotoUrl}
            alt={resep.nama}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ChefHat
              className="w-16 h-16 text-[#DDC1AE] transition-colors duration-300 group-hover:text-[#FF8A00]"
              strokeWidth={1.5}
            />
          </div>
        )}
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <h3 className="font-[var(--font-playfair)] font-bold text-xl text-[#2A1711] line-clamp-2 leading-tight">
            {resep.nama}
          </h3>
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-[#D0F4DE] text-[#06D6A0] flex-shrink-0">
            Aktif
          </span>
        </div>

        <div className="space-y-2 pt-3 border-t border-[#F5E6D8]">
          <div className="flex items-center justify-between">
            <span className="text-sm text-[#564334] font-[var(--font-be-vietnam)]">
              HPP / pcs
            </span>
            <span className="font-[var(--font-roboto-mono)] font-bold text-lg text-[#FF8A00]">
              Rp {(resep.hppPerPcs ?? 0).toLocaleString("id-ID")}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-[#8A7362] font-[var(--font-be-vietnam)]">
              Hasil / Batch
            </span>
            <span className="font-[var(--font-be-vietnam)] font-medium text-[#564334]">
              {resep.estimasiHasil} pcs
            </span>
          </div>
          {typeof resep.detailCount === "number" && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#8A7362] font-[var(--font-be-vietnam)]">
                Jumlah Bahan
              </span>
              <span className="font-[var(--font-be-vietnam)] font-medium text-[#564334]">
                {resep.detailCount} item
              </span>
            </div>
          )}
          {resep.catatan && (
            <div className="flex items-center gap-1.5 text-xs text-[#8A7362] pt-1 border-t border-[#F5E6D8]">
              <span className="inline-block w-1 h-1 rounded-full bg-[#FF8A00]" />
              Ada catatan
            </div>
          )}
        </div>
      </div>
    </button>
  );
}
