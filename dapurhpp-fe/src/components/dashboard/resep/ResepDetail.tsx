"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Trash2,
  Pencil,
  Package,
  TrendingUp,
  ChefHat,
} from "lucide-react";
import { Resep } from "@/types/resep";
import { ConfirmDeleteDialog } from "@/components/ui/confirm-delete-dialog";
import { toast } from "sonner";
import { api } from "@/lib/axios";
import { useTranslation } from "@/context/language-context";
import { ResepForm } from "./ResepForm";
import { SimulasiHarga } from "./SimulasiHarga";

interface ResepDetailProps {
  initialData: Resep;
}

export function ResepDetail({ initialData }: ResepDetailProps) {
  const router = useRouter();
  const params = useParams();
  const { t, language } = useTranslation("master");
  const [resep, setResep] = useState<Resep>(initialData);
  const [showForm, setShowForm] = useState(false);
  const [showSimulasi, setShowSimulasi] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchDetail = async () => {
    setLoading(true);
    try {
      const res = await api.get<Resep>(`/resep/${params.id}`);
      setResep(res.data);
    } catch {
      router.push("/dashboard/resep");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (params.id) fetchDetail();
  }, [params.id]);

  const handleEdit = () => setShowForm(true);

  const handleFormSubmit = async (data: any) => {
    try {
      const res = await api.patch(`/resep/${resep.id}`, data);
      toast.success(t("recipes.successUpdate"));
      setShowForm(false);
      fetchDetail();
      return res.data;
    } catch (err: any) {
      alert(err.response?.data?.message || t("ingredients.saveError"));
      toast.error(t("recipes.errorUpdate"));
      throw err;
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/resep/${resep.id}`);
      toast.success(t("recipes.successDelete"));
      setShowDeleteConfirm(false);
      router.push("/dashboard/resep");
    } catch {
      toast.error(t("recipes.errorDelete"));
      setShowDeleteConfirm(false);
    }
  };

  const totalBahan = useMemo(() => {
    return (resep.detailResep ?? []).reduce(
      (sum, d) => sum + Number(d.jumlah) * Number(d.bahanBaku.hargaTerakhir),
      0,
    );
  }, [resep.detailResep]);

  const hppPerPcs = useMemo(() => {
    return resep.estimasiHasil > 0 ? totalBahan / resep.estimasiHasil : 0;
  }, [totalBahan, resep.estimasiHasil]);

  const locale = language === "id" ? "id-ID" : "en-US";

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3 text-[#8A7362]">
          <div className="w-8 h-8 border-4 border-[#FFE9E4] border-t-[#FF8A00] rounded-full animate-spin" />
          <p className="text-sm">{t("recipes.detail.loading")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <Link
          href="/dashboard/resep"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#DDC1AE] text-[#564334] font-medium font-[var(--font-be-vietnam)] hover:bg-[#FFF8F6] hover:border-[#FF8A00] hover:text-[#FF8A00] transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          {t("recipes.detail.backButton")}
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div>
              <p className="text-xs text-[#8A7362] font-[var(--font-be-vietnam)]">
                {t("recipes.title")} &gt; {resep.nama}
              </p>
              <h1 className="font-[var(--font-playfair)] font-bold text-2xl text-[#2A1711]">
                {resep.nama}
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSimulasi(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#FF8A00] text-[#FF8A00] hover:bg-[#FFF8F6] transition-colors text-sm font-semibold font-[var(--font-be-vietnam)]"
          >
            <TrendingUp className="w-4 h-4" strokeWidth={1.75} />
            {t("recipes.detail.simulationButton")}
          </button>
          <button
            onClick={handleEdit}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#FF8A00] text-white text-sm font-semibold hover:bg-[#E67E00] transition-colors font-[var(--font-be-vietnam)]"
          >
            <Pencil className="w-4 h-4" strokeWidth={1.75} />
            {t("recipes.detail.editButton")}
          </button>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="p-2 rounded-full hover:bg-[#FEE2E2] text-[#EF4444] transition-colors"
            aria-label={t("recipes.detail.deleteButton")}
          >
            <Trash2 className="w-5 h-5" strokeWidth={1.75} />
          </button>
        </div>
      </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Card Info */}
          <div className="bg-white rounded-[24px] border border-[#DDC1AE] p-6 shadow-[0_8px_30px_rgba(109,76,65,0.08)]">
            <div className="flex flex-col sm:flex-row gap-6">
              <div className="w-full sm:w-48 h-48 rounded-2xl bg-[#FFF8F6] overflow-hidden flex-shrink-0">
                {resep.fotoUrl ? (
                  <img
                    src={resep.fotoUrl}
                    alt={resep.nama}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ChefHat
                      className="w-12 h-12 text-[#DDC1AE]"
                      strokeWidth={1.5}
                    />
                  </div>
                )}
              </div>
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="font-[var(--font-playfair)] font-bold text-xl text-[#2A1711]">
                    {resep.nama}
                  </h2>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#D0F4DE] text-[#06D6A0]">
                    {t("recipes.status.active")}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div>
                    <p className="text-xs text-[#8A7362] font-[var(--font-be-vietnam)] mb-1">
                      {t("recipes.detail.estimatedYieldLabel")}
                    </p>
                    <p className="font-[var(--font-be-vietnam)] font-semibold text-[#2A1711]">
                      {resep.estimasiHasil} pcs
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-[#8A7362] font-[var(--font-be-vietnam)] mb-1">
                      {t("recipes.ingredients")}
                    </p>
                    <p className="font-[var(--font-be-vietnam)] font-semibold text-[#2A1711]">
                      {(resep.detailResep ?? []).length} item
                    </p>
                  </div>
                </div>

                {/* REVISI: Tanggal Diperbarui dipindah ke sini */}
                {resep.updatedAt && (
                  <div className="pt-3 border-t border-[#F5E6D8]">
                    <p className="text-xs text-[#8A7362] font-[var(--font-be-vietnam)] mb-1">
                      {t("recipes.detail.lastUpdated")}
                    </p>
                    <p className="text-sm font-medium text-[#564334]">
                      {new Date(resep.updatedAt).toLocaleDateString(locale, {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}{" "}
                      WIB
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Tabel Bahan */}
          <div className="bg-white rounded-[24px] border border-[#DDC1AE] p-6 shadow-[0_8px_30px_rgba(109,76,65,0.08)]">
            <h3 className="font-[var(--font-playfair)] font-bold text-lg text-[#2A1711] mb-4 flex items-center gap-2">
              <Package className="w-5 h-5 text-[#FF8A00]" strokeWidth={1.75} />
              {t("recipes.detail.infoSection")}
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#FFF8F6] border-b border-[#DDC1AE]">
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.1em] text-[#564334]">
                      {t("recipes.detail.tableNo")}
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.1em] text-[#564334]">
                      {t("recipes.detail.tableIngredient")}
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.1em] text-[#564334]">
                      {t("recipes.detail.tableUnit")}
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.1em] text-[#564334]">
                      {t("recipes.detail.tableQty")}
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.1em] text-[#564334]">
                      {t("recipes.detail.tablePrice")}
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.1em] text-[#564334]">
                      {t("recipes.detail.tableTotal")}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F5E6D8]">
                  {(resep.detailResep ?? []).map((d, i) => {
                    const subtotal =
                      Number(d.jumlah) * Number(d.bahanBaku.hargaTerakhir);
                    return (
                      <tr
                        key={d.id}
                        className="hover:bg-[#FFE9E4] transition-colors"
                      >
                        <td className="px-4 py-3 text-[#8A7362] font-[var(--font-roboto-mono)] text-xs">
                          {i + 1}
                        </td>
                        <td className="px-4 py-3 font-medium text-[#2A1711] font-[var(--font-be-vietnam)]">
                          {d.bahanBaku.nama}
                        </td>
                        <td className="px-4 py-3">
                          <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-[#FFF8F6] text-[#564334] border border-[#F5E6D8]">
                            {/* Mengambil satuan dari master bahan baku agar selalu akurat dengan database */}
                            {d.bahanBaku.satuan
                              ? d.bahanBaku.satuan.toUpperCase()
                              : (d.satuan || "").toUpperCase()}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-[var(--font-roboto-mono)] text-sm text-[#564334]">
                          {Number(d.jumlah).toLocaleString(locale)}
                        </td>
                        <td className="px-4 py-3 font-[var(--font-roboto-mono)] text-sm text-[#564334]">
                          Rp{" "}
                          {Number(d.bahanBaku.hargaTerakhir).toLocaleString(
                            locale,
                          )}
                        </td>
                        <td className="px-4 py-3 font-[var(--font-roboto-mono)] font-semibold text-[#2A1711]">
                          Rp {Math.round(subtotal).toLocaleString(locale)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className="bg-[#FFF8F6] border-t-2 border-[#DDC1AE]">
                    <td
                      colSpan={5}
                      className="px-4 py-3 text-right font-bold text-[#2A1711] font-[var(--font-be-vietnam)]"
                    >
                      {t("recipes.detail.totalCostLabel")}
                    </td>
                    <td className="px-4 py-3 font-[var(--font-roboto-mono)] font-bold text-[#FF8A00]">
                      Rp {Math.round(totalBahan).toLocaleString(locale)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {/* Ringkasan HPP */}
          <div className="bg-white rounded-[24px] border border-[#DDC1AE] p-6 shadow-[0_8px_30px_rgba(109,76,65,0.08)]">
            <h3 className="font-[var(--font-playfair)] font-bold text-lg text-[#2A1711] mb-4">
              {t("recipes.detail.summaryTitle")}
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#564334] font-[var(--font-be-vietnam)]">
                  {t("recipes.detail.totalCostSummary")}
                </span>
                <span className="font-[var(--font-roboto-mono)] font-semibold text-[#2A1711]">
                  Rp {Math.round(totalBahan).toLocaleString(locale)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#564334] font-[var(--font-be-vietnam)]">
                  {t("recipes.detail.yieldSummary")}
                </span>
                <span className="font-[var(--font-roboto-mono)] font-semibold text-[#2A1711]">
                  {resep.estimasiHasil} pcs
                </span>
              </div>
              <div className="pt-3 border-t border-[#F5E6D8]">
                <div className="bg-[#FFF8F6] rounded-xl p-4">
                  <p className="text-xs text-[#FF8A00] font-[var(--font-be-vietnam)] font-semibold mb-1">
                    {t("recipes.detail.hppPerPcs")}
                  </p>
                  <p className="font-[var(--font-roboto-mono)] font-bold text-2xl text-[#FF8A00]">
                    Rp {Math.round(hppPerPcs).toLocaleString(locale)}
                  </p>
                </div>
              </div>
              {typeof resep.marginPersen === "number" &&
                resep.marginPersen > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#564334] font-[var(--font-be-vietnam)]">
                      {t("recipes.detail.currentMargin")}
                    </span>
                    <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-bold bg-[#D0F4DE] text-[#06D6A0]">
                      {resep.marginPersen.toFixed(1)}%
                    </span>
                  </div>
                )}
            </div>
          </div>

          {/* Tombol Simulasi */}
          <button
            onClick={() => setShowSimulasi(true)}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-full bg-[#FFF8F6] border border-[#FF8A00] text-[#FF8A00] hover:bg-[#FFE9E4] transition-colors font-semibold font-[var(--font-be-vietnam)] text-sm"
          >
            <TrendingUp className="w-5 h-5" strokeWidth={1.75} />
            {t("recipes.detail.simulationButton")}
          </button>

          {/* REVISI: Catatan dipindah ke sini dengan wrapper card agar selaras dengan desain */}
          {resep.catatan && (
            <div className="bg-white rounded-[24px] border border-[#DDC1AE] p-6 shadow-[0_4px_20px_rgba(109,76,65,0.05)] mt-4">
              <p className="text-xs font-bold uppercase tracking-wider text-[#8A7362] font-[var(--font-be-vietnam)] mb-2">
                {t("recipes.detail.notesLabel")}
              </p>
              <p className="text-sm text-[#564334] leading-relaxed whitespace-pre-wrap">
                {resep.catatan}
              </p>
            </div>
          )}
        </div>
      </div>

      <ConfirmDeleteDialog
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        onConfirm={handleDelete}
        title={t("recipes.detail.deleteConfirmTitle", { name: resep.nama })}
        description={t("recipes.detail.deleteConfirmDesc")}
      />

      {/* Edit Form Modal */}
      <ResepForm
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        onSubmit={handleFormSubmit}
        initialData={resep}
      />

      {/* Simulasi Harga Modal */}
      {showSimulasi && (
        <SimulasiHarga
          isOpen={showSimulasi}
          onClose={() => setShowSimulasi(false)}
          resep={resep}
        />
      )}
    </div>
  );
}
