"use client";

import { useEffect, useState, useCallback } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslation } from "@/context/language-context";
import {
  Plus,
  Trash2,
  X,
  Loader2,
  ChefHat,
  Camera,
  Upload,
} from "lucide-react";
import { BahanBaku } from "@/types/bahan-baku";
import { Satuan, CreateResepDto, UpdateResepDto, Resep } from "@/types/resep";
import { api } from "@/lib/axios";
import { toast } from "sonner";

interface ResepFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateResepDto | UpdateResepDto) => Promise<any>;
  initialData?: Resep | null;
  isLoading?: boolean;
}

export function ResepForm({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isLoading,
}: ResepFormProps) {
  const isEdit = !!initialData;
  const { t, language } = useTranslation("master");

  const detailSchema = z.object({
    bahanBakuId: z.number().min(1, t("recipes.form.selectIngredient")),
    jumlah: z.number().min(0.001, t("recipes.form.quantityMin")),
    satuan: z.string(),
  });

  const formSchema = z.object({
    nama: z.string().min(2, t("recipes.form.nameMin")),
    estimasiHasil: z.number().min(1, t("recipes.form.yieldMin")),
    hargaJual: z.any().optional(),
    catatan: z.string().max(1000, t("recipes.form.notesMax")).optional(),
    detailResep: z.array(detailSchema).min(1, t("recipes.form.minIngredients")),
  });

  type FormData = z.infer<typeof formSchema>;

  const [bahanList, setBahanList] = useState<BahanBaku[]>([]);
  const [bahanLoading, setBahanLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setBahanLoading(true);
    api
      .get<BahanBaku[]>("/bahan-baku")
      .then((res) => setBahanList(res.data))
      .catch((err) => console.error("Gagal fetch bahan:", err))
      .finally(() => setBahanLoading(false));
  }, [isOpen]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    watch,
    setValue,
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nama: "",
      estimasiHasil: 1,
      catatan: "",
      detailResep: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "detailResep",
  });

  useEffect(() => {
    if (isOpen) {
      setSelectedFile(null);
      if (initialData) {
        reset({
          nama: initialData.nama,
          estimasiHasil: initialData.estimasiHasil,
          hargaJual: Number(initialData.hargaJual) || undefined,
          catatan: initialData.catatan ?? "",
          detailResep: (initialData.detailResep ?? []).map((d) => ({
            bahanBakuId: d.bahanBakuId,
            jumlah: Number(d.jumlah),
            satuan: d.satuan,
          })),
        });
      } else {
        reset({ nama: "", estimasiHasil: 1, catatan: "", detailResep: [] });
      }
    }
  }, [isOpen, initialData, reset]);

  const handleAddBahan = useCallback(() => {
    append({ bahanBakuId: 0, jumlah: 0, satuan: "" });
  }, [append]);

  const watchedDetails = watch("detailResep");
  const estimasiHasil = watch("estimasiHasil");

  const totalModal = (watchedDetails ?? []).reduce((sum, d) => {
    const bahan = bahanList.find((b) => b.id === d?.bahanBakuId);
    return sum + (Number(d?.jumlah) || 0) * Number(bahan?.hargaTerakhir || 0);
  }, 0);

  const hppPerPcs =
    estimasiHasil > 0 ? totalModal / Number(estimasiHasil) : 0;

  const handleBahanChange = (index: number, bahanId: number) => {
    const bahan = bahanList.find((b) => b.id === bahanId);
    if (bahan) {
      setValue(`detailResep.${index}.satuan`, bahan.satuan);
    }
  };

  const handleFormSubmit = async (data: FormData) => {
    const safe = {
      nama: data.nama,
      estimasiHasil: data.estimasiHasil,
      hargaJual: isNaN(data.hargaJual as number) ? undefined : data.hargaJual,
      catatan: data.catatan || null,
      detailResep: (data.detailResep ?? []).map((d) => ({
        bahanBakuId: d.bahanBakuId,
        jumlah: d.jumlah,
        satuan: d.satuan as Satuan,
      })),
    };
    const result = await onSubmit(safe);

    if (selectedFile) {
      const resepId = initialData?.id || result?.id;
      if (resepId) {
        setUploading(true);
        try {
          const fd = new FormData();
          fd.append("file", selectedFile);
          await api.post(`/resep/${resepId}/upload-foto`, fd);
          toast.success(t("recipes.form.uploadSuccess"));
        } catch (err) {
          console.error("Gagal upload foto:", err);
          toast.error(t("recipes.form.uploadError"));
        } finally {
          setUploading(false);
        }
      }
    }
  };

  if (!isOpen) return null;

  const locale = language === "id" ? "id-ID" : "en-US";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2A1711]/60 backdrop-blur-sm">
      <div className="relative w-full max-w-6xl bg-white rounded-[2.5rem] shadow-[0_24px_64px_-12px_rgba(42,23,17,0.4)] overflow-hidden flex flex-col max-h-[95vh] animate-in fade-in slide-in-from-bottom-8 duration-500">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#FF8A00] via-[#BF360C] to-[#FF8A00] z-10" />

        <div className="flex-1 overflow-y-auto p-5 md:p-6">
          <div className="flex items-center justify-between mb-6 sticky top-0 bg-white/95 backdrop-blur-xs z-10 py-1">
            <h2 className="font-[var(--font-playfair)] font-bold text-2xl text-[#2A1711]">
              {isEdit ? t("recipes.editTitle") : t("recipes.addTitle")}
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-[#FFF8F6] text-[#564334] transition-colors"
              aria-label={t("common.close")}
            >
              <X className="w-5 h-5" strokeWidth={1.75} />
            </button>
          </div>

          <form onSubmit={handleSubmit(handleFormSubmit)} noValidate>
            <div className="grid lg:grid-cols-5 gap-6">
              <div className="lg:col-span-2 space-y-5">
                <div className="bg-white rounded-[24px] border border-[#DDC1AE] p-5 shadow-[0_8px_30px_rgba(109,76,65,0.08)]">
                  <h3 className="font-[var(--font-playfair)] font-bold text-lg text-[#2A1711] mb-4">
                    {t("recipes.form.infoSection")}
                  </h3>
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold uppercase tracking-[0.1em] text-[#5D4037] ml-2">
                        {t("recipes.form.nameLabel")}
                      </label>
                      <input
                        type="text"
                        {...register("nama")}
                        className={`w-full pl-4 pr-4 py-3 bg-white border-2 rounded-full text-sm text-[#2A1711] placeholder-[#BCAAA4] focus:outline-none focus:border-[#BF360C] focus:ring-4 focus:ring-[#BF360C]/10 ${errors.nama ? "border-[#BA1A1A]" : "border-[#D9C4B1]"}`}
                        placeholder={t("recipes.form.namePlaceholder")}
                      />
                      {errors.nama && (
                        <p className="mt-1 flex items-center gap-1 text-xs text-[#BA1A1A] ml-2">
                          <X className="w-3 h-3" /> {errors.nama.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold uppercase tracking-[0.1em] text-[#5D4037] ml-2">
                        {t("recipes.form.yieldLabel")}
                      </label>
                      <input
                        type="number"
                        {...register("estimasiHasil", { valueAsNumber: true })}
                        className={`w-full pl-4 pr-4 py-3 bg-white border-2 rounded-full text-sm text-[#2A1711] placeholder-[#BCAAA4] focus:outline-none focus:border-[#BF360C] focus:ring-4 focus:ring-[#BF360C]/10 ${errors.estimasiHasil ? "border-[#BA1A1A]" : "border-[#D9C4B1]"}`}
                        placeholder={t("recipes.form.yieldPlaceholder")}
                        min="1"
                      />
                      {errors.estimasiHasil && (
                        <p className="mt-1 flex items-center gap-1 text-xs text-[#BA1A1A] ml-2">
                          <X className="w-3 h-3" />{" "}
                          {errors.estimasiHasil.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold uppercase tracking-[0.1em] text-[#5D4037] ml-2">
                        {t("recipes.form.sellingPriceLabel")}
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          {...register("hargaJual", { valueAsNumber: true })}
                          className="w-full pl-8 pr-4 py-3 bg-white border-2 border-[#D9C4B1] rounded-full text-sm text-[#2A1711] placeholder-[#BCAAA4] focus:outline-none focus:border-[#BF360C] focus:ring-4 focus:ring-[#BF360C]/10"
                          placeholder={t("recipes.form.sellingPricePlaceholder")}
                          min="0"
                          step="100"
                        />
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <span className="font-[var(--font-roboto-mono)] text-sm text-[#8D6E63]">
                            Rp
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold uppercase tracking-[0.1em] text-[#5D4037] ml-2">
                        {t("recipes.form.notesLabel")}
                      </label>
                      <textarea
                        {...register("catatan")}
                        rows={3}
                        className={`w-full px-4 py-3 bg-white border-2 rounded-2xl text-sm text-[#2A1711] placeholder-[#BCAAA4] focus:outline-none focus:border-[#BF360C] focus:ring-4 focus:ring-[#BF360C]/10 resize-none ${errors.catatan ? "border-[#BA1A1A]" : "border-[#D9C4B1]"}`}
                        placeholder={t("recipes.form.notesPlaceholder")}
                      />
                    </div>
                  </div>
                </div>

                {/* Foto Resep */}
                <div className="bg-white rounded-[24px] border border-[#DDC1AE] p-5 shadow-[0_8px_30px_rgba(109,76,65,0.08)]">
                  <h3 className="font-[var(--font-playfair)] font-bold text-lg text-[#2A1711] mb-4">
                    {t("recipes.form.photoSection")}
                  </h3>
                  <label className="group relative block w-full aspect-[4/3] rounded-2xl border-2 border-dashed border-[#D9C4B1] bg-[#FFF8F6] overflow-hidden cursor-pointer hover:border-[#FF8A00] hover:bg-[#FFF0E8] transition-all">
                    <input
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) setSelectedFile(file);
                      }}
                    />
                    {selectedFile ? (
                      <img
                        src={URL.createObjectURL(selectedFile)}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : initialData?.fotoUrl ? (
                      <img
                        src={initialData.fotoUrl}
                        alt={initialData.nama}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center w-full h-full gap-2 text-[#8A7362]">
                        <Camera
                          className="w-10 h-10 group-hover:text-[#FF8A00] transition-colors"
                          strokeWidth={1.5}
                        />
                        <p className="text-sm font-[var(--font-be-vietnam)] font-medium group-hover:text-[#FF8A00] transition-colors">
                          {t("recipes.form.uploadPhoto")}
                        </p>
                        <p className="text-xs text-[#BCAAA4]">
                          {t("recipes.form.photoFormat")}
                        </p>
                      </div>
                    )}
                    {selectedFile && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedFile(null);
                        }}
                        className="absolute top-2 right-2 p-1.5 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                      >
                        <X className="w-4 h-4" strokeWidth={2} />
                      </button>
                    )}
                  </label>
                </div>
              </div>

              <div className="lg:col-span-3 space-y-4">
                <div className="bg-white rounded-[24px] border border-[#DDC1AE] p-5 shadow-[0_8px_30px_rgba(109,76,65,0.08)]">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-[var(--font-playfair)] font-bold text-lg text-[#2A1711]">
                      {t("recipes.form.ingredientsSection")}
                    </h3>
                    <button
                      type="button"
                      onClick={handleAddBahan}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#FF8A00] text-white text-xs font-semibold hover:bg-[#E67E00] transition-colors"
                    >
                      <Plus className="w-4 h-4" strokeWidth={2.5} /> {t("recipes.form.addIngredientButton")}
                    </button>
                  </div>

                  {bahanLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="w-6 h-6 text-[#FF8A00] animate-spin" />
                    </div>
                  ) : fields.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <ChefHat
                        className="w-10 h-10 text-[#DDC1AE] mb-2"
                        strokeWidth={1.5}
                      />
                      <p className="text-sm text-[#564334] mb-1">
                        {t("recipes.form.noIngredients")}
                      </p>
                      <p className="text-xs text-[#8A7362]">
                        {t("recipes.form.addIngredientHint")}
                      </p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-[#FFF8F6] border-b border-[#DDC1AE]">
                            <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-[0.1em] text-[#564334] w-8">
                              {t("recipes.form.tableNo")}
                            </th>
                            <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-[0.1em] text-[#564334] min-w-[190px]">
                              {t("recipes.form.tableIngredient")}
                            </th>
                            <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-[0.1em] text-[#564334] w-28">
                              {t("recipes.form.tableQty")}
                            </th>
                            <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-[0.1em] text-[#564334] w-28">
                              {t("recipes.form.tablePrice")}
                            </th>
                            <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-[0.1em] text-[#564334] w-32">
                              {t("recipes.form.tableTotal")}
                            </th>
                            <th className="px-3 py-3 w-8" />
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#F5E6D8]">
                          {fields.map((field, index) => {
                            const selectedBahan = bahanList.find(
                              (b) =>
                                b.id === watchedDetails?.[index]?.bahanBakuId,
                            );
                            const qty =
                              Number(watchedDetails?.[index]?.jumlah) || 0;
                            const hargaSat =
                              Number(selectedBahan?.hargaTerakhir) || 0;
                            const total = qty * hargaSat;

                            return (
                              <tr
                                key={field.id}
                                className="hover:bg-[#FFF8F6] transition-colors"
                              >
                                <td className="px-3 py-3 text-[#8A7362] font-[var(--font-roboto-mono)] text-xs">
                                  {index + 1}
                                </td>
                                <td className="px-3 py-3">
                                  <div className="flex items-center gap-2.5 min-w-[190px]">
                                    {selectedBahan?.fotoUrl ? (
                                      <img
                                        src={selectedBahan.fotoUrl}
                                        alt={selectedBahan.nama}
                                        className="w-9 h-9 rounded-lg object-cover shrink-0"
                                      />
                                    ) : (
                                      <div className="w-9 h-9 rounded-lg bg-[#F5E6D8] flex items-center justify-center shrink-0">
                                        <ChefHat
                                          className="w-4 h-4 text-[#DDC1AE]"
                                          strokeWidth={1.5}
                                        />
                                      </div>
                                    )}
                                    <select
                                      value={
                                        watchedDetails?.[index]?.bahanBakuId ||
                                        ""
                                      }
                                      onChange={(e) => {
                                        const val = parseInt(e.target.value);
                                        handleBahanChange(index, val);
                                        setValue(
                                          `detailResep.${index}.bahanBakuId`,
                                          val,
                                          { shouldValidate: true },
                                        );
                                      }}
                                      className="w-full min-w-[140px] px-3 py-2 bg-white border border-[#D9C4B1] rounded-xl text-sm text-[#2A1711] focus:outline-none focus:border-[#BF360C] appearance-none"
                                      aria-label={t("recipes.form.selectIngredient")}
                                    >
                                      <option value="">{t("recipes.form.selectIngredient")}</option>
                                      {bahanList.map((b) => (
                                        <option key={b.id} value={b.id}>
                                          {b.nama}
                                        </option>
                                      ))}
                                    </select>
                                  </div>
                                </td>
                                <td className="px-3 py-3">
                                  <div className="flex flex-col items-center gap-1">
                                    <input
                                      type="number"
                                      {...register(
                                        `detailResep.${index}.jumlah`,
                                        { valueAsNumber: true },
                                      )}
                                      className="w-full px-3 py-2 bg-white border border-[#D9C4B1] rounded-lg text-center text-sm font-[var(--font-roboto-mono)] font-semibold text-[#2A1711] focus:outline-none focus:border-[#BF360C]"
                                      placeholder="0"
                                      min="0"
                                      step="0.1"
                                    />
                                    <span className="text-[10px] uppercase tracking-wide text-[#8A7362]">
                                      {selectedBahan?.satuan || "-"}
                                    </span>
                                  </div>
                                </td>
                                <td className="px-3 py-3">
                                  {hargaSat > 0 ? (
                                    <span className="font-[var(--font-roboto-mono)] text-sm text-[#564334]">
                                      Rp {hargaSat.toLocaleString(locale)} /{" "}
                                      {selectedBahan?.satuan || "unit"}
                                    </span>
                                  ) : (
                                    <span className="text-xs text-[#BA1A1A]">
                                      {t("recipes.form.fillPriceFirst")}
                                    </span>
                                  )}
                                </td>
                                <td className="px-3 py-3">
                                  <span className="font-[var(--font-roboto-mono)] font-bold text-sm text-[#2A1711]">
                                    Rp {total.toLocaleString(locale)}
                                  </span>
                                </td>
                                <td className="px-3 py-3">
                                  <button
                                    type="button"
                                    onClick={() => remove(index)}
                                    className="p-1.5 rounded-full hover:bg-[#FEE2E2] text-[#EF4444] transition-colors"
                                    aria-label={t("recipes.form.tableActions")}
                                  >
                                    <Trash2
                                      className="w-4 h-4"
                                      strokeWidth={1.75}
                                    />
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {errors.detailResep && (
                    <p className="mt-2 flex items-center gap-1 text-xs text-[#BA1A1A] ml-2">
                      <X className="w-3 h-3" /> {errors.detailResep.message}
                    </p>
                  )}
                </div>

                <div className="bg-[#FFF8F6] rounded-[24px] border border-[#DDC1AE] p-6 shadow-[0_8px_30px_rgba(109,76,65,0.08)]">
                  <div className="grid grid-cols-3 gap-6">
                    <div className="p-4">
                      <p className="text-sm text-[#8A7362] font-[var(--font-be-vietnam)] mb-2">
                        {t("recipes.form.totalCostLabel")}
                      </p>
                      <p className="font-[var(--font-roboto-mono)] font-bold text-2xl text-[#2A1711]">
                        Rp {totalModal.toLocaleString(locale)}
                      </p>
                      <p className="text-[11px] text-[#8A7362] mt-1">
                        {t("recipes.form.costExplanation")}
                      </p>
                    </div>
                    <div className="p-4">
                      <p className="text-sm text-[#8A7362] font-[var(--font-be-vietnam)] mb-2">
                        {t("recipes.form.yieldLabelSummary")}
                      </p>
                      <p className="font-[var(--font-roboto-mono)] font-bold text-2xl text-[#2A1711]">
                        {Number(estimasiHasil) || 0} pcs
                      </p>
                    </div>
                    <div className="bg-white rounded-xl p-5 border border-[#FF8A00]/20 shadow-sm">
                      <p className="text-sm text-[#FF8A00] font-[var(--font-be-vietnam)] font-semibold mb-2">
                        {t("recipes.form.hppLabel")}
                      </p>
                      <p className="font-[var(--font-roboto-mono)] font-bold text-2xl text-[#FF8A00]">
                        Rp {Math.round(hppPerPcs).toLocaleString(locale)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-[#F5E6D8]">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 rounded-full border-2 border-[#EF4444]/30 text-[#EF4444] font-[var(--font-be-vietnam)] font-semibold text-sm hover:bg-[#FEE2E2] hover:border-[#EF4444] transition-colors"
              >
                {t("common.cancel")}
              </button>
              <button
                type="submit"
                disabled={isLoading || uploading}
                className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-[#FF8A00] text-white font-[var(--font-be-vietnam)] font-semibold text-sm hover:bg-[#E67E00] hover:shadow-[0_4px_12px_rgba(255,138,0,0.3)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading || uploading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : null}
                {uploading
                  ? t("recipes.form.uploading")
                  : isEdit
                    ? t("recipes.form.saveChangesButton")
                    : t("recipes.form.saveButton")}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
