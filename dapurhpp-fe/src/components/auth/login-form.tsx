"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuthStore, setTokenCookie } from "@/lib/auth-store";
import { api } from "@/lib/axios";
import { AlertCircle, Eye, Mail, EyeOff, ArrowUpRight, CheckCircle2, Info } from "lucide-react";
import { SocialButton } from "@/components/auth/social-button";
import { useTranslation } from "@/context/language-context";
import { createLoginSchema, type LoginFormData, loginDefaultValues } from "@/components/auth/login.schema";

export function LoginForm() {
  const { t } = useTranslation("auth");
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, setAccessToken } = useAuthStore();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const registered = searchParams.get("registered") === "true";
  const registeredEmail = searchParams.get("email") || "";
  const redirectTo = searchParams.get("redirect") || "/dashboard";

  const loginSchema = createLoginSchema(t);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError: setFormError,
    setValue,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      ...loginDefaultValues,
      email: registeredEmail,
    },
  });

  // Set email from URL param after form is initialized (for pre-fill)
  useEffect(() => {
    if (registeredEmail) {
      setValue("email", registeredEmail, { shouldValidate: true });
    }
  }, [registeredEmail, setValue]);

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError(null);
    setIsSuccess(false);

    try {
      const response = await api.post("/auth/login", data);
      const { access_token, user } = response.data;
      setAccessToken(access_token);
      login(user);
      setTokenCookie(access_token);

      setIsSuccess(true);

      setTimeout(() => {
        router.push(redirectTo);
      }, 1500);
    } catch (err: any) {
      const message =
        err.response?.data?.message || t("login.errors.invalidCredentials");
      setError(message);
      setFormError("root", { message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto relative animate-in fade-in slide-in-from-bottom-8 duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]">
      <div className="bg-[#2A1711] rounded-[2.5rem] shadow-[0_24px_64px_-12px_rgba(42,23,17,0.4)] relative z-10 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#FF8A00] via-[#BF360C] to-[#FF8A00]" />

        <div className="p-4 md:p-5">
          <div className="bg-[#FAF6F0] rounded-[2rem] border border-[#EADAC9] px-6 py-10 md:p-8 relative">
            <div className="space-y-6 relative z-10">
              <h2 className="font-[var(--font-playfair)] font-bold text-[1.75rem] leading-[2.25rem] text-[#2A1711] pr-16 md:pr-24">
                {t("login.title")}
              </h2>

              {error && (
                <div className="mb-4 p-4 bg-[#FFEBEE] border border-[#EF9A9A] rounded-lg text-[#C62828] text-sm">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p>{error}</p>
                      {error.includes("belum diverifikasi") && (
                        <div className="mt-3">
                          <Link
                            href="/resend-verification"
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#BF360C] hover:text-[#9A2B00] underline underline-offset-2 transition-colors"
                          >
                            Kirim Ulang Email Verifikasi
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {registered && (
                <div className="mb-4 p-4 bg-[#FFF8F0] border border-[#FFB74D]/40 rounded-lg text-[#BF360C] text-sm flex items-start gap-3">
                  <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">Registrasi Berhasil!</p>
                    <p className="mt-1">
                      Silakan cek inbox email Anda (
                      <span className="font-medium">{registeredEmail}</span>
                      ) untuk melakukan verifikasi sebelum masuk.
                    </p>
                  </div>
                </div>
              )}

              {isSuccess && (
                <div className="mb-4 p-4 bg-[#E8F5E9] border border-[#A5D6A7] rounded-lg text-[#2E7D32] text-sm flex items-center">
                  <CheckCircle2 className="w-5 h-5 mr-3 flex-shrink-0" />
                  <span>{t("login.successMessage")}</span>
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-xs font-bold uppercase tracking-[0.1em] text-[#5D4037] ml-2">
                    {t("login.emailLabel")}
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      id="email"
                      {...register("email")}
                      className={`w-full pl-6 pr-14 py-4 bg-white border-2 border-[#D9C4B1] rounded-full text-[#2A1711] text-base placeholder-[#BCAAA4] transition-all duration-300 focus:outline-none focus:border-[#BF360C] focus:ring-4 focus:ring-[#BF360C]/10
                      ${errors.email ? "border-[#BA1A1A] focus:border-[#BA1A1A] focus:ring-[#BA1A1A]/20" : ""}`}
                      placeholder={t("login.emailPlaceholder")}
                      aria-invalid={!!errors.email ? "true" : "false"}
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-5 pointer-events-none text-[#8D6E63]">
                      <Mail className="w-5 h-5" strokeWidth="{1.5}"/>
                    </div>
                  </div>
                  {errors.email && (
                    <p className="mt-2 flex items-center gap-1.5 text-sm text-[#BA1A1A] ml-2">
                      <AlertCircle className="w-4 h-4 flex-shrink-0"/>
                      {errors.email?.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="password" className="block text-xs font-bold uppercase tracking-[0.1em] text-[#5D4037] ml-2">
                    {t("login.passwordLabel")}
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      {...register("password")}
                      className={`w-full pl-6 pr-14 py-4 bg-white border-2 border-[#D9C4B1] rounded-full text-[#2A1711] text-base placeholder-[#BCAAA4] transition-all duration-300 focus:outline-none focus:border-[#BF360C] focus:ring-4 focus:ring-[#BF360C]/10
                      ${errors.password ? "border-[#BA1A1A] focus:border-[#BA1A1A] focus:ring-[#BA1A1A]/20" : ""}`}
                      placeholder={t("login.passwordPlaceholder")}
                      aria-invalid={!!errors.password ? "true" : "false"}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-5 text-[#8D6E63] hover:text-[#BF360C] transition-colors duration-300"
                      aria-label={showPassword ? t("login.hidePasswordAria") : t("login.showPasswordAria")}
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" strokeWidth="{1.5}"/>
                      ) : (
                        <Eye className="w-5 h-5" strokeWidth="{1.5}"/>
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-2 flex items-center gap-1.5 text-sm text-[#BA1A1A] ml-2">
                      <AlertCircle className="w-4 h-4 flex-shrink-0"/>
                      {errors.password?.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="group w-full flex items-center justify-between pl-8 pr-2 py-2 mt-4 rounded-full bg-[#BF360C] text-white font-[var(--font-be-vietnam)] font-semibold text-lg transition-all duration-500 hover:bg-[#9A2B00] active:scale-[0.98] disabled:bg-[#BF360C]/50 disabled:cursor-not-allowed shadow-lg shadow-[#BF360C]/20"
                >
                  <span className="flex-1 text-center tracking-wide">
                    {isLoading ? t("login.loggingIn") : t("login.loginButton")}
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
                <div className="w-full border-t border-[#E8D5C4]" />
                <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#FAF6F0] px-4 text-[10px] font-bold text-[#8D6E63] uppercase tracking-[0.15em]">
                  {t("login.dividerText")}
                </span>
              </div>

              <div className="flex items-center justify-center gap-4">
                <SocialButton label={t("login.socialGoogle")} disabled ariaLabelPrefix={t("login.ariaLabelPrefix")} tooltipText={t("login.comingSoon")} />
                <SocialButton label={t("login.socialApple")} disabled ariaLabelPrefix={t("login.ariaLabelPrefix")} tooltipText={t("login.comingSoon")} />
              </div>

              <div className="space-y-4 mt-8">
                <p className="text-center text-sm font-[var(--font-be-vietnam)] text-[#5D4037]">
                  <Link
                    href="/forgot-password"
                    className="text-[#BF360C] font-semibold hover:text-[#9A2B00] underline underline-offset-4 decoration-[#BF360C]/30 hover:decoration-[#BF360C] transition-all"
                  >
                    {t("login.forgotPasswordLink")}
                  </Link>
                </p>
                <p className="text-center text-sm font-[var(--font-be-vietnam)] text-[#5D4037]">
                  {t("login.noAccountText")}{" "}
                  <Link
                    href="/register"
                    className="text-[#BF360C] font-semibold hover:text-[#9A2B00] underline underline-offset-4 decoration-[#BF360C]/30 hover:decoration-[#BF360C] transition-all"
                  >
                    {t("login.registerLink")}
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