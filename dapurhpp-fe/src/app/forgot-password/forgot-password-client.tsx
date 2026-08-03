"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { api } from "@/lib/axios";
import { AlertCircle, Mail, Loader2, ArrowUpRight } from "lucide-react";
import { toast } from "sonner";
import { Navbar } from "@/components/navbar";
import { HeroSection } from "@/components/hero-section";
import { Footer } from "@/components/footer";
import { useTranslation } from "@/context/language-context";

export default function ForgotPasswordClient() {
  const { t } = useTranslation("auth");

  const forgotPasswordSchema = z.object({
    email: z
      .string()
      .min(1, t("forgotPassword.errors.emailRequired"))
      .email(t("forgotPassword.errors.emailInvalid")),
  });
  type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [serverMessage, setServerMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);
    setServerMessage(null);
    try {
      const response = await api.post("/auth/forgot-password", data);
      const message = response.data?.message || t("forgotPassword.successMessage");
      setServerMessage(message);
      setIsSubmitted(true);
      reset();
      toast.success(message);
    } catch (err: any) {
      const message = err.response?.data?.message || t("forgotPassword.genericError");
      setServerMessage(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 flex flex-col lg:flex-row items-center justify-center px-6 py-20 lg:py-24 pt-24 lg:pt-10">
        <div className="w-full lg:w-1/2 flex flex-col items-center justify-center py-12 lg:py-0">
          <HeroSection />
        </div>

        <div className="w-full lg:w-1/2 flex items-center justify-center py-8 lg:py-0">
          <div className="w-full max-w-md px-4 pb-12 lg:pb-24">
            <div className="w-full max-w-md mx-auto relative animate-in fade-in slide-in-from-bottom-8 duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]">
              <div className="bg-[#2A1711] rounded-[2.5rem] shadow-[0_24px_64px_-12px_rgba(42,23,17,0.4)] relative z-10 overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#FF8A00] via-[#BF360C] to-[#FF8A00]" />
                <div className="p-4 md:p-5">
                  <div className="bg-[#FAF6F0] rounded-[2rem] border border-[#EADAC9] px-6 py-10 md:p-8 relative">
                    <div className="space-y-6 relative z-10">
                      <h2 className="font-[var(--font-playfair)] font-bold text-[1.75rem] leading-[2.25rem] text-[#2A1711] pr-16 md:pr-24">
                        {t("forgotPassword.title")}
                      </h2>
                      <p className="text-[#5D4037] font-[var(--font-be-vietnam)] text-base leading-relaxed">
                        {t("forgotPassword.subtitle")}
                      </p>

                      {isSubmitted && serverMessage && (
                        <div className="p-4 bg-[#FFF8F6] border border-[#FF8A00]/30 rounded-lg text-[#BF360C] text-sm font-[var(--font-be-vietnam)]">
                          {serverMessage}
                        </div>
                      )}

                      {!isSubmitted && (
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
                          <div className="space-y-2">
                            <label htmlFor="email" className="block text-xs font-bold uppercase tracking-[0.1em] text-[#5D4037] ml-2">
                              {t("forgotPassword.emailLabel")}
                            </label>
                            <div className="relative">
                              <input
                                type="email"
                                id="email"
                                {...register("email")}
                                className={`w-full pl-6 pr-14 py-4 bg-white border-2 border-[#D9C4B1] rounded-full text-[#2A1711] text-base placeholder-[#BCAAA4] transition-all duration-300 focus:outline-none focus:border-[#BF360C] focus:ring-4 focus:ring-[#BF360C]/10
                                ${errors.email ? "border-[#BA1A1A] focus:border-[#BA1A1A] focus:ring-[#BA1A1A]/20" : ""}`}
                                placeholder={t("forgotPassword.emailPlaceholder")}
                                aria-invalid={!!errors.email ? "true" : "false"}
                                disabled={isLoading}
                              />
                              <div className="absolute inset-y-0 right-0 flex items-center pr-5 pointer-events-none text-[#8D6E63]">
                                <Mail className="w-5 h-5" strokeWidth={1.5} />
                              </div>
                            </div>
                            {errors.email && (
                              <p className="mt-2 flex items-center gap-1.5 text-sm text-[#BA1A1A] ml-2">
                                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                {errors.email.message}
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
                                  {t("forgotPassword.sending")}
                                </span>
                              ) : (
                                t("forgotPassword.sendButton")
                              )}
                            </span>
                            <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-[#2A1711] transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-105 group-hover:translate-x-1 group-hover:-translate-y-[1px]">
                              {isLoading ? null : <ArrowUpRight strokeWidth={2.5} className="w-5 h-5 text-white" />}
                            </div>
                          </button>
                        </form>
                      )}

                      <p className="mt-8 text-center text-sm font-[var(--font-be-vietnam)] text-[#5D4037]">
                        {t("forgotPassword.backToLoginText")}{" "}
                        <Link href="/login" className="text-[#BF360C] font-semibold hover:text-[#9A2B00] underline underline-offset-4 decoration-[#BF360C]/30 hover:decoration-[#BF360C] transition-all">
                          {t("forgotPassword.backToLoginLink")}
                        </Link>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
