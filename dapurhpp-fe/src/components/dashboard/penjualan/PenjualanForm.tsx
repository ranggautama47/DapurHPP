"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { X, Calculator, ShoppingBag } from "lucide-react";
import { api } from "@/lib/axios";
import { toast } from "sonner";
import { formatLocalDate } from "@/lib/utils";
import { useTranslation } from "@/context/language-context";

interface ProduksiOption {
  id: number;
  resep: { nama: string };
  hppPerPcs: number;
  hasilNyata: number;
  status: string;
}

interface PenjualanFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function PenjualanForm({ isOpen, onClose, onSuccess }: PenjualanFormProps) {
  const { t, language } = useTranslation("master");
  const localeStr = language === "id" ? "id-ID" : "en-US";

  const schema = z.object({
    produksiId: z.number().min(1, t("sales.form.validation.selectProduction")),
    tanggal: z.string().min(1, t("sales.form.validation.dateRequired")),
    terjual: z.number().min(1, t("sales.form.validation.minSold")),
    hargaJual: z.number().min(0, t("sales.form.validation.priceNonNegative")),
  });

  type FormValues = z.infer<typeof schema>;

  const [produksiList, setProduksiList] = useState<ProduksiOption[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    control,
    watch,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
defaultValues: {
       produksiId: 0,
       tanggal: formatLocalDate(new Date()),
       terjual: 1,
       hargaJual: 0,
     },
  });

  const watchedValues = watch();
  const selectedProduksi = produksiList.find(p => p.id === watchedValues.produksiId);
  const hppPerPcs = selectedProduksi?.hppPerPcs ?? 0;

  const totalPendapatan = watchedValues.terjual * watchedValues.hargaJual;
  const totalHpp = watchedValues.terjual * hppPerPcs;
  const estimasiLaba = totalPendapatan - totalHpp;

  useEffect(() => {
    if (isOpen) {
      const fetchProduksi = async () => {
        try {
          const tanggal = formatLocalDate(new Date());
          const res = await api.get<ProduksiOption[]>(`/produksi?tanggal=${tanggal}`);
          const selesaiProduksi = res.data.filter(p => p.status === 'SELESAI');
          setProduksiList(selesaiProduksi);
        } catch (e) {
          console.error("Gagal memuat data produksi", e);
        }
      };
      fetchProduksi();
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
reset({
       produksiId: 0,
       tanggal: formatLocalDate(new Date()),
       terjual: 1,
       hargaJual: selectedProduksi?.resep?.nama ? watchedValues.hargaJual : 0,
     });
    }
  }, [isOpen, reset, selectedProduksi, watchedValues.hargaJual]);

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    setError(null);
    try {
      await api.post("/penjualan", data);
      toast.success(t("sales.successCreate"));
      onSuccess();
      onClose();
    } catch (err: any) {
      const msg = err.response?.data?.message ?? t("sales.errorCreate");
      setError(msg);
      toast.error(t("sales.errorCreate"));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-2xl max-h-[90vh] bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#F5E6D8]">
          <h2 className="font-[var(--font-playfair)] font-bold text-2xl text-[#2A1711]">{t("sales.form.title")}</h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[#F5E6D8] text-[#564334] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex-1 overflow-y-auto p-6">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-[#FEE2E2] border border-[#FCA5A5] text-[#EF4444] text-sm">
              {error}
            </div>
          )}

          <div className="mb-4">
            <label className="block text-xs font-medium text-[#564334] mb-1">{t("sales.form.productionLabel")}</label>
            <Controller
              name="produksiId"
              control={control}
              rules={{ required: true, min: 1 }}
              render={({ field }) => (
                <select
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                  className={`w-full px-4 py-2 rounded-lg border text-sm ${
                    errors.produksiId
                      ? "border-[#EF4444] focus:ring-2 focus:ring-[#EF4444]/20"
                      : "border-[#DDC1AE] focus:ring-2 focus:ring-[#FF8A00]/20"
                  } focus:outline-none focus:border-transparent`}
                >
                  <option value={0}>{t("sales.form.selectProduction")}</option>
                  {produksiList.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.resep.nama} — HPP: Rp {p.hppPerPcs.toLocaleString(localeStr)}/pcs ({t("sales.form.stockLabel")}: {p.hasilNyata})
                    </option>
                  ))}
                </select>
              )}
            />
            {errors.produksiId && (
              <p className="mt-1 text-xs text-[#EF4444]">{errors.produksiId.message}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-xs font-medium text-[#564334] mb-1">{t("common.labels.date")}</label>
            <Controller
              name="tanggal"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <input
                  type="date"
                  {...field}
                  className={`w-full px-4 py-2 rounded-lg border text-sm ${
                    errors.tanggal
                      ? "border-[#EF4444] focus:ring-2 focus:ring-[#EF4444]/20"
                      : "border-[#DDC1AE] focus:ring-2 focus:ring-[#FF8A00]/20"
                  } focus:outline-none focus:border-transparent`}
                />
              )}
            />
            {errors.tanggal && (
              <p className="mt-1 text-xs text-[#EF4444]">{errors.tanggal.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-medium text-[#564334] mb-1">{t("sales.form.soldLabel")}</label>
              <Controller
                name="terjual"
                control={control}
                rules={{ required: true, min: 1 }}
                render={({ field }) => (
                  <input
                    type="number"
                    step="1"
                    min="1"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    className={`w-full px-4 py-2 rounded-lg border text-sm ${
                      errors.terjual
                        ? "border-[#EF4444] focus:ring-2 focus:ring-[#EF4444]/20"
                        : "border-[#DDC1AE] focus:ring-2 focus:ring-[#FF8A00]/20"
                    } focus:outline-none focus:border-transparent`}
                  />
                )}
              />
              {errors.terjual && (
                <p className="mt-1 text-xs text-[#EF4444]">{errors.terjual.message}</p>
              )}
              {selectedProduksi && (
                <p className="mt-1 text-xs text-[#8A7362]">
                  {t("sales.form.stockAvailable", { stock: String(selectedProduksi.hasilNyata) })}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-[#564334] mb-1">{t("sales.form.priceLabel")}</label>
              <Controller
                name="hargaJual"
                control={control}
                rules={{ required: true, min: 0 }}
                render={({ field }) => (
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 font-[var(--font-roboto-mono)] text-[#8A7362]">Rp</span>
                    <input
                      type="number"
                      step="100"
                      min="0"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      className={`w-full pl-8 pr-4 py-2 rounded-lg border text-sm ${
                        errors.hargaJual
                          ? "border-[#EF4444] focus:ring-2 focus:ring-[#EF4444]/20"
                          : "border-[#DDC1AE] focus:ring-2 focus:ring-[#FF8A00]/20"
                      } focus:outline-none focus:border-transparent`}
                    />
                  </div>
                )}
              />
              {errors.hargaJual && (
                <p className="mt-1 text-xs text-[#EF4444]">{errors.hargaJual.message}</p>
              )}
            </div>
          </div>

          <div className="bg-[#FFF8F6] border border-[#DDC1AE] rounded-xl p-4 mb-6">
            <h3 className="font-[var(--font-playfair)] font-semibold text-[#2A1711] mb-3 flex items-center gap-2">
              <Calculator className="w-4 h-4 text-[#FF8A00]" />
              {t("sales.form.calculatorLabel")}
            </h3>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="bg-white rounded-lg p-3">
                <p className="text-xs text-[#8A7362] mb-1">{t("sales.form.totalRevenueLabel")}</p>
                <p className="font-[var(--font-roboto-mono)] font-bold text-lg text-[#2A1711]">
                  Rp {totalPendapatan.toLocaleString(localeStr)}
                </p>
              </div>
              <div className="bg-white rounded-lg p-3">
                <p className="text-xs text-[#8A7362] mb-1">{t("sales.form.totalCostLabel")}</p>
                <p className="font-[var(--font-roboto-mono)] font-bold text-lg text-[#564334]">
                  Rp {totalHpp.toLocaleString(localeStr)}
                </p>
              </div>
              <div className="bg-white rounded-lg p-3">
                <p className="text-xs text-[#8A7362] mb-1">{t("sales.form.estimatedProfitLabel")}</p>
                <p className={`font-[var(--font-roboto-mono)] font-bold text-lg ${
                  estimasiLaba >= 0 ? "text-[#06D6A0]" : "text-[#EF4444]"
                }`}>
                  Rp {Math.abs(estimasiLaba).toLocaleString(localeStr)}
                  {estimasiLaba < 0 && <span className="ml-1 text-xs">({t("sales.form.lossLabel")})</span>}
                </p>
              </div>
            </div>

            {selectedProduksi && (
              <div className="mt-3 pt-3 border-t border-[#DDC1AE] flex items-center justify-center gap-2 text-xs text-[#8A7362]">
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>{t("sales.form.hppFromProduction", { hpp: hppPerPcs.toLocaleString(localeStr) })}</span>
              </div>
            )}
          </div>

          <div className="flex gap-3 mt-6 pt-4 border-t border-[#F5E6D8]">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 rounded-full border-2 border-[#DDC1AE] text-[#564334] font-semibold hover:bg-[#FFF8F6]"
            >
              {t("common.buttons.cancel")}
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !selectedProduksi}
              className="flex-1 px-6 py-3 rounded-full bg-[#FF8A00] text-white font-semibold hover:bg-[#E67E00] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? t("sales.form.savingButton") : t("sales.form.submitButton")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
