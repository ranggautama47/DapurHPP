"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Pencil, Trash2, Package } from "lucide-react";
import { BahanBaku } from "@/types/bahan-baku";
import { ConfirmDeleteDialog } from "@/components/ui/confirm-delete-dialog";
import { toast } from "sonner";
import { api } from "@/lib/axios";
import { PriceHistoryChart } from "./PriceHistoryChart";
import { BahanBakuForm } from "./BahanBakuForm";
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

interface BahanBakuDetailProps {
  initialData: BahanBaku;
}

export function BahanBakuDetail({ initialData }: BahanBakuDetailProps) {
  const router = useRouter();
  const params = useParams();
  const { t, language } = useTranslation("master");
  const [bahan, setBahan] = useState<BahanBaku>(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (initialData) setBahan(initialData);
  }, [initialData]);

  const fetchDetail = async () => {
    setIsLoading(true);
    try {
      const res = await api.get<BahanBaku>(`/bahan-baku/${params.id}`);
      setBahan(res.data);
    } catch (err) {
      console.error("Gagal fetch detail:", err);
      router.push("/dashboard/bahan-baku");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (params.id) fetchDetail();
  }, [params.id, router]);

  const handleEdit = () => setShowForm(true);

  const handleDelete = async () => {
    try {
      await api.delete(`/bahan-baku/${bahan.id}`);
      toast.success(t("ingredients.deleteSuccess"));
      setShowDeleteConfirm(false);
      router.push("/dashboard/bahan-baku");
    } catch (err) {
      console.error("Gagal hapus:", err);
      toast.error(t("ingredients.deleteError"));
      setShowDeleteConfirm(false);
    }
  };

  const handleFormSubmit = async (data: any) => {
    try {
      await api.patch(`/bahan-baku/${bahan.id}`, data);
      toast.success(t("ingredients.updateSuccess"));
      setShowForm(false);
      fetchDetail();
    } catch (err: any) {
      alert(err.response?.data?.message || t("ingredients.saveError"));
      toast.error(t("ingredients.updateError"));
      throw err;
    }
  };

  const stokPercent =
    bahan.stokMinimal > 0
      ? Math.min(
          100,
          Math.round((Number(bahan.stok) / Number(bahan.stokMinimal)) * 100),
        )
      : 100;

  const isLowStock = Number(bahan.stok) <= Number(bahan.stokMinimal);
  const localeStr = language === "id" ? "id-ID" : "en-US";

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <div className="w-10 h-10 border-4 border-[#FFE9E4] border-t-[#FF8A00] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard/bahan-baku"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#DDC1AE] text-[#564334] font-medium font-[var(--font-be-vietnam)] hover:bg-[#FFF8F6] hover:border-[#FF8A00] hover:text-[#FF8A00] transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          {t("ingredients.backButton")}
        </Link>

        <button
          onClick={handleEdit}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#DDC1AE] text-[#FF8A00] hover:bg-[#FFF8F6] transition-colors text-sm font-medium font-[var(--font-be-vietnam)]"
        >
          <Pencil className="w-4 h-4" strokeWidth={1.75} />
          {t("ingredients.editButton")}
        </button>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="bg-white rounded-[24px] border border-[#DDC1AE] p-6 shadow-[0_8px_30px_rgba(109,76,65,0.08)]">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-16 h-16 rounded-xl overflow-hidden bg-[#FFF8F6] border border-[#F5E6D8] flex items-center justify-center flex-shrink-0">
                {bahan.fotoUrl ? (
                  <img
                    src={`${API_URL}${bahan.fotoUrl}`}
                    alt={bahan.nama}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Package
                    className="w-8 h-8 text-[#FF8A00]"
                    strokeWidth={1.5}
                  />
                )}
              </div>
              <div>
                <h2 className="font-[var(--font-playfair)] font-bold text-xl text-[#2A1711]">
                  {bahan.nama}
                </h2>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#D0F4DE] text-[#06D6A0] mt-1">
                  {t("ingredients.activeStatus")}
                </span>
              </div>
            </div>

            <dl className="grid grid-cols-2 gap-4">
              <div>
                <dt className="text-xs text-[#8A7362] font-[var(--font-be-vietnam)] mb-1">
                  {t("ingredients.category")}
                </dt>
                <dd className="font-medium text-[#2A1711] font-[var(--font-be-vietnam)]">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${kategoriBadge[bahan.kategori].bg} ${kategoriBadge[bahan.kategori].text}`}
                  >
                    <span>{kategoriBadge[bahan.kategori].emoji}</span>
                    {t(`ingredients.categories.${KATEGORI_LOCALE_MAP[bahan.kategori]}`)}
                  </span>
                </dd>
              </div>
              <div>
                <dt className="text-xs text-[#8A7362] font-[var(--font-be-vietnam)] mb-1">
                  {t("ingredients.unit")}
                </dt>
                <dd className="font-medium text-[#2A1711] font-[var(--font-be-vietnam)]">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-[#FFF8F6] text-[#564334] border border-[#F5E6D8]">
                    {bahan.satuan.toUpperCase()}
                  </span>
                </dd>
              </div>
              <div>
                <dt className="text-xs text-[#8A7362] font-[var(--font-be-vietnam)] mb-1">
                  {t("ingredients.currentPrice")}
                </dt>
                <dd className="font-[var(--font-roboto-mono)] font-bold text-xl text-[#2A1711]">
                  Rp {Number(bahan.hargaTerakhir).toLocaleString(localeStr)}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-[#8A7362] font-[var(--font-be-vietnam)] mb-1">
                  {t("ingredients.lastUpdate")}
                </dt>
                <dd className="font-medium text-[#2A1711] font-[var(--font-be-vietnam)]">
                  {new Date(bahan.updatedAt).toLocaleDateString(localeStr, {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </dd>
              </div>
            </dl>
          </div>

          <div className="bg-white rounded-[24px] border border-[#DDC1AE] p-6 shadow-[0_8px_30px_rgba(109,76,65,0.08)]">
            <h3 className="font-[var(--font-playfair)] font-bold text-lg text-[#2A1711] mb-4">
              {t("ingredients.currentStockTitle")}
            </h3>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="font-[var(--font-roboto-mono)] font-bold text-3xl text-[#2A1711]">
                {Number(bahan.stok).toLocaleString(localeStr)}
              </span>
              <span className="text-lg text-[#8A7362] font-[var(--font-be-vietnam)]">
                {bahan.satuan}
              </span>
            </div>
            <p className="text-sm text-[#8A7362] font-[var(--font-be-vietnam)] mb-3">
              {t("ingredients.minStockText")}: {Number(bahan.stokMinimal).toLocaleString(localeStr)}{" "}
              {bahan.satuan}
            </p>
            <div className="w-full h-2.5 bg-[#F5E6D8] rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${isLowStock ? "bg-[#EF4444]" : "bg-[#06D6A0]"}`}
                style={{ width: `${stokPercent}%` }}
              />
            </div>
          </div>

          <div className="bg-white rounded-[24px] border border-[#DDC1AE] p-6 shadow-[0_8px_30px_rgba(109,76,65,0.08)]">
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-[#EF4444]/30 text-[#EF4444] hover:bg-[#FEF2F2] hover:border-[#EF4444] transition-all font-medium font-[var(--font-be-vietnam)]"
            >
              <Trash2 className="w-5 h-5" strokeWidth={1.75} />
              {t("ingredients.deleteButton")}
            </button>
          </div>
        </div>

        <div className="bg-white rounded-[24px] border border-[#DDC1AE] p-6 shadow-[0_8px_30px_rgba(109,76,65,0.08)]">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-[var(--font-playfair)] font-bold text-xl text-[#2A1711]">
              {t("ingredients.last6Months")}
            </h3>
            <select className="px-3 py-1.5 rounded-full border border-[#DDC1AE] text-sm text-[#564334] bg-[#FFF8F6] font-[var(--font-be-vietnam)] focus:outline-none focus:border-[#FF8A00]">
              <option>{t("ingredients.last6MonthsOption")}</option>
              <option>{t("ingredients.last1YearOption")}</option>
            </select>
          </div>
          <PriceHistoryChart bahanId={bahan.id} />
        </div>
      </div>

      <ConfirmDeleteDialog
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        onConfirm={handleDelete}
        title={t("ingredients.deleteConfirmTitle", { name: bahan.nama })}
        description={t("ingredients.deleteConfirmDesc")}
      />

      {showForm && (
        <BahanBakuForm
          isOpen={showForm}
          onClose={() => setShowForm(false)}
          onSubmit={handleFormSubmit}
          initialData={bahan}
          isLoading={isLoading}
        />
      )}
    </div>
  );
}
