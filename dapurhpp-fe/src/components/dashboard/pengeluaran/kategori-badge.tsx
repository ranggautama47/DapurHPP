import type { Kategori } from "@/types/pengeluaran";

const kategoriColors: Record<Kategori, string> = {
  UTILITAS: "bg-[#8B5CF6]/10 text-[#8B5CF6] border-[#8B5CF6]/20",
  KEMASAN: "bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20",
  TRANSPORTASI: "bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20",
  KEBERSIHAN: "bg-[#3B82F6]/10 text-[#3B82F6] border-[#3B82F6]/20",
  LAINNYA: "bg-[#6B7280]/10 text-[#6B7280] border-[#6B7280]/20",
};

const kategoriLabels: Record<Kategori, string> = {
  UTILITAS: "Utilitas",
  KEMASAN: "Kemasan",
  TRANSPORTASI: "Transportasi",
  KEBERSIHAN: "Kebersihan",
  LAINNYA: "Lainnya",
};

export function KategoriBadge({ kategori }: { kategori: Kategori }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${kategoriColors[kategori]}`}
    >
      {kategoriLabels[kategori]}
    </span>
  );
}