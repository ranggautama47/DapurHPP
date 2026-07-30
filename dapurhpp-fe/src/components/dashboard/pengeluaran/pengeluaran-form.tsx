import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X } from "lucide-react";
import { api } from "@/lib/axios";
import { toast } from "sonner";
import { formatLocalDate } from "@/lib/utils";
import { detectKategori } from "@/lib/pengeluaran-lain";
import { useTranslation } from "@/context/language-context";
import type { Pengeluaran } from "@/types/pengeluaran";
import type { Kategori } from "@/types/pengeluaran";

interface PengeluaranFormProps {
  editingItem: Pengeluaran | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function PengeluaranForm({
  editingItem,
  onClose,
  onSuccess,
}: PengeluaranFormProps) {
  const { t, language } = useTranslation("master");
  const localeStr = language === "id" ? "id-ID" : "en-US";

  const [isSubmitting, setIsSubmitting] = useState(false);

  const KATEGORI_LIST: { value: Kategori; label: string }[] = [
    { value: "UTILITAS", label: t("expenses.categories.utilities") },
    { value: "KEMASAN", label: t("expenses.categories.packaging") },
    { value: "TRANSPORTASI", label: t("expenses.categories.transport") },
    { value: "KEBERSIHAN", label: t("expenses.categories.cleaning") },
    { value: "LAINNYA", label: t("expenses.categories.other") },
  ];

  const formSchema = z.object({
    tanggal: z.string().min(1, t("expenses.form.validation.dateRequired")),
    nama: z.string().min(1, t("expenses.form.validation.nameRequired")),
    kategori: z.string().min(1, t("expenses.form.validation.categoryRequired")),
    jumlah: z.number().min(1, t("expenses.form.validation.minAmount")),
  });

  type FormData = z.infer<typeof formSchema>;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tanggal: formatLocalDate(new Date()),
      nama: "",
      kategori: "Lainnya",
      jumlah: 0,
    },
  });

  const namaWatch = watch("nama");

  useEffect(() => {
    if (namaWatch) {
      const detected = detectKategori(namaWatch);
      setValue("kategori", detected);
      setValue("nama", namaWatch);
    }
  }, [namaWatch, setValue]);

  useEffect(() => {
    if (editingItem) {
      reset({
        tanggal: editingItem.tanggal,
        nama: editingItem.nama,
        kategori: editingItem.kategori,
        jumlah: editingItem.jumlah,
      });
    }
  }, [editingItem, reset]);

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      const payload = {
        tanggal: data.tanggal,
        nama: data.nama,
        jumlah: data.jumlah,
        kategori: data.kategori,
      };
      if (editingItem) {
        await api.patch(`/pengeluaran-lain/${editingItem.id}`, payload);
        toast.success(t("expenses.successUpdate"));
      } else {
        await api.post("/pengeluaran-lain", payload);
        toast.success(t("expenses.successCreate"));
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      toast.error(t("expenses.errorCreate"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    reset({
      tanggal: formatLocalDate(new Date()),
      nama: "",
      kategori: "Lainnya",
      jumlah: 0,
    });
    onClose();
  };

  return (
    <div className="bg-white rounded-[24px] border border-[#DDC1AE] shadow-[0_8px_30px_rgba(109,76,65,0.08)] p-6 lg:sticky lg:top-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-[var(--font-playfair)] font-bold text-xl text-[#2A1711]">
          {editingItem ? t("expenses.form.editTitle") : t("expenses.form.addTitle")}
        </h3>
        <button
          type="button"
          onClick={onClose}
          className="p-2 rounded-full hover:bg-[#FFF8F6] lg:hidden"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="block text-xs font-semibold text-[#564334] mb-1.5">
            {t("common.labels.date")} <span className="text-[#EF4444]">*</span>
          </label>
          <input
            type="date"
            {...register("tanggal")}
            className="w-full h-12 px-4 rounded-[16px] border-2 border-[#DDC1AE] bg-white text-[#2A1711] text-sm focus:outline-none focus:border-[#FF8A00] focus:ring-2 focus:ring-[#FF8A00]/20"
          />
          {errors.tanggal && (
            <p className="text-xs text-[#EF4444] mt-1">
              {errors.tanggal.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#564334] mb-1.5">
            {t("expenses.form.nameLabel")} <span className="text-[#EF4444]">*</span>
          </label>
          <input
            type="text"
            placeholder={t("expenses.form.namePlaceholder")}
            {...register("nama")}
            className="w-full h-12 px-4 rounded-[16px] border-2 border-[#DDC1AE] bg-white text-[#2A1711] text-sm placeholder:text-[#8A7362] focus:outline-none focus:border-[#FF8A00] focus:ring-2 focus:ring-[#FF8A00]/20"
          />
          {errors.nama && (
            <p className="text-xs text-[#EF4444] mt-1">{errors.nama.message}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#564334] mb-1.5">
            {t("expenses.form.categoryLabel")} <span className="text-[#EF4444]">*</span>
          </label>
          <div className="relative">
            <select
              {...register("kategori")}
              className="w-full h-12 px-4 rounded-[16px] border-2 border-[#DDC1AE] bg-white text-[#2A1711] text-sm focus:outline-none focus:border-[#FF8A00] focus:ring-2 focus:ring-[#FF8A00]/20 appearance-none"
            >
              {KATEGORI_LIST.map((k) => (
                <option key={k.value} value={k.value}>
                  {k.label}
                </option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg
                className="w-4 h-4 text-[#8A7362]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
          <p className="text-[10px] text-[#8A7362] mt-1">
            {t("expenses.form.categoryHint")}
          </p>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#564334] mb-1.5">
            {t("expenses.form.amountLabel")} <span className="text-[#EF4444]">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8A7362] text-sm font-medium">
              Rp
            </span>
            <input
              type="number"
              placeholder={t("expenses.form.amountPlaceholder")}
              {...register("jumlah", { valueAsNumber: true })}
              className="w-full h-12 pl-10 pr-4 rounded-[16px] border-2 border-[#DDC1AE] bg-white text-[#2A1711] text-sm placeholder:text-[#8A7362] focus:outline-none focus:border-[#FF8A00] focus:ring-2 focus:ring-[#FF8A00]/20"
            />
          </div>
          {errors.jumlah && (
            <p className="text-xs text-[#EF4444] mt-1">
              {errors.jumlah.message}
            </p>
          )}
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={handleClose}
            className="flex-1 h-12 rounded-full border-2 border-[#DDC1AE] text-[#564334] font-semibold text-sm hover:bg-[#FFF8F6] transition-all"
          >
            {t("common.buttons.cancel")}
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 h-12 rounded-full bg-[#FF8A00] text-white font-semibold text-sm hover:bg-[#E67E00] disabled:opacity-50 transition-all shadow-[0_4px_12px_rgba(255,138,0,0.25)]"
          >
            {isSubmitting ? t("common.status.loading") : editingItem ? t("expenses.form.updateButton") : t("common.buttons.save")}
          </button>
        </div>
      </form>
    </div>
  );
}
