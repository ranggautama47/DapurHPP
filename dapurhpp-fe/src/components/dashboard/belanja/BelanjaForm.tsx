"use client";

import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X, Plus, Trash2, Calendar, ChefHat } from "lucide-react";
import { api } from "@/lib/axios";
import { BahanBaku } from "@/types/bahan-baku";
import { Supplier } from "@/types/supplier";
import { Satuan } from "@/types/bahan-baku";
import { formatLocalDate } from "@/lib/utils";
import { toast } from "sonner";
import { useTranslation } from "@/context/language-context";

const getImageUrl = (path?: string | null) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  const baseUrl = "http://localhost:3001";
  return `${baseUrl}${path.startsWith('/') ? path : `/${path}`}`;
};

interface BelanjaFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function BelanjaForm({ isOpen, onClose, onSuccess }: BelanjaFormProps) {
  const { t, language } = useTranslation("master");
  const localeStr = language === "id" ? "id-ID" : "en-US";

  const detailSchema = z.object({
    bahanBakuId: z.number().min(1, t("purchases.form.selectIngredient")),
    supplierId: z.number().optional(),
    jumlah: z.number().min(0.001, t("purchases.form.quantityMin")),
    satuan: z.string(),
    totalHarga: z.number().min(0, t("purchases.form.priceNonNegative")),
  });

  const formSchema = z.object({
    tanggal: z.string().min(1, t("purchases.form.dateRequired")),
    catatan: z.string().optional(),
    detailBelanja: z.array(detailSchema).min(1, t("purchases.form.minItems")),
  });

  type FormData = z.infer<typeof formSchema>;

