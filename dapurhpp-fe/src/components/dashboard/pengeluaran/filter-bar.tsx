import { Calendar, Search } from "lucide-react";
import { useRef } from "react";
import type { Kategori } from "@/types/pengeluaran";

const KATEGORI_LIST: { value: Kategori | "Semua"; label: string }[] = [
  { value: "Semua", label: "Semua Kategori" },
  { value: "UTILITAS", label: "Utilitas" },
  { value: "KEMASAN", label: "Kemasan" },
  { value: "TRANSPORTASI", label: "Transportasi" },
  { value: "KEBERSIHAN", label: "Kebersihan" },
  { value: "LAINNYA", label: "Lainnya" },
];

interface FilterBarProps {
  tanggal: string;
  tanggalMulai: string;
  tanggalAkhir: string;
  kategori: Kategori | "Semua";
  onTanggalChange: (val: string) => void;
  onTanggalMulaiChange: (val: string) => void;
  onTanggalAkhirChange: (val: string) => void;
  onKategoriChange: (val: Kategori | "Semua") => void;
  onApply: () => void;
}

export function FilterBar({
  tanggal,
  tanggalMulai,
  tanggalAkhir,
  kategori,
  onTanggalChange,
  onTanggalMulaiChange,
  onTanggalAkhirChange,
  onKategoriChange,
  onApply,
}: FilterBarProps) {
  const dateInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="bg-white rounded-[24px] border border-[#DDC1AE] p-5 shadow-[0_8px_30px_rgba(109,76,65,0.08)] mb-6">
      <div className="flex flex-wrap items-end gap-4">
        {/* Tanggal Single */}
        <div className="flex-1 min-w-[140px]">
          <label className="block text-xs font-semibold text-[#564334] mb-1.5">
            Tanggal
          </label>
          <div className="relative">
            <button
              type="button"
              onClick={() => dateInputRef.current?.showPicker()}
              className="flex items-center gap-2 w-full h-12 px-4 rounded-[16px] border-2 border-[#DDC1AE] bg-white text-[#2A1711] text-sm hover:border-[#FF8A00] transition-colors"
            >
              <Calendar className="w-4 h-4 text-[#8A7362]" />
              <span>
                {tanggal
                  ? new Date(tanggal + "T00:00:00").toLocaleDateString(
                      "id-ID",
                      {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      },
                    )
                  : "Pilih tanggal"}
              </span>
            </button>
            <input
              ref={dateInputRef}
              type="date"
              value={tanggal}
              onChange={(e) => onTanggalChange(e.target.value)}
              className="absolute inset-0 w-0 h-0 opacity-0 pointer-events-none"
            />
          </div>
        </div>

        {/* Dari Tanggal */}
        <div className="flex-1 min-w-[140px]">
          <label className="block text-xs font-semibold text-[#564334] mb-1.5">
            Dari Tanggal
          </label>
          <input
            type="date"
            value={tanggalMulai}
            onChange={(e) => onTanggalMulaiChange(e.target.value)}
            className="w-full h-12 px-4 rounded-[16px] border-2 border-[#DDC1AE] bg-white text-[#2A1711] text-sm focus:outline-none focus:border-[#FF8A00] focus:ring-2 focus:ring-[#FF8A00]/20"
          />
        </div>

        {/* Sampai Tanggal */}
        <div className="flex-1 min-w-[140px]">
          <label className="block text-xs font-semibold text-[#564334] mb-1.5">
            Sampai Tanggal
          </label>
          <input
            type="date"
            value={tanggalAkhir}
            onChange={(e) => onTanggalAkhirChange(e.target.value)}
            className="w-full h-12 px-4 rounded-[16px] border-2 border-[#DDC1AE] bg-white text-[#2A1711] text-sm focus:outline-none focus:border-[#FF8A00] focus:ring-2 focus:ring-[#FF8A00]/20"
          />
        </div>

        {/* Kategori */}
        <div className="flex-1 min-w-[140px]">
          <label className="block text-xs font-semibold text-[#564334] mb-1.5">
            Kategori
          </label>
          <select
            value={kategori}
            onChange={(e) =>
              onKategoriChange(e.target.value as Kategori | "Semua")
            }
            className="w-full h-12 px-4 rounded-[16px] border-2 border-[#DDC1AE] bg-white text-[#2A1711] text-sm focus:outline-none focus:border-[#FF8A00] focus:ring-2 focus:ring-[#FF8A00]/20"
          >
            {KATEGORI_LIST.map((k) => (
              <option key={k.value} value={k.value}>
                {k.label}
              </option>
            ))}
          </select>
        </div>

        {/* Tombol Terapkan */}
        <button
          onClick={onApply}
          className="h-12 px-6 rounded-full bg-[#FF8A00] text-white font-semibold text-sm hover:bg-[#E67E00] transition-all flex items-center gap-2 shadow-[0_4px_12px_rgba(255,138,0,0.25)]"
        >
          <Search className="w-4 h-4" />
          Terapkan Filter
        </button>
      </div>
    </div>
  );
}
