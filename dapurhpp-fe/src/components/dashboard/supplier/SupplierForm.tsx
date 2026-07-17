"use client";

import { useEffect } from "react";
import { X, Loader2, Truck, Phone, MapPin } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Supplier, CreateSupplierDto, UpdateSupplierDto } from "@/types/supplier";
import { api } from "@/lib/axios";

const supplierSchema = z.object({
  nama: z.string().min(2, "Nama minimal 2 karakter"),
  telepon: z.string().optional(),
  alamat: z.string().optional(),
});

type SupplierFormData = z.infer<typeof supplierSchema>;

interface SupplierFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateSupplierDto | UpdateSupplierDto) => Promise<void>;
  initialData?: Supplier | null;
  isLoading?: boolean;
}

export function SupplierForm({ isOpen, onClose, onSubmit, initialData, isLoading }: SupplierFormProps) {
  const isEdit = !!initialData;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SupplierFormData>({
    resolver: zodResolver(supplierSchema),
    defaultValues: {
      nama: "",
      telepon: "",
      alamat: "",
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        reset({
          nama: initialData.nama,
          telepon: initialData.telepon || "",
          alamat: initialData.alamat || "",
        });
      } else {
        reset({
          nama: "",
          telepon: "",
          alamat: "",
        });
      }
    }
  }, [isOpen, initialData, reset]);

  const handleSubmitForm = async (data: SupplierFormData) => {
    const submitData: CreateSupplierDto | UpdateSupplierDto = {
      nama: data.nama,
      ...(data.telepon && { telepon: data.telepon }),
      ...(data.alamat && { alamat: data.alamat }),
    };
    await onSubmit(submitData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2A1711]/60 backdrop-blur-sm">
      <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-[0_24px_64px_-12px_rgba(42,23,17,0.4)] overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-500">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#FF8A00] via-[#BF360C] to-[#FF8A00]" />
        
        <div className="p-4 md:p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-[var(--font-playfair)] font-bold text-[1.75rem] leading-[2.25rem] text-[#2A1711] pr-12 md:pr-20">
              {initialData ? "Edit Supplier" : "Tambah Supplier"}
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-[#FFF8F6] text-[#564334] transition-colors"
              aria-label="Tutup form"
            >
              <X className="w-5 h-5" strokeWidth={1.75} />
            </button>
          </div>

          <form onSubmit={handleSubmit(handleSubmitForm)} className="space-y-5" noValidate>
            <div className="space-y-2">
              <label htmlFor="nama" className="block text-xs font-bold uppercase tracking-[0.1em] text-[#5D4037] ml-2">
                Nama Supplier
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="nama"
                  {...register("nama")}
                  className={`w-full pl-12 pr-4 py-4 bg-white border-2 rounded-full text-[#2A1711] text-base placeholder-[#BCAAA4] transition-all duration-300 focus:outline-none focus:border-[#BF360C] focus:ring-4 focus:ring-[#BF360C]/10
                  ${errors.nama ? "border-[#BA1A1A] focus:border-[#BA1A1A] focus:ring-[#BA1A1A]/20" : "border-[#D9C4B1]"} `}
                  placeholder="Nama Supplier"
                  aria-invalid={!!errors.nama ? "true" : "false"}
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-[#8D6E63]">
                  <Truck className="w-5 h-5" strokeWidth={1.5} />
                </div>
              </div>
              {errors.nama && (
                <p className="mt-2 flex items-center gap-1.5 text-sm text-[#BA1A1A] ml-2">
                  <X className="w-4 h-4 flex-shrink-0" />
                  {errors.nama.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="telepon" className="block text-xs font-bold uppercase tracking-[0.1em] text-[#5D4037] ml-2">
                Telepon (Opsional)
              </label>
              <div className="relative">
                <input
                  type="tel"
                  id="telepon"
                  {...register("telepon")}
                  className="w-full pl-12 pr-4 py-4 bg-white border-2 border-[#D9C4B1] rounded-full text-[#2A1711] text-base placeholder-[#BCAAA4] transition-all duration-300 focus:outline-none focus:border-[#BF360C] focus:ring-4 focus:ring-[#BF360C]/10"
                  placeholder="0812-3456-7890"
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-[#8D6E63]">
                  <Phone className="w-5 h-5" strokeWidth={1.5} />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="alamat" className="block text-xs font-bold uppercase tracking-[0.1em] text-[#5D4037] ml-2">
                Alamat (Opsional)
              </label>
              <div className="relative">
                <textarea
                  id="alamat"
                  {...register("alamat")}
                  rows={3}
                  className="w-full pl-12 pr-4 py-4 bg-white border-2 border-[#D9C4B1] rounded-[1rem] text-[#2A1711] text-base placeholder-[#BCAAA4] transition-all duration-300 focus:outline-none focus:border-[#BF360C] focus:ring-4 focus:ring-[#BF360C]/10 resize-none"
                  placeholder="Alamat lengkap supplier"
                />
                <div className="absolute top-4 left-4 pointer-events-none text-[#8D6E63]">
                  <MapPin className="w-5 h-5" strokeWidth={1.5} />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="group w-full flex items-center justify-between pl-8 pr-2 py-2 mt-4 rounded-full bg-[#BF360C] text-white font-[var(--font-be-vietnam)] font-semibold text-lg transition-all duration-500 hover:bg-[#9A2B00] active:scale-[0.98] disabled:bg-[#BF360C]/50 disabled:cursor-not-allowed shadow-lg shadow-[#BF360C]/20"
            >
              <span className="flex-1 text-center tracking-wide">
                {isLoading ? (
                  <Loader2 className="w-5 h-5 mx-auto animate-spin" />
                ) : (
                  initialData ? "Simpan Perubahan" : "Tambah Supplier"
                )}
              </span>
              <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-[#2A1711] transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-105 group-hover:translate-x-1 group-hover:-translate-y-[1px]">
                <Truck className="w-5 h-5 text-white" strokeWidth={2.5} />
              </div>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
