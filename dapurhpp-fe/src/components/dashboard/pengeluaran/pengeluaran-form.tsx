import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X } from "lucide-react";
import { api } from "@/lib/axios";
import { formatLocalDate } from "@/lib/utils";
import { detectKategori } from "@/lib/pengeluaran-lain";
import type { Pengeluaran } from "@/types/pengeluaran";
import type { Kategori } from "@/types/pengeluaran";

const KATEGORI_LIST: { value: Kategori; label: string }[] = [
  { value: "UTILITAS", label: "Utilitas" },
  { value: "KEMASAN", label: "Kemasan" },
  { value: "TRANSPORTASI", label: "Transportasi" },
  { value: "KEBERSIHAN", label: "Kebersihan" },
  { value: "LAINNYA", label: "Lainnya" },
];
const formSchema = z.object({
  tanggal: z.string().min(1, "Pilih tanggal"),
  nama: z.string().min(1, "Masukkan nama pengeluaran"),
  kategori: z.string().min(1, "Pilih kategori"),
  jumlah: z.number().min(1, "Minimal Rp 1"),
});

type FormData = z.infer<typeof formSchema>;

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
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      } else {
        await api.post("/pengeluaran-lain", payload);
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      alert(err.response?.data?.message || "Gagal menyimpan pengeluaran");
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
          {editingItem ? "Edit Pengeluaran" : "Tambah Pengeluaran"}
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
        {/* Tanggal */}
        <div>
          <label className="block text-xs font-semibold text-[#564334] mb-1.5">
            Tanggal <span className="text-[#EF4444]">*</span>
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

        {/* Nama Pengeluaran */}
        <div>
          <label className="block text-xs font-semibold text-[#564334] mb-1.5">
            Nama Pengeluaran <span className="text-[#EF4444]">*</span>
          </label>
          <input
            type="text"
            placeholder="Contoh: Gas Elpiji"
            {...register("nama")}
            className="w-full h-12 px-4 rounded-[16px] border-2 border-[#DDC1AE] bg-white text-[#2A1711] text-sm placeholder:text-[#8A7362] focus:outline-none focus:border-[#FF8A00] focus:ring-2 focus:ring-[#FF8A00]/20"
          />
          {errors.nama && (
            <p className="text-xs text-[#EF4444] mt-1">{errors.nama.message}</p>
          )}
        </div>

        {/* Kategori (Frontend-only) */}
        <div>
          <label className="block text-xs font-semibold text-[#564334] mb-1.5">
            Kategori <span className="text-[#EF4444]">*</span>
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
            Kategori otomatis terdeteksi dari nama. Ubah jika perlu.
          </p>
        </div>

        {/* Jumlah */}
        <div>
          <label className="block text-xs font-semibold text-[#564334] mb-1.5">
            Jumlah (Rp) <span className="text-[#EF4444]">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8A7362] text-sm font-medium">
              Rp
            </span>
            <input
              type="number"
              placeholder="Contoh: 25000"
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
            Batal
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 h-12 rounded-full bg-[#FF8A00] text-white font-semibold text-sm hover:bg-[#E67E00] disabled:opacity-50 transition-all shadow-[0_4px_12px_rgba(255,138,0,0.25)]"
          >
            {isSubmitting ? "Menyimpan..." : editingItem ? "Update" : "Simpan"}
          </button>
        </div>
      </form>
    </div>
  );
}
