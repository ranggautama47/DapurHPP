"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/axios";
import { AlertCircle, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "@/context/language-context";

export function VerificationBanner({ user }: { user: {
    id: number;
    name: string;
    email: string;
    emailVerified: boolean;
    namaUsaha: string | null;
    nomorHp: string | null;
    fontSize: string;
    notifAplikasi: boolean;
    notifStok: boolean;
    notifPenjualan: boolean;
    avatarUrl: string | null;
    createdAt: string;
    updatedAt: string;
  } | null }) {
  const { t } = useTranslation("dashboard");
  const [isSending, setIsSending] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setInterval(() => {
        setCooldown((c) => c - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [cooldown]);

  if (!user || user.emailVerified || dismissed) return null;

  const handleResend = async () => {
    setIsSending(true);
    try {
      await api.post("/auth/resend-verification", { email: user.email });
      toast.success(t("verification.success"));
      setCooldown(60); // 60 detik cooldown
    } catch {
      toast.error(t("verification.error"));
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="mx-6 mb-2">
      <div className="flex items-center justify-between gap-3 px-4 py-3 bg-[#FFF8F0] border border-[#FFB74D]/40 rounded-xl text-sm">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-[#FF8A00] flex-shrink-0" />
          <span className="text-[#5D4037] font-[var(--font-be-vietnam)]">
            {t("verification.notice")}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleResend}
            disabled={isSending || cooldown > 0}
            className="text-xs font-semibold text-[#BF360C] hover:text-[#9A2B00] underline underline-offset-2 transition-colors disabled:opacity-50"
          >
            {isSending ? (
              <span className="flex items-center gap-1">
                <Loader2 className="w-3 h-3 animate-spin" />
                {t("verification.sending")}
              </span>
            ) : cooldown > 0 ? (
              `Tunggu (${cooldown}s) ${t("verification.resend")}`
            ) : (
              t("verification.resend")
            )}
          </button>
          <button
            onClick={() => setDismissed(true)}
            className="p-1 rounded-full hover:bg-[#FFE2DA] transition-colors"
            aria-label={t("verification.close")}
          >
            <X className="w-3.5 h-3.5 text-[#8A7362]" />
          </button>
        </div>
      </div>
    </div>
  );
}