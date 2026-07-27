"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/axios";
import { AlertCircle, CheckCircle2, Loader2, ArrowUpRight, Mail } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { HeroSection } from "@/components/hero-section";
import { Footer } from "@/components/footer";

type VerifyStatus = "loading" | "success" | "error";

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<VerifyStatus>("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      setStatus("error");
      setMessage("Token verifikasi tidak ditemukan di URL.");
      return;
    }

    api
      .post("/auth/verify-email", { token })
      .then((res) => {
        setStatus("success");
        setMessage(res.data?.message || "Email berhasil diverifikasi!");
      })
      .catch((err) => {
        setStatus("error");
        setMessage(
          err.response?.data?.message || "Token tidak valid atau sudah kedaluwarsa."
        );
      });
  }, [searchParams]);

  return (
    <div className="w-full max-w-md mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]">
      <div className="bg-white/95 backdrop-blur-sm p-2 sm:p-3 md:p-4 rounded-[3rem] shadow-2xl border border-white/40">
        <div className="bg-[#2A1711] rounded-[2.5rem] shadow-inner relative z-10 overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#FF8A00] via-[#BF360C] to-[#FF8A00]" />
          <div className="p-4 md:p-5">
            <div className="bg-[#FAF6F0] rounded-[2rem] border border-[#EADAC9] px-6 py-10 md:p-8 relative">
              <div className="space-y-6 relative z-10 text-center">
                {status === "loading" && (
                  <>
                    <div className="w-16 h-16 rounded-full bg-[#FFE2DA] flex items-center justify-center mx-auto">
                      <Loader2 className="w-8 h-8 text-[#BF360C] animate-spin" />
                    </div>
                    <h2 className="font-[var(--font-playfair)] font-bold text-[1.75rem] leading-[2.25rem] text-[#2A1711]">
                      Memverifikasi Email...
                    </h2>
                    <p className="text-[#5D4037] font-[var(--font-be-vietnam)] text-base">
                      Harap tunggu sebentar...
                    </p>
                  </>
                )}

                {status === "success" && (
                  <>
                    <div className="w-16 h-16 rounded-full bg-[#E8F5E9] flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-8 h-8 text-[#2E7D32]" />
                    </div>
                    <h2 className="font-[var(--font-playfair)] font-bold text-[1.75rem] leading-[2.25rem] text-[#2A1711]">
                      Email Terverifikasi!
                    </h2>
                    <p className="text-[#5D4037] font-[var(--font-be-vietnam)] text-base">
                      {message}
                    </p>
                    <button
                      onClick={() => router.push("/login")}
                      className="group w-full flex items-center justify-between pl-8 pr-2 py-2 mt-4 rounded-full bg-[#BF360C] text-white font-[var(--font-be-vietnam)] font-semibold text-lg transition-all duration-500 hover:bg-[#9A2B00] shadow-lg shadow-[#BF360C]/20"
                    >
                      <span className="flex-1 text-center tracking-wide">
                        Masuk ke Dashboard
                      </span>
                      <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-[#2A1711]">
                        <ArrowUpRight strokeWidth={2.5} className="w-5 h-5 text-white" />
                      </div>
                    </button>
                  </>
                )}

                {status === "error" && (
                  <>
                    <div className="w-16 h-16 rounded-full bg-[#FFEBEE] flex items-center justify-center mx-auto">
                      <AlertCircle className="w-8 h-8 text-[#C62828]" />
                    </div>
                    <h2 className="font-[var(--font-playfair)] font-bold text-[1.75rem] leading-[2.25rem] text-[#2A1711]">
                      Verifikasi Gagal
                    </h2>
                    <p className="text-[#5D4037] font-[var(--font-be-vietnam)] text-base">
                      {message}
                    </p>
                    <Link
                      href="/resend-verification"
                      className="group w-full flex items-center justify-between pl-8 pr-2 py-2 mt-4 rounded-full bg-[#BF360C] text-white font-[var(--font-be-vietnam)] font-semibold text-lg transition-all duration-500 hover:bg-[#9A2B00] shadow-lg shadow-[#BF360C]/20"
                    >
                      <span className="flex-1 text-center tracking-wide">
                        Kirim Ulang Verifikasi
                      </span>
                      <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-[#2A1711]">
                        <ArrowUpRight strokeWidth={2.5} className="w-5 h-5 text-white" />
                      </div>
                    </Link>
                    <p className="mt-4 text-sm font-[var(--font-be-vietnam)] text-[#5D4037]">
                      Atau <Link href="/login" className="text-[#BF360C] font-semibold hover:text-[#9A2B00] underline underline-offset-4 decoration-[#BF360C]/30 hover:decoration-[#BF360C] transition-all">kembali ke login</Link>
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
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
              <VerifyEmailContent />
            </Suspense>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
