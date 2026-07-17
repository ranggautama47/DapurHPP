"use client";

import { useEffect, useRef, useState } from "react";
import { X, Loader2, Package, Image as ImageIcon, Trash2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  BahanBaku,
  Satuan,
  KategoriBahan,
  CreateBahanBakuDto,
  UpdateBahanBakuDto,
} from "@/types/bahan-baku";
import { api } from "@/lib/axios";

const satuanOptions: Satuan[] = [
  "kg",
  "gram",
  "liter",
  "ml",
  "bungkus",
  "buah",
  "pcs",
  "sdm",
  "sdt",
];
const kategoriOptions: KategoriBahan[] = [
  "TEPUNG",
  "MINYAK",
  "SAYURAN",
  "BUMBU",
  "DAGING",
  "LAINNYA",
];
const API_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") ||
  "http://localhost:3001";

const formSchema = z.object({
  nama: z.string().min(2, "Nama minimal 2 karakter"),
  satuan: z.enum(satuanOptions as [Satuan, ...Satuan[]]),
  kategori: z.enum(kategoriOptions as [KategoriBahan, ...KategoriBahan[]]),
  hargaTerakhir: z.number().min(0, "Harga tidak boleh negatif").optional(),
  stok: z.number().min(0, "Stok tidak boleh negatif").optional(),
  stokMinimal: z.number().min(0, "Stok minimal tidak boleh negatif").optional(),
});

type FormData = z.infer<typeof formSchema>;

interface BahanBakuFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    data: CreateBahanBakuDto | UpdateBahanBakuDto,
  ) => Promise<number | void>;
  initialData?: BahanBaku | null;
  isLoading?: boolean;
}

