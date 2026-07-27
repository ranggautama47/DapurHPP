"use client";

import { useState } from "react";
import { useAuthStore, User } from "@/lib/auth-store";
import { api } from "@/lib/axios";
import { AlertCircle, X, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export function VerificationBanner() {
  const { user, setUser } = useAuthStore();
  const [isSending, setIsSending] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  if (!user || user.emailVerified || dismissed) return null;

  const handleResend = async () => {
    setIsSending(true);
    try {
      await api.post("/auth/resend-verification", { email: user.email });
      toast.success("Link verifikasi baru telah dikirim ke email Anda.");
    } catch {
      toast.error("Gagal mengirim ulang. Silakan coba lagi.");
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
            Verifikasi email Anda untuk mengaktifkan semua fitur.
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleResend}
            disabled={isSending}
            className="text-xs font-semibold text-[#BF360C] hover:text-[#9A2B00] underline underline-offset-2 transition-colors disabled:opacity-50"
          >
            {isSending ? (
              <span className="flex items-center gap-1">
                <Loader2 className="w-3 h-3 animate-spin" />
                Mengirim...
              </span>
            ) : (
              "Kirim Ulang"
            )}
          </button>
          <button
            onClick={() => setDismissed(true)}
            className="p-1 rounded-full hover:bg-[#FFE2DA] transition-colors"
            aria-label="Tutup"
          >
            <X className="w-3.5 h-3.5 text-[#8A7362]" />
          </button>
        </div>
      </div>
    </div>
  );
}