  const [bahanList, setBahanList] = useState<BahanBaku[]>([]);
  const [supplierList, setSupplierList] = useState<Supplier[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register, control, handleSubmit, watch, setValue, formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { tanggal: formatLocalDate(new Date()), detailBelanja: [] },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "detailBelanja" });

  useEffect(() => {
    api.get("/bahan-baku").then((res) => setBahanList(res.data));
    api.get("/supplier").then((res) => setSupplierList(res.data));
  }, []);

  const watchedDetails = watch("detailBelanja");
  const totalBelanja = watchedDetails?.reduce((sum, d) => sum + (d.totalHarga || 0), 0) || 0;

  const handleBahanChange = (index: number, bahanId: number) => {
    const bahan = bahanList.find((b) => b.id === bahanId);
    if (bahan) {
      setValue(`detailBelanja.${index}.bahanBakuId`, bahanId);
      setValue(`detailBelanja.${index}.satuan`, bahan.satuan);
      const jumlahSekarang = watch(`detailBelanja.${index}.jumlah`) || 1;
      setValue(`detailBelanja.${index}.totalHarga`, Math.round(bahan.hargaTerakhir * jumlahSekarang));
    }
  };

  const handleJumlahChange = (index: number, jumlah: number) => {
    const detail = watch(`detailBelanja.${index}`);
    if (detail?.bahanBakuId) {
      const bahan = bahanList.find((b) => b.id === detail.bahanBakuId);
      if (bahan) {
        setValue(`detailBelanja.${index}.totalHarga`, Math.round(bahan.hargaTerakhir * jumlah));
      }
    }
  };

  const addItem = () => {
    append({ bahanBakuId: 0, supplierId: undefined, jumlah: 1, satuan: "gram" as Satuan, totalHarga: 0 });
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      await api.post("/belanja", {
        tanggal: data.tanggal, catatan: data.catatan,
        detailBelanja: data.detailBelanja.map((d) => ({
          bahanBakuId: Number(d.bahanBakuId), supplierId: d.supplierId ? Number(d.supplierId) : undefined,
          jumlah: d.jumlah, satuan: d.satuan, hargaSatuan: d.jumlah > 0 ? Math.round(d.totalHarga / d.jumlah) : 0,
        })),
      });
      toast.success(t("purchases.successCreate"));
      onSuccess(); onClose();
    } catch (err: any) {
      alert(err.response?.data?.message || t("purchases.errorCreate"));
      toast.error(t("purchases.errorCreate"));
    } finally { setIsSubmitting(false); }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2A1711]/60 backdrop-blur-sm">
      <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-[2rem] shadow-[0_24px_64px_-12px_rgba(42,23,17,0.4)]">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-[var(--font-playfair)] font-bold text-2xl text-[#2A1711]">
              {t("purchases.addTitle")}
            </h2>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-[#FFF8F6]">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-[0.1em] text-[#5D4037] mb-2">
                {t("purchases.form.dateLabel")}
              </label>
              <div className="relative max-w-xs">
                <input type="date" {...register("tanggal")} className="w-full pl-10 pr-4 py-3 bg-white border-2 border-[#D9C4B1] rounded-full text-[#2A1711]" />
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8D6E63]" />
              </div>
              {errors.tanggal && <p className="mt-1 text-xs text-[#BA1A1A] ml-2">{errors.tanggal.message}</p>}
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-[#2A1711]">{t("purchases.form.itemsSection")}</h3>
                <button type="button" onClick={addItem} className="flex items-center gap-1 px-4 py-2 rounded-full border border-[#FF8A00] text-[#FF8A00] text-sm font-medium hover:bg-[#FFF8F6]">
                  <Plus className="w-4 h-4" /> {t("purchases.addItem")}
                </button>
              </div>

              <div className="overflow-x-auto rounded-[16px] border border-[#DDC1AE]">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-[#FFF8F6] border-b border-[#DDC1AE]">
                      <th className="px-3 py-3 text-left text-xs font-semibold text-[#564334]">{t("purchases.form.tableNo")}</th>
                      <th className="px-3 py-3 text-left text-xs font-semibold text-[#564334]">{t("purchases.form.tableImage")}</th>
                      <th className="px-3 py-3 text-left text-xs font-semibold text-[#564334]">{t("purchases.form.tableIngredient")}</th>
                      <th className="px-3 py-3 text-left text-xs font-semibold text-[#564334]">{t("purchases.form.tableSupplier")}</th>
                      <th className="px-3 py-3 text-left text-xs font-semibold text-[#564334]">{t("purchases.form.tableQty")}</th>
                      <th className="px-3 py-3 text-left text-xs font-semibold text-[#564334]">{t("purchases.form.tableTotalPrice")}</th>
                      <th className="px-3 py-3 text-left text-xs font-semibold text-[#564334]">{t("purchases.form.tableActions")}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F5E6D8]">
                    {fields.map((field, index) => {
                      const detail = watchedDetails?.[index];
                      const selectedBahan = bahanList.find((b) => b.id === detail?.bahanBakuId);
                      const hargaPerGram = detail?.jumlah && detail?.jumlah > 0 ? Math.round((detail?.totalHarga || 0) / detail.jumlah) : 0;

                      return (
                        <tr key={field.id}>
                          <td className="px-3 py-3 text-[#564334]">{index + 1}</td>
                          <td className="px-3 py-3">
                            {selectedBahan?.fotoUrl ? (
                              <img src={getImageUrl(selectedBahan.fotoUrl)} alt={selectedBahan.nama} className="w-9 h-9 rounded-lg object-cover bg-white" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden'); }} />
                            ) : null}
                            <div className={`w-9 h-9 rounded-lg bg-[#F5E6D8] flex items-center justify-center ${selectedBahan?.fotoUrl ? 'hidden' : ''}`}>
                              <ChefHat className="w-4 h-4 text-[#DDC1AE]" strokeWidth={1.5} />
                            </div>
                          </td>
                          <td className="px-3 py-3">
                            <select {...register(`detailBelanja.${index}.bahanBakuId`, { valueAsNumber: true })} onChange={(e) => handleBahanChange(index, Number(e.target.value))} className="w-40 px-3 py-2 rounded-lg border border-[#DDC1AE] text-sm">
                              <option value={0}>{t("purchases.form.selectIngredient")}</option>
                              {bahanList.map((b) => (
                                <option key={b.id} value={b.id}>{b.nama} ({Number(b.stok).toLocaleString(localeStr)} {b.satuan})</option>
                              ))}
                            </select>
                          </td>
                          <td className="px-3 py-3">
                            <select {...register(`detailBelanja.${index}.supplierId`, { valueAsNumber: true })} className="w-36 px-3 py-2 rounded-lg border border-[#DDC1AE] text-sm">
                              <option value="">{t("purchases.form.selectSupplier")}</option>
                              {supplierList.map((s) => <option key={s.id} value={s.id}>{s.nama}</option>)}
                            </select>
                          </td>
                          <td className="px-3 py-3">
                            <div className="flex items-center gap-1">
                              <input type="number" step="0.001" {...register(`detailBelanja.${index}.jumlah`, { valueAsNumber: true })} onChange={(e) => { const val = Number(e.target.value); setValue(`detailBelanja.${index}.jumlah`, val); handleJumlahChange(index, val); }} className="w-24 px-3 py-2 rounded-lg border border-[#DDC1AE] text-sm" placeholder="0" />
                              <span className="text-xs text-[#8A7362] min-w-[40px]">{watch(`detailBelanja.${index}.satuan`) || "gram"}</span>
                            </div>
                          </td>
                          <td className="px-3 py-3">
                            <div className="flex items-center gap-2">
                              <span className="text-[#8A7362] text-xs">Rp</span>
                              <input type="number" step="100" {...register(`detailBelanja.${index}.totalHarga`, { valueAsNumber: true })} className="w-28 px-3 py-2 rounded-lg border border-[#DDC1AE] text-sm" placeholder="0" />
                              {hargaPerGram > 0 && (
                                <span className="text-xs text-[#FF8A00] whitespace-nowrap">Rp {hargaPerGram.toLocaleString(localeStr)} / {watch(`detailBelanja.${index}.satuan`) || "gram"}</span>
                              )}
                            </div>
                          </td>
                          <td className="px-3 py-3">
                            <button type="button" onClick={() => remove(index)} className="p-1.5 rounded-full hover:bg-[#FEE2E2] text-[#EF4444]">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-[#F5E6D8]">
              <div className="text-xs text-[#8A7362]">{t("purchases.form.autoCalc")}</div>
              <div className="text-right">
                <p className="text-xs text-[#8A7362] mb-1">{t("purchases.form.totalLabel")}</p>
                <p className="font-[var(--font-roboto-mono)] font-bold text-3xl text-[#FF8A00]">Rp {totalBelanja.toLocaleString(localeStr)}</p>
              </div>
            </div>

            <div className="flex gap-3">
              <button type="button" onClick={onClose} className="flex-1 px-6 py-3 rounded-full border-2 border-[#DDC1AE] text-[#564334] font-semibold hover:bg-[#FFF8F6]">
                {t("common.cancel")}
              </button>
              <button type="submit" disabled={isSubmitting} className="flex-1 px-6 py-3 rounded-full bg-[#FF8A00] text-white font-semibold hover:bg-[#E67E00] disabled:opacity-50">
                {isSubmitting ? t("purchases.form.savingButton") : t("purchases.form.saveButton")}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
