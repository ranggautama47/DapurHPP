"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/axios";
import {
  AlertCircle,
  User,
  Store,
  ArrowUpRight,
} from "lucide-react";
import { PasswordInput } from "@/components/auth/password-input";
import { EmailInput } from "@/components/auth/email-input";
import { SocialButton } from "@/components/auth/social-button";
import { useTranslation } from "@/context/language-context";
import { createRegisterSchema, type RegisterFormData, registerDefaultValues } from "@/components/auth/register.schema";

export function RegisterForm() {
  const { t } = useTranslation("auth");
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const registerSchema = createRegisterSchema(t);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    setError: setFormError,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: registerDefaultValues,
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const payload = {
        name: data.namaLengkap,
        email: data.email,
        password: data.password,
      };

      await api.post("/auth/register", payload);
      router.push("/login?registered=true");
    } catch (err: any) {
      const message =
        err.response?.data?.message || t("register.errors.generic");
      setError(message);
      setFormError("root", { message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto relative animate-in fade-in slide-in-from-bottom-8 duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]">
      <div className="bg-white/95 backdrop-blur-sm p-2 sm:p-3 md:p-4 rounded-[3rem] shadow-2xl border border-white/40">
        <div className="bg-[#2A1711] rounded-[2.5rem] shadow-inner relative z-10 overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#FF8A00] via-[#BF360C] to-[#FF8A00]" />

          <div className="p-4 md:p-5">
            <div className="px-6 py-8 md:p-8 relative">
              <div className="space-y-6 relative z-10">
                <div>
                  <h2 className="font-[var(--font-playfair)] font-bold text-[1.75rem] leading-[2.25rem] text-[#FFEDE8]">
                    {t("register.title")}
                  </h2>
                  <p className="mt-2 text-sm font-[var(--font-be-vietnam)] text-[#FFEDE8]/70">
                    {t("register.subtitle")}
                  </p>
                </div>

                {error && (
                  <div className="flex items-center gap-2 rounded-2xl bg-[#BA1A1A]/10 border border-[#BA1A1A]/30 px-4 py-3">
                    <AlertCircle className="w-4 h-4 flex-shrink-0 text-[#FF6B6B]" />
                    <p className="text-sm text-[#FF6B6B]">{error}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
                  <div className="w-full">
                    <label htmlFor="namaLengkap" className="block text-xs font-semibold uppercase tracking-wider text-[#FFEDE8] mb-2">
                      {t("register.nameLabel")}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-[#8A7362]">
                        <User className="w-5 h-5" aria-hidden="true" />
                      </div>
                      <input
                        type="text"
                        id="namaLengkap"
                        {...register("namaLengkap")}
                        className={`w-full pl-12 pr-4 py-3.5 bg-white border-2 border-[#E8D5C4] rounded-[1rem] text-[#2A1711] text-base placeholder-[#8A7362]
                          focus:outline-none focus:border-[#FF8A00] focus:ring-2 focus:ring-[#FF8A00]/20
                          ${errors.namaLengkap ? "border-[#BA1A1A] focus:border-[#BA1A1A] focus:ring-[#BA1A1A]/20" : ""}`}
                        placeholder={t("register.namePlaceholder")}
                        aria-invalid={!!errors.namaLengkap}
                      />
                    </div>
                    {errors.namaLengkap && (
                      <p className="mt-2 flex items-center gap-1.5 text-sm text-[#FF6B6B]">
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                        {errors.namaLengkap.message}
                      </p>
                    )}
                  </div>

                  <div className="w-full">
                    <label htmlFor="namaBisnis" className="block text-xs font-semibold uppercase tracking-wider text-[#FFEDE8] mb-2">
                      {t("register.businessLabel")}{" "}
                      <span className="normal-case font-normal text-[#FFEDE8]/50">
                        {t("register.optionalText")}
                      </span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-[#8A7362]">
                        <Store className="w-5 h-5" aria-hidden="true" />
                      </div>
                      <input
                        type="text"
                        id="namaBisnis"
                        {...register("namaBisnis")}
                        className="w-full pl-12 pr-4 py-3.5 bg-white border-2 border-[#E8D5C4] rounded-[1rem] text-[#2A1711] text-base placeholder-[#8A7362]
                          focus:outline-none focus:border-[#FF8A00] focus:ring-2 focus:ring-[#FF8A00]/20"
                        placeholder={t("register.businessPlaceholder")}
                      />
                    </div>
                  </div>

                  <EmailInput
                    name="email"
                    control={control as any}
                    label={t("register.emailLabel")}
                    error={errors.email?.message}
                  />

                  <PasswordInput
                    name="password"
                    control={control as any}
                    label={t("register.passwordLabel")}
                    error={errors.password?.message}
                  />

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="group w-full flex items-center justify-between pl-8 pr-2 py-2 mt-2 rounded-full bg-[#BF360C] text-white font-[var(--font-be-vietnam)] font-semibold text-lg transition-all duration-500 hover:bg-[#9A2B00] active:scale-[0.98] disabled:bg-[#BF360C]/50 disabled:cursor-not-allowed shadow-lg shadow-[#BF360C]/20"
                  >
                    <span className="flex-1 text-center tracking-wide">
                      {isLoading ? t("register.registering") : t("register.registerButton")}
                    </span>
                    <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-[#2A1711] transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-105 group-hover:translate-x-1 group-hover:-translate-y-[1px]">
                      {isLoading ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <ArrowUpRight strokeWidth={2.5} className="w-5 h-5 text-white" />
                      )}
                    </div>
                  </button>
                </form>

                <div className="relative my-8">
                  <div className="w-full border-t border-white/10" />
                  <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#2A1711] px-4 text-[10px] font-bold text-[#FFEDE8]/50 uppercase tracking-[0.15em]">
                    {t("register.dividerText")}
                  </span>
                </div>

                <div className="flex items-center justify-center gap-4">
                  <SocialButton label={t("register.socialGoogle")} disabled ariaLabelPrefix={t("register.ariaLabelPrefix")} tooltipText={t("register.comingSoon")} />
                  <SocialButton label={t("register.socialApple")} disabled ariaLabelPrefix={t("register.ariaLabelPrefix")} tooltipText={t("register.comingSoon")} />
                </div>

                <p className="mt-6 text-center text-xs font-[var(--font-be-vietnam)] text-[#FFEDE8]/50 leading-relaxed">
                  {t("register.termsText")}{" "}
                  <Link href="/terms" className="text-[#FF8A00] hover:underline">
                    {t("register.termsLink")}
                  </Link>{" "}
                  {"&"}{" "}
                  <Link href="/privacy" className="text-[#FF8A00] hover:underline">
                    {t("register.privacyLink")}
                  </Link>{" "}
                  {t("register.appName")}.
                </p>

                <p className="mt-4 text-center text-sm font-[var(--font-be-vietnam)] text-[#FFEDE8]/70">
                  {t("register.hasAccountText")}{" "}
                  <Link
                    href="/login"
                    className="text-[#FF8A00] font-semibold hover:text-[#FFA94D] underline underline-offset-4 decoration-[#FF8A00]/30 hover:decoration-[#FF8A00] transition-all"
                  >
                    {t("register.loginLink")}
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}