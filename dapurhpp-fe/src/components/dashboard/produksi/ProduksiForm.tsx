"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { X, Calculator, ChefHat, Calendar } from "lucide-react";
import { api } from "@/lib/axios";
import { toast } from "sonner";
import { formatLocalDate } from "@/lib/utils";
import { useTranslation } from "@/context/language-context";

interface ResepOption {
  id: number;
  nama: string;
  fotoUrl: string | null;
  estimasiHasil: number;
  hppPerPcs: number;
}

interface ProduksiFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function ProduksiForm({ isOpen, onClose, onSuccess }: ProduksiFormProps) {
  const { t, language } = useTranslation("master");
  const localeStr = language === "id" ? "id-ID" : "en-US";

  const schema = z.object({
    resepId: z.number().min(1, t("production.form.validation.recipeRequired")),
    tanggal: z.string().min(1, t("production.form.validation.dateRequired")),
    hasilNyata: z.number().min(1, t("production.form.validation.minActualYield")),
  });

  type FormValues = z.infer<typeof schema>;

  const [resepList, setResepList] = useState<ResepOption[]>([]);
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
       resepId: 0,
       tanggal: formatLocalDate(new Date()),
       hasilNyata: 1,
     },
  });

  const watchedValues = watch();
  const selectedResep = resepList.find((r) => r.id === watchedValues.resepId);

  const hppPerPcs = selectedResep?.hppPerPcs ?? 0;
  const estimasiHasil = selectedResep?.estimasiHasil ?? 0;
  const totalModalEstimasi = hppPerPcs * estimasiHasil;
  const totalModalNyata = hppPerPcs * watchedValues.hasilNyata;

  useEffect(() => {
    if (isOpen) {
      const fetchResep = async () => {
        try {
          const res = await api.get<ResepOption[]>("/resep");
          setResepList(res.data);
        } catch (e) {
          console.error("Gagal memuat data resep", e);
        }
      };
      fetchResep();
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
reset({
       resepId: 0,
       tanggal: formatLocalDate(new Date()),
       hasilNyata: 1,
     });
      setError(null);
    }
  }, [isOpen, reset]);

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    setError(null);
    try {
      await api.post("/produksi", data);
      toast.success(t("production.successCreate"));
      onSuccess();
      onClose();
    } catch (err: any) {
      const msg = err.response?.data?.message ?? t("production.errorCreate");
      setError(msg);
      toast.error(t("production.errorCreate"));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-4xl max-h-[90vh] bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#F5E6D8]">
          <div>
            <h2 className="font-[var(--font-playfair)] font-bold text-2xl text-[#2A1711]">
              {t("production.addTitle")}
            </h2>
            <p className="text-sm text-[#564334] mt-1">
              {t("production.form.subtitle")}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[#F5E6D8] text-[#564334] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex-1 overflow-y-auto p-6"
        >
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-[#FEE2E2] border border-[#FCA5A5] text-[#EF4444] text-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

            <div className="lg:col-span-3 space-y-5">

              <h3 className="font-semibold text-[#2A1711] text-sm uppercase tracking-wide">
                {t("production.form.infoSection")}
              </h3>

              <div>
                <label className="block text-sm font-medium text-[#564334] mb-2">
                  {t("production.form.recipeLabel")} <span className="text-[#EF4444]">{t("production.form.requiredAsterisk")}</span>
                </label>
                <Controller
                  name="resepId"
                  control={control}
                  rules={{ required: true, min: 1 }}
                  render={({ field }) => (
                    <div className="relative">
                      <select
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        className={`w-full px-4 py-3 rounded-[16px] border-2 text-sm appearance-none bg-white ${
                          errors.resepId
                            ? "border-[#EF4444] focus:ring-2 focus:ring-[#EF4444]/20"
                            : "border-[#DDC1AE] focus:border-[#FF8A00] focus:ring-2 focus:ring-[#FF8A00]/20"
                        } focus:outline-none transition-colors`}
                      >
                        <option value={0}>{t("production.form.recipePlaceholder")}</option>
                        {resepList.map((r) => (
                          <option key={r.id} value={r.id}>
                            {r.nama}
                          </option>
                        ))}
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                        <svg className="w-4 h-4 text-[#8A7362]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  )}
                />
                {errors.resepId && (
                  <p className="mt-1 text-xs text-[#EF4444]">
                    {errors.resepId.message}
                  </p>
                )}
              </div>

              {selectedResep && (
                <div className="bg-[#FFF8F6] border border-[#DDC1AE] rounded-[16px] p-4 flex items-center gap-4">
                  {selectedResep.fotoUrl ? (
                    <img
                      src={selectedResep.fotoUrl}
                      alt={selectedResep.nama}
                      className="w-20 h-20 rounded-xl object-cover"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-[#F5E6D8] rounded-xl flex items-center justify-center">
                      <ChefHat className="w-8 h-8 text-[#DDC1AE]" />
                    </div>
                  )}
                  <div className="space-y-1">
                    <p className="font-semibold text-[#2A1711]">
                      {selectedResep.nama}
                    </p>
                    <p className="text-sm text-[#8A7362]">
                      {t("production.form.estimatedYieldLabel")}: <span className="font-semibold text-[#2A1711]">{selectedResep.estimasiHasil}</span>
                    </p>
                    <p className="text-sm text-[#8A7362]">
                      {t("production.form.hppPerPcsLabel")}: <span className="font-semibold text-[#FF8A00]">Rp {selectedResep.hppPerPcs.toLocaleString(localeStr)}</span>
                    </p>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-[#564334] mb-2">
                  {t("production.form.dateLabel")} <span className="text-[#EF4444]">{t("production.form.requiredAsterisk")}</span>
                </label>
                <Controller
                  name="tanggal"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <div className="relative">
                      <input
                        type="date"
                        {...field}
                        className={`w-full px-4 py-3 rounded-[16px] border-2 text-sm bg-white ${
                          errors.tanggal
                            ? "border-[#EF4444] focus:ring-2 focus:ring-[#EF4444]/20"
                            : "border-[#DDC1AE] focus:border-[#FF8A00] focus:ring-2 focus:ring-[#FF8A00]/20"
                        } focus:outline-none transition-colors`}
                      />
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                        <Calendar className="w-4 h-4 text-[#8A7362]" />
                      </div>
                    </div>
                  )}
                />
                {errors.tanggal && (
                  <p className="mt-1 text-xs text-[#EF4444]">
                    {errors.tanggal.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-[#564334] mb-2">
                  {t("production.form.actualYieldLabel")} <span className="text-[#EF4444]">{t("production.form.requiredAsterisk")}</span>
                </label>
                <Controller
                  name="hasilNyata"
                  control={control}
                  rules={{ required: true, min: 1 }}
                  render={({ field }) => (
                    <div className="relative">
                      <input
                        type="number"
                        step="1"
                        min="1"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        className={`w-full px-4 py-3 pr-12 rounded-[16px] border-2 text-sm bg-white ${
                          errors.hasilNyata
                            ? "border-[#EF4444] focus:ring-2 focus:ring-[#EF4444]/20"
                            : "border-[#DDC1AE] focus:border-[#FF8A00] focus:ring-2 focus:ring-[#FF8A00]/20"
                        } focus:outline-none transition-colors`}
                        placeholder={t("production.form.actualYieldPlaceholder")}
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-[#8A7362] font-medium">
                        pcs
                      </span>
                    </div>
                  )}
                />
                {errors.hasilNyata && (
                  <p className="mt-1 text-xs text-[#EF4444]">
                    {errors.hasilNyata.message}
                  </p>
                )}
              </div>

              <div className="bg-[#FFF8F6] border border-[#DDC1AE] rounded-[16px] p-4">
                <h4 className="font-semibold text-[#2A1711] text-sm mb-1 flex items-center gap-2">
                  <Calculator className="w-4 h-4 text-[#FF8A00]" />
                  {t("production.form.previewSection")}
                </h4>
                <p className="text-xs text-[#8A7362] mb-3">
                  {t("production.form.previewNote")}
                </p>

                {selectedResep ? (
                  <div className="space-y-2">
                    <div className="flex justify-between items-center py-2 border-b border-[#F5E6D8]">
                      <span className="text-sm text-[#8A7362]">{t("production.form.hppPerPcsLabel")}</span>
                      <span className="font-[var(--font-roboto-mono)] font-semibold text-[#2A1711]">
                        Rp {hppPerPcs.toLocaleString(localeStr)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-[#F5E6D8]">
                      <span className="text-sm text-[#8A7362]">{t("production.form.estimatedYieldLabel")}</span>
                      <span className="font-[var(--font-roboto-mono)] font-semibold text-[#2A1711]">
                        {estimasiHasil} pcs
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-[#F5E6D8]">
                      <span className="text-sm text-[#8A7362]">{t("production.form.totalEstimatedCostLabel")}</span>
                      <span className="font-[var(--font-roboto-mono)] font-semibold text-[#564334]">
                        Rp {totalModalEstimasi.toLocaleString(localeStr)}
                      </span>
                    </div>
                    {watchedValues.hasilNyata > 0 && (
                      <>
                        <div className="flex justify-between items-center py-2 border-b border-[#F5E6D8]">
                          <span className="text-sm text-[#8A7362]">{t("production.form.inputActualYieldLabel")}</span>
                          <span className="font-[var(--font-roboto-mono)] font-semibold text-[#2A1711]">
                            {watchedValues.hasilNyata} pcs
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-2">
                          <span className="text-sm font-medium text-[#564334]">{t("production.form.totalCostSnapshotLabel")}</span>
                          <span className="font-[var(--font-roboto-mono)] font-bold text-[#FF8A00]">
                            Rp {totalModalNyata.toLocaleString(localeStr)}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-6 text-center">
                    <ChefHat className="w-10 h-10 text-[#DDC1AE] mb-2" />
                    <p className="text-xs text-[#8A7362]">
                      {t("production.form.selectRecipeForPreview")}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="bg-white border border-[#DDC1AE] rounded-[24px] p-5 shadow-[0_8px_30px_rgba(109,76,65,0.08)] sticky top-4">
                <h3 className="font-[var(--font-playfair)] font-bold text-lg text-[#2A1711] mb-4">
                  {t("production.form.summaryTitle")}
                </h3>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-[#8A7362]">{t("production.form.recipeLabel")}</span>
                    <span className="text-sm font-semibold text-[#2A1711]">
                      {selectedResep?.nama ?? "-"}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-[#8A7362]">{t("production.form.estimatedYieldLabel")}</span>
                    <span className="text-sm font-semibold text-[#2A1711]">
                      {estimasiHasil > 0 ? `${estimasiHasil}` : "-"}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-[#8A7362]">{t("production.form.hppPerPcsLabel")}</span>
                    <span className="text-sm font-semibold text-[#2A1711]">
                      {hppPerPcs > 0 ? `Rp ${hppPerPcs.toLocaleString(localeStr)}` : "-"}
                    </span>
                  </div>

                  <div className="border-t border-[#F5E6D8] my-3" />

                  <div>
                    <p className="text-sm text-[#8A7362] mb-1">{t("production.form.totalCostSnapshotLabel")}</p>
                    <p className="font-[var(--font-roboto-mono)] font-bold text-2xl text-[#FF8A00]">
                      {totalModalNyata > 0
                        ? `Rp ${totalModalNyata.toLocaleString(localeStr)}`
                        : "Rp 0"}
                    </p>
                  </div>

                  <div className="border-t border-[#F5E6D8] my-3" />

                  <div className="bg-[#FFF8F6] rounded-xl p-3">
                    <p className="text-xs text-[#8A7362] leading-relaxed">
                      {t("production.detail.snapshotInfoDesc")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3 mt-8 pt-4 border-t border-[#F5E6D8]">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 rounded-full border-2 border-[#DDC1AE] text-[#564334] font-semibold hover:bg-[#FFF8F6] transition-colors"
            >
              {t("production.form.cancelButton")}
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !selectedResep}
              className="flex-1 px-6 py-3 rounded-full bg-[#FF8A00] text-white font-semibold hover:bg-[#E67E00] disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-[0_10px_30px_rgba(255,138,0,0.25)]"
            >
              {isSubmitting ? t("production.form.savingButton") : t("production.form.saveButton")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
