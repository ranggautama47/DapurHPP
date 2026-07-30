"use client";

import { Pencil, Trash2, Package, Eye } from "lucide-react";
import { BahanBaku } from "@/types/bahan-baku";
import { kategoriBadge } from "./kategori-badge";
import { useTranslation } from "@/context/language-context";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") ||
  "http://localhost:3001";

const KATEGORI_LOCALE_MAP: Record<string, string> = {
  TEPUNG: "flour",
  MINYAK: "oil",
  SAYURAN: "vegetable",
  BUMBU: "spice",
  DAGING: "meat",
  LAINNYA: "other",
};

interface BahanBakuTableProps {
  data: BahanBaku[];
  onEdit: (bahan: BahanBaku) => void;
  onDelete: (id: number) => void;
  onView: (id: number) => void;
}

export function BahanBakuTable({
  data,
  onEdit,
  onDelete,
  onView,
}: BahanBakuTableProps) {
  const { t, language } = useTranslation("master");

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <Package className="w-16 h-16 text-[#DDC1AE] mb-4" />
        <p className="text-[#564334] text-lg font-[var(--font-be-vietnam)] mb-4">
          {t("ingredients.emptyState")}
        </p>
        <p className="text-[#8A7362] text-sm mb-6">
          {t("ingredients.emptyHint")}
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-[24px] border border-[#DDC1AE] bg-white">
      <table className="w-full">
        <thead>
          <tr className="bg-[#FFF8F6] border-b border-[#DDC1AE]">
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.1em] text-[#564334] font-[var(--font-be-vietnam)]">
              {t("ingredients.columns.name")}
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.1em] text-[#564334] font-[var(--font-be-vietnam)]">
              {t("ingredients.columns.category")}
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.1em] text-[#564334] font-[var(--font-be-vietnam)]">
              {t("ingredients.columns.unit")}
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.1em] text-[#564334] font-[var(--font-be-vietnam)]">
              {t("ingredients.columns.price")}
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.1em] text-[#564334] font-[var(--font-be-vietnam)]">
              {t("ingredients.columns.stock")}
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.1em] text-[#564334] font-[var(--font-be-vietnam)]">
              {t("ingredients.columns.updatedAt")}
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.1em] text-[#564334] font-[var(--font-be-vietnam)]">
              {t("ingredients.columns.actions")}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#F5E6D8]">
          {data.map((bahan) => (
            <tr
              key={bahan.id}
              className="hover:bg-[#FFE9E4] transition-colors cursor-pointer"
              onClick={() => onView(bahan.id)}
            >
              <td className="px-6 py-4">
                <div className="flex items-center gap-4">
                  {/* 
                    KOTAK — rounded-xl (bukan bulat), ukuran 48px (w-12 h-12)
                    Shadow + border tipis biar pixel-perfect & keliatan 3D
                  */}
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden bg-[#FFF8F6] border border-[#F5E6D8] shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
                    {/* Prioritas 1: Foto upload user */}
                    {bahan.fotoUrl ? (
                      <img
                        src={`${API_URL}${bahan.fotoUrl}`}
                        alt={bahan.nama}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      /* Prioritas 2: Emoji ilustrasi per kategori */
                      <span
                        className="text-[1.4rem] leading-none select-none"
                        role="img"
                        aria-label={t(`ingredients.categories.${KATEGORI_LOCALE_MAP[bahan.kategori] || bahan.kategori.toLowerCase()}`)}
                      >
                        {kategoriBadge[bahan.kategori].emoji}
                      </span>
                    )}
                  </div>
                  <span className="font-medium text-[#2A1711] font-[var(--font-be-vietnam)]">
                    {bahan.nama}
                  </span>
                </div>
              </td>
              <td className="px-6 py-4">
                <span
                  className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${kategoriBadge[bahan.kategori].bg} ${kategoriBadge[bahan.kategori].text}`}
                >
                  {t(`ingredients.categories.${KATEGORI_LOCALE_MAP[bahan.kategori] || bahan.kategori.toLowerCase()}`)}
                </span>
              </td>
              <td className="px-6 py-4 text-[#564334] font-[var(--font-be-vietnam)]">
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-[#FFF8F6] text-[#564334] border border-[#F5E6D8]">
                  {t(`ingredients.units.${bahan.satuan.toLowerCase()}`)}
                </span>
              </td>
              <td className="px-6 py-4">
                <span className="font-[var(--font-roboto-mono)] font-semibold text-[#2A1711]">
                  Rp {bahan.hargaTerakhir.toLocaleString(language === "id" ? "id-ID" : "en-US")}
                </span>
              </td>
              <td className="px-6 py-4">
                <span
                  className={`font-[var(--font-roboto-mono)] font-semibold ${
                    Number(bahan.stok) <= Number(bahan.stokMinimal) &&
                    Number(bahan.stokMinimal) > 0
                      ? "text-[#EF4444]"
                      : "text-[#06D6A0]"
                  }`}
                >
                  {Number(bahan.stok).toLocaleString(language === "id" ? "id-ID" : "en-US")}
                </span>
                <span className="text-[#8A7362] text-xs ml-1">
                  {t(`ingredients.units.${bahan.satuan.toLowerCase()}`)}
                </span>
              </td>
              <td className="px-6 py-4 text-[#564334] font-[var(--font-be-vietnam)] text-sm">
                {new Date(bahan.updatedAt).toLocaleDateString(language === "id" ? "id-ID" : "en-US", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onView(bahan.id);
                    }}
                    className="p-2 rounded-full hover:bg-[#FFE9E4] text-[#564334] transition-colors"
                    aria-label={t("ingredients.viewDetail")}
                  >
                    <Eye className="w-4 h-4" strokeWidth={1.75} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(bahan);
                    }}
                    className="p-2 rounded-full hover:bg-[#FFE9E4] text-[#FF8A00] transition-colors"
                    aria-label={t("ingredients.editLabel")}
                  >
                    <Pencil className="w-4 h-4" strokeWidth={1.75} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(bahan.id);
                    }}
                    className="p-2 rounded-full hover:bg-[#FEE2E2] text-[#EF4444] transition-colors"
                    aria-label={t("ingredients.deleteLabel")}
                  >
                    <Trash2 className="w-4 h-4" strokeWidth={1.75} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