export function BahanBakuForm({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isLoading,
}: BahanBakuFormProps) {
  const isEdit = !!initialData;
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [removePhoto, setRemovePhoto] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nama: "",
      satuan: "kg",
      kategori: "TEPUNG",
      hargaTerakhir: 0,
      stok: 0,
      stokMinimal: 0,
    },
  });

  useEffect(() => {
    if (isOpen) {
      setFile(null);
      setPreview(null);
      setRemovePhoto(false);
      if (uploading) setUploading(false);
      if (initialData) {
        reset({
          nama: initialData.nama,
          satuan: initialData.satuan,
          kategori: initialData.kategori,
          hargaTerakhir: initialData.hargaTerakhir,
          stok: initialData.stok,
          stokMinimal: initialData.stokMinimal,
        });
        if (initialData.fotoUrl) {
          setPreview(`${API_URL}${initialData.fotoUrl}`);
        }
      } else {
        reset({
          nama: "",
          satuan: "kg",
          kategori: "TEPUNG",
          hargaTerakhir: 0,
          stok: 0,
          stokMinimal: 0,
        });
      }
    }
  }, [isOpen, initialData, reset]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;

    if (
      !["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(f.type)
    ) {
      alert("Hanya file gambar (jpg, png, webp) yang diizinkan");
      return;
    }
    if (f.size > 2 * 1024 * 1024) {
      alert("Ukuran file maksimal 2MB");
      return;
    }

    setFile(f);
    setRemovePhoto(false);
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(f);
  };

  const handleRemovePhoto = () => {
    setFile(null);
    setPreview(null);
    setRemovePhoto(true);
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleFormSubmit = async (data: FormData) => {
    const dto: Record<string, any> = {
      nama: data.nama,
      satuan: data.satuan,
      kategori: data.kategori,
      hargaTerakhir: data.hargaTerakhir,
      stok: data.stok,
      stokMinimal: data.stokMinimal,
    };

    let bahanId = initialData?.id;

    if (isEdit) {
      if (removePhoto) {
        dto.fotoUrl = "";
      }
      await onSubmit(dto);
    } else {
      const newId = await onSubmit(dto);
      if (typeof newId === "number") bahanId = newId;
    }

    if (file && bahanId) {
      setUploading(true);
      try {
        const formData = new FormData();
        formData.append("file", file);
        await api.post(`/bahan-baku/${bahanId}/upload-foto`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } catch (err) {
        console.error("Gagal upload foto:", err);
        alert("Foto gagal diupload, data bahan sudah tersimpan");
      } finally {
        setUploading(false);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2A1711]/60 backdrop-blur-sm">
      {/* Container utama Card: Menggunakan flex-col dan pembatasan max-h sesuai tinggi viewport */}
      <div className="relative w-full max-w-md bg-white rounded-[2rem] md:rounded-[2.5rem] shadow-[0_24px_64px_-12px_rgba(42,23,17,0.4)] overflow-hidden flex flex-col max-h-[calc(100vh-2rem)] md:max-h-[90vh] animate-in fade-in slide-in-from-bottom-8 duration-500">
        {/* Dekorasi Garis Gradasi Top (z-10 agar tidak tertutup konten saat di-scroll) */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#FF8A00] via-[#BF360C] to-[#FF8A00] z-10" />

        {/* Area Scrollable Konten di Dalam Modal */}
        <div className="flex-1 overflow-y-auto p-5 md:p-6 pt-6 tracking-normal scrollbar-thin">
          {/* Header Modal */}
          <div className="flex items-center justify-between mb-5 sticky top-0 bg-white/95 backdrop-blur-xs z-10 py-1 -mx-1 px-1">
            <h2 className="font-[var(--font-playfair)] font-bold text-2xl md:text-[1.75rem] text-[#2A1711] pr-6">
              {isEdit ? "Edit Bahan Baku" : "Tambah Bahan Baku"}
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-[#FFF8F6] text-[#564334] transition-colors flex-shrink-0"
              aria-label="Tutup form"
            >
              <X className="w-5 h-5" strokeWidth={1.75} />
            </button>
          </div>

          {/* Foto Upload */}
          <div className="mb-5">
            <label className="block text-xs font-bold uppercase tracking-[0.1em] text-[#5D4037] ml-2 mb-2">
              Foto Bahan (Opsional)
            </label>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl border-2 border-dashed border-[#DDC1AE] flex items-center justify-center flex-shrink-0 overflow-hidden bg-[#FFF8F6]">
                {preview ? (
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <ImageIcon
                    className="w-6 h-6 md:w-8 md:h-8 text-[#DDC1AE]"
                    strokeWidth={1.5}
                  />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  id="foto-upload"
                />
                <div className="flex flex-wrap gap-2 items-center">
                  <label
                    htmlFor="foto-upload"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#DDC1AE] text-[#564334] hover:bg-[#FFF8F6] transition-colors text-xs md:text-sm font-medium cursor-pointer font-[var(--font-be-vietnam)]"
                  >
                    <ImageIcon className="w-4 h-4" strokeWidth={1.75} />
                    {preview ? "Ganti Foto" : "Pilih Foto"}
                  </label>
                  {preview && (
                    <button
                      type="button"
                      onClick={handleRemovePhoto}
                      className="inline-flex items-center gap-1 px-3 py-2 rounded-full text-[#EF4444] hover:bg-[#FEF2F2] transition-colors text-xs md:text-sm"
                    >
                      <Trash2 className="w-4 h-4" strokeWidth={1.75} />
                      Hapus
                    </button>
                  )}
                </div>
                <p className="text-[10px] md:text-xs text-[#8A7362] mt-1">
                  Maks. 2MB (JPG, PNG, WebP)
                </p>
              </div>
            </div>
          </div>

          {/* Form Utama dengan Spacing dan Padding Input yang Dioptimalkan */}
          <form
            onSubmit={handleSubmit(handleFormSubmit)}
            className="space-y-4 md:space-y-5"
            noValidate
          >
            {/* Nama Bahan */}
            <div className="space-y-1.5">
              <label
                htmlFor="nama"
                className="block text-xs font-bold uppercase tracking-[0.1em] text-[#5D4037] ml-2"
              >
                Nama Bahan
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="nama"
                  {...register("nama")}
                  className={`w-full pl-11 pr-4 py-3 md:py-3.5 bg-white border-2 rounded-full text-[#2A1711] text-sm md:text-base placeholder-[#BCAAA4] transition-all duration-300 focus:outline-none focus:border-[#BF360C] focus:ring-4 focus:ring-[#BF360C]/10
                  ${errors.nama ? "border-[#BA1A1A] focus:border-[#BA1A1A] focus:ring-[#BA1A1A]/20" : "border-[#D9C4B1]"} `}
                  placeholder="Contoh: Tepung Terigu"
                  aria-invalid={!!errors.nama ? "true" : "false"}
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-[#8D6E63]">
                  <Package
                    className="w-4 h-4 md:w-5 md:h-5"
                    strokeWidth={1.5}
                  />
                </div>
              </div>
              {errors.nama && (
                <p className="mt-1 flex items-center gap-1.5 text-xs md:text-sm text-[#BA1A1A] ml-2">
                  <X className="w-3.5 h-3.5 flex-shrink-0" />
                  {errors.nama.message}
                </p>
              )}
            </div>

            {/* Kategori */}
            <div className="space-y-1.5">
              <label
                htmlFor="kategori"
                className="block text-xs font-bold uppercase tracking-[0.1em] text-[#5D4037] ml-2"
              >
                Kategori
              </label>
              <div className="relative">
                <select
                  id="kategori"
                  {...register("kategori")}
                  className="w-full pl-11 pr-4 py-3 md:py-3.5 bg-white border-2 border-[#D9C4B1] rounded-full text-[#2A1711] text-sm md:text-base focus:outline-none focus:border-[#BF360C] focus:ring-4 focus:ring-[#BF360C]/10 appearance-none"
                >
                  {kategoriOptions.map((k) => (
                    <option key={k} value={k}>
                      {k.charAt(0) + k.slice(1).toLowerCase()}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-[#8D6E63]">
                  <Package
                    className="w-4 h-4 md:w-5 md:h-5"
                    strokeWidth={1.5}
                  />
                </div>
                {/* Custom arrow indicator since native looks different on devices */}
                <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-[#8D6E63]">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Satuan */}
            <div className="space-y-1.5">
              <label
                htmlFor="satuan"
                className="block text-xs font-bold uppercase tracking-[0.1em] text-[#5D4037] ml-2"
              >
                Satuan
              </label>
              <div className="relative">
                <select
                  id="satuan"
                  {...register("satuan")}
                  className={`w-full pl-11 pr-4 py-3 md:py-3.5 bg-white border-2 rounded-full text-[#2A1711] text-sm md:text-base transition-all duration-300 focus:outline-none focus:border-[#BF360C] focus:ring-4 focus:ring-[#BF360C]/10 appearance-none
                  ${errors.satuan ? "border-[#BA1A1A] focus:border-[#BA1A1A] focus:ring-[#BA1A1A]/20" : "border-[#D9C4B1]"} `}
                  aria-invalid={!!errors.satuan ? "true" : "false"}
                >
                  <option value="">Pilih satuan</option>
                  {satuanOptions.map((satuan) => (
                    <option key={satuan} value={satuan}>
                      {satuan.toUpperCase()}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-[#8D6E63]">
                  <Package
                    className="w-4 h-4 md:w-5 md:h-5"
                    strokeWidth={1.5}
                  />
                </div>
                <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-[#8D6E63]">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
              {errors.satuan && (
                <p className="mt-1 flex items-center gap-1.5 text-xs md:text-sm text-[#BA1A1A] ml-2">
                  <X className="w-3.5 h-3.5 flex-shrink-0" />
                  {errors.satuan.message}
                </p>
              )}
            </div>

            {/* Harga Terakhir */}
            <div className="space-y-1.5">
              <label
                htmlFor="hargaTerakhir"
                className="block text-xs font-bold uppercase tracking-[0.1em] text-[#5D4037] ml-2"
              >
                Harga Terakhir (Opsional)
              </label>
              <div className="relative">
                <input
                  type="number"
                  id="hargaTerakhir"
                  {...register("hargaTerakhir", {
                    valueAsNumber: true,
                    min: 0,
                  })}
                  className={`w-full pl-12 pr-4 py-3 md:py-3.5 bg-white border-2 rounded-full text-[#2A1711] text-sm md:text-base placeholder-[#BCAAA4] transition-all duration-300 focus:outline-none focus:border-[#BF360C] focus:ring-4 focus:ring-[#BF360C]/10
                  ${errors.hargaTerakhir ? "border-[#BA1A1A] focus:border-[#BA1A1A] focus:ring-[#BA1A1A]/20" : "border-[#D9C4B1]"} `}
                  placeholder="Contoh: 12000"
                  min="0"
                  step="100"
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-[#8D6E63]">
                  <span className="font-[var(--font-roboto-mono)] text-sm md:text-base font-semibold">
                    Rp
                  </span>
                </div>
              </div>
              {errors.hargaTerakhir && (
                <p className="mt-1 flex items-center gap-1.5 text-xs md:text-sm text-[#BA1A1A] ml-2">
                  <X className="w-3.5 h-3.5 flex-shrink-0" />
                  {errors.hargaTerakhir.message}
                </p>
              )}
            </div>

            {/* Grid Stok */}
            <div className="grid grid-cols-2 gap-3 md:gap-4">
              <div className="space-y-1.5">
                <label
                  htmlFor="stok"
                  className="block text-[10px] md:text-xs font-bold uppercase tracking-[0.05em] md:tracking-[0.1em] text-[#5D4037] ml-2"
                >
                  Stok Saat Ini
                </label>
                <div className="relative">
                  <input
                    type="number"
                    id="stok"
                    {...register("stok", { valueAsNumber: true, min: 0 })}
                    readOnly={isEdit}
                    className={`w-full px-4 py-3 md:py-3.5 bg-white border-2 rounded-full text-[#2A1711] text-sm md:text-base placeholder-[#BCAAA4] transition-all duration-300 focus:outline-none focus:border-[#BF360C] focus:ring-4 focus:ring-[#BF360C]/10
                    ${isEdit ? "bg-[#FFF8F6] cursor-not-allowed opacity-70" : ""}
                    ${errors.stok ? "border-[#BA1A1A]" : "border-[#D9C4B1]"}`}
                    placeholder="0"
                    min="0"
                    step="0.001"
                  />
                </div>
                {errors.stok && (
                  <p className="mt-1 flex items-center gap-1.5 text-xs text-[#BA1A1A] ml-2">
                    <X className="w-3.5 h-3.5 flex-shrink-0" />
                    {errors.stok.message}
                  </p>
                )}
                {isEdit && (
                  <p className="text-[10px] text-[#8A7362] ml-2 mt-1 font-[var(--font-be-vietnam)]">
                    Stok otomatis update dari pencatatan belanja
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="stokMinimal"
                  className="block text-[10px] md:text-xs font-bold uppercase tracking-[0.05em] md:tracking-[0.1em] text-[#5D4037] ml-2"
                >
                  Minimal Stok
                </label>
                <div className="relative">
                  <input
                    type="number"
                    id="stokMinimal"
                    {...register("stokMinimal", {
                      valueAsNumber: true,
                      min: 0,
                    })}
                    className={`w-full px-4 py-3 md:py-3.5 bg-white border-2 rounded-full text-[#2A1711] text-sm md:text-base placeholder-[#BCAAA4] transition-all duration-300 focus:outline-none focus:border-[#BF360C] focus:ring-4 focus:ring-[#BF360C]/10
                    ${errors.stokMinimal ? "border-[#BA1A1A] focus:border-[#BA1A1A] focus:ring-[#BA1A1A]/20" : "border-[#D9C4B1]"} `}
                    placeholder="0"
                    min="0"
                    step="0.001"
                  />
                </div>
                {errors.stokMinimal && (
                  <p className="mt-1 flex items-center gap-1.5 text-xs text-[#BA1A1A] ml-2">
                    <X className="w-3.5 h-3.5 flex-shrink-0" />
                    {errors.stokMinimal.message}
                  </p>
                )}
              </div>
            </div>

            {/* Tombol Submit Premium yang Fleksibel Secara Vertikal */}
            <button
              type="submit"
              disabled={isLoading || uploading}
              className="group w-full flex items-center justify-between pl-6 md:pl-8 pr-1.5 py-1.5 mt-2 rounded-full bg-[#BF360C] text-white font-[var(--font-be-vietnam)] font-semibold text-base md:text-lg transition-all duration-500 hover:bg-[#9A2B00] active:scale-[0.98] disabled:bg-[#BF360C]/50 disabled:cursor-not-allowed shadow-lg shadow-[#BF360C]/20 flex-shrink-0"
            >
              <span className="flex-1 text-center tracking-wide pr-2 select-none">
                {uploading
                  ? "Mengupload foto..."
                  : isLoading
                    ? "Menyimpan..."
                    : isEdit
                      ? "Simpan Perubahan"
                      : "Tambah Bahan"}
              </span>
              <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#2A1711] transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-105 group-hover:translate-x-1 group-hover:-translate-y-[1px]">
                {isLoading || uploading ? (
                  <Loader2
                    className="w-4 h-4 md:w-5 md:h-5 text-white animate-spin"
                    strokeWidth={2.5}
                  />
                ) : (
                  <svg
                    strokeWidth={2.5}
                    className="w-4 h-4 md:w-5 md:h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                )}
              </div>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
