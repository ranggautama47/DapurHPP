"use client";

import { useState, useEffect, Suspense } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/axios";
import { AlertCircle, Eye, EyeOff, Loader2, Lock, ArrowUpRight } from "lucide-react";
import { toast } from "sonner";
import { Navbar } from "@/components/navbar";
import { HeroSection } from "@/components/hero-section";
import { Footer } from "@/components/footer";

const resetPasswordSchema = z
  .object({
    newPassword: z.string().min(1, "Kata sandi baru wajib diisi").min(8, "Kata sandi minimal 8 karakter"),
    confirmPassword: z.string().min(1, "Konfirmasi kata sandi wajib diisi"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Kata sandi tidak cocok",
    path: ["confirmPassword"],
  });

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

function ResetPasswordFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isTokenValid, setIsTokenValid] = useState<boolean | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const tokenFromUrl = searchParams.get("token");
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
      setIsTokenValid(true);
    } else {
      setIsTokenValid(false);
    }
  }, [searchParams]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token) return;

    setIsLoading(true);
    try {
      await api.post("/auth/reset-password", {
        token,
        newPassword: data.newPassword,
      });
      toast.success("Password berhasil direset. Silakan login dengan password baru.");
      router.push("/login");
    } catch (err: any) {
      const message = err.response?.data?.message || "Token tidak valid atau sudah kedaluwarsa";
      toast.error(message);
      if (message.includes("kedaluwarsa") || message.includes("tidak valid")) {
        setIsTokenValid(false);
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isTokenValid === null) {
    return (
      <div className="bg-white rounded-[2rem] border border-[#EADAC9] p-8 md:p-10 text-center animate-in fade-in duration-500">
        <div className="w-12 h-12 rounded-full bg-[#BF360C]/10 flex items-center justify-center mx-auto mb-4">
          <Loader2 className="w-6 h-6 text-[#BF360C] animate-spin" />
        </div>
        <p className="text-[#5D4037] font-[var(--font-be-vietnam)]">Memvalidasi tautan...</p>
      </div>
    );
  }

  if (!isTokenValid) {
    return (
      <div className="bg-white rounded-[2rem] border border-[#EADAC9] p-8 md:p-10 text-center animate-in fade-in slide-in-from-bottom-8 duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]">
        <div className="w-16 h-16 rounded-full bg-[#FFEBEE] flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="w-8 h-8 text-[#C62828]" />
        </div>
        <h2 className="font-[var(--font-playfair)] font-bold text-[1.75rem] leading-[2.25rem] text-[#2A1711] mb-4">
          Link Tidak Valid
        </h2>
        <p className="text-[#5D4037] font-[var(--font-be-vietnam)] text-base leading-relaxed mb-8">
          Tautan pengaturan ulang kata sandi tidak valid atau sudah kedaluwarsa.
          Silakan minta tautan baru.
        </p>
        <Link
          href="/forgot-password"
          className="inline-flex items-center justify-center gap-2 w-full pl-8 pr-2 py-2 rounded-full bg-[#BF360C] text-white font-[var(--font-be-vietnam)] font-semibold text-lg transition-all duration-500 hover:bg-[#9A2B00] shadow-lg shadow-[#BF360C]/20"
        >
          <span className="flex-1 text-center tracking-wide">Minta Link Baru</span>
          <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-[#2A1711]">
            <ArrowUpRight strokeWidth={2.5} className="w-5 h-5 text-white" />
          </div>
        </Link>
        <p className="mt-6 text-sm font-[var(--font-be-vietnam)] text-[#5D4037]">
          Atau <Link href="/login" className="text-[#BF360C] font-semibold hover:text-[#9A2B00] underline underline-offset-4 decoration-[#BF360C]/30 hover:decoration-[#BF360C] transition-all">kembali ke login</Link>
        </p>
      </div>
    );
  }

  return (
    <div className="bg-[#2A1711] rounded-[2.5rem] shadow-[0_24px_64px_-12px_rgba(42,23,17,0.4)] relative z-10 overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#FF8A00] via-[#BF360C] to-[#FF8A00]" />
      <div className="p-4 md:p-5">
        <div className="bg-[#FAF6F0] rounded-[2rem] border border-[#EADAC9] px-6 py-10 md:p-8 relative">
          <div className="space-y-6 relative z-10">
            <h2 className="font-[var(--font-playfair)] font-bold text-[1.75rem] leading-[2.25rem] text-[#2A1711] pr-16 md:pr-24">
              Atur Ulang Password
            </h2>
            <p className="text-[#5D4037] font-[var(--font-be-vietnam)] text-base leading-relaxed">
              Masukkan kata sandi baru Anda. Pastikan kata sandi minimal 8 karakter.
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
              <div className="space-y-2">
                <label htmlFor="newPassword" className="block text-xs font-bold uppercase tracking-[0.1em] text-[#5D4037] ml-2">
                  Kata Sandi Baru
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="newPassword"
                    {...register("newPassword")}
                    className={`w-full pl-6 pr-14 py-4 bg-white border-2 border-[#D9C4B1] rounded-full text-[#2A1711] text-base placeholder-[#BCAAA4] transition-all duration-300 focus:outline-none focus:border-[#BF360C] focus:ring-4 focus:ring-[#BF360C]/10
                    ${errors.newPassword ? "border-[#BA1A1A] focus:border-[#BA1A1A] focus:ring-[#BA1A1A]/20" : ""}`}
                    placeholder="••••••••"
                    aria-invalid={!!errors.newPassword ? "true" : "false"}
                    disabled={isLoading}
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-5 pointer-events-none text-[#8D6E63]">
                    <Lock className="w-5 h-5" strokeWidth={1.5} />
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-5 text-[#8D6E63] hover:text-[#BF360C] transition-colors duration-300"
                    aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" strokeWidth={1.5} />
                    ) : (
                      <Eye className="w-5 h-5" strokeWidth={1.5} />
                    )}
                  </button>
                </div>
                {errors.newPassword && (
                  <p className="mt-2 flex items-center gap-1.5 text-sm text-[#BA1A1A] ml-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    {errors.newPassword.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="block text-xs font-bold uppercase tracking-[0.1em] text-[#5D4037] ml-2">
                  Konfirmasi Kata Sandi Baru
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    {...register("confirmPassword")}
                    className={`w-full pl-6 pr-14 py-4 bg-white border-2 border-[#D9C4B1] rounded-full text-[#2A1711] text-base placeholder-[#BCAAA4] transition-all duration-300 focus:outline-none focus:border-[#BF360C] focus:ring-4 focus:ring-[#BF360C]/10
                    ${errors.confirmPassword ? "border-[#BA1A1A] focus:border-[#BA1A1A] focus:ring-[#BA1A1A]/20" : ""}`}
                    placeholder="••••••••"
                    aria-invalid={!!errors.confirmPassword ? "true" : "false"}
                    disabled={isLoading}
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-5 pointer-events-none text-[#8D6E63]">
                    <Lock className="w-5 h-5" strokeWidth={1.5} />
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-5 text-[#8D6E63] hover:text-[#BF360C] transition-colors duration-300"
                    aria-label={showConfirmPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5" strokeWidth={1.5} />
                    ) : (
                      <Eye className="w-5 h-5" strokeWidth={1.5} />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-2 flex items-center gap-1.5 text-sm text-[#BA1A1A] ml-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="group w-full flex items-center justify-between pl-8 pr-2 py-2 mt-4 rounded-full bg-[#BF360C] text-white font-[var(--font-be-vietnam)] font-semibold text-lg transition-all duration-500 hover:bg-[#9A2B00] active:scale-[0.98] disabled:bg-[#BF360C]/50 disabled:cursor-not-allowed shadow-lg shadow-[#BF360C]/20"
              >
                <span className="flex-1 text-center tracking-wide">
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Memproses...
                    </span>
                  ) : (
                    "Simpan Password Baru"
                  )}
                </span>
                <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-[#2A1711] transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-105 group-hover:translate-x-1 group-hover:-translate-y-[1px]">
                  {isLoading ? null : <ArrowUpRight strokeWidth={2.5} className="w-5 h-5 text-white" />}
                </div>
              </button>
            </form>

            <p className="mt-8 text-center text-sm font-[var(--font-be-vietnam)] text-[#5D4037]">
              Kembali ke <Link href="/login" className="text-[#BF360C] font-semibold hover:text-[#9A2B00] underline underline-offset-4 decoration-[#BF360C]/30 hover:decoration-[#BF360C] transition-all">Masuk</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 flex flex-col lg:flex-row items-center justify-center px-6 py-20 lg:py-24 pt-24 lg:pt-10">
        <div className="w-full lg:w-1/2 flex flex-col items-center justify-center py-12 lg:py-0">
          <HeroSection />
        </div>

        <div className="w-full lg:w-1/2 flex items-center justify-center py-8 lg:py-0">
          <div className="w-full max-w-md px-4 pb-12 lg:pb-24">
            <Suspense fallback={
              <div className="bg-white rounded-[2rem] border border-[#EADAC9] p-8 md:p-10 text-center">
                <div className="w-12 h-12 rounded-full bg-[#BF360C]/10 flex items-center justify-center mx-auto mb-4">
                  <Loader2 className="w-6 h-6 text-[#BF360C] animate-spin" />
                </div>
                <p className="text-[#5D4037] font-[var(--font-be-vietnam)]">Memuat halaman...</p>
              </div>
            }>
              <ResetPasswordFormContent />
            </Suspense>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
