import type { Metadata } from "next";
import { BookOpen, TrendingUp } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { RegisterForm } from "@/components/auth/register-form";
import { Footer } from "@/components/footer";
import { Wallet, Percent } from "lucide-react";
import Image from "next/image";


export const metadata: Metadata = {
  title: "DapurHPP - Register",
  description: "Daftar akun DapurHPP untuk mulai mengelola bisnis kuliner Anda",
};

export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-[#FFF8F6]">
      <Navbar />

      <div className="pt-16 min-h-screen flex items-center">
        <div className="mx-auto max-w-[1200px] w-full px-6 py-12 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* ── Hero (kiri di desktop, atas di mobile) ── */}
          <section className="order-1 lg:order-1">
            <div className="hidden lg:flex items-center gap-2 mb-6">
              <Image src="/favicon.ico" alt="Logo" width={56} height={56} draggable={"false"}/>
              <span className="font-[var(--font-playfair)] font-bold text-xl text-[#2A1711]">
                DapurHPP
              </span>
            </div>

            <h1 className="font-[var(--font-playfair)] font-bold text-[1.75rem] leading-[2.25rem] md:text-[2.5rem] md:leading-[3rem] text-[#2A1711]">
              DapurHPP: Transformasikan{" "}
              <span className="text-[#914C00]">Bisnis Kuliner</span> Anda
            </h1>

            <p className="mt-4 font-[var(--font-be-vietnam)] text-base leading-relaxed text-[#564334]">
              Daftar sekarang dan nikmati kemudahan menghitung hpp, modal, dan kreasi, biarkan kami yang mengelola angka. 
            </p>

            {/* Illustration */}
            <div className="relative mt-8">
              {/* Floating Card Atas */}
              <div className="absolute -top-4 right-2 sm:right-4 md:right-6 z-20 bg-[#FF8A00] rounded-full px-4 py-2 shadow-[0_8px_24px_rgba(255,138,0,0.35)] text-center">
                <p className="font-[var(--font-playfair)] font-bold text-lg leading-none text-white tracking-tight">
                  +24%
                </p>

                <p className="text-[9px] font-semibold uppercase tracking-wide text-white/90">
                  Profit Margin
                </p>
              </div>

              {/* Gambar */}
              <Image
                src="/register1.png"
                alt="Ilustrasi Register DapurHPP"
                width={700}
                height={500}
                priority
                className="w-full rounded-[28px] border-8 border-white shadow-2xl"
                draggable={"false"}
              />

              {/* Floating Card Bawah */}
              <div
                className="
                absolute
                -bottom-8
                left-4
                sm:left-6
                md:left-8
                z-20

                w-[220px]
                sm:w-[250px]

                rounded-2xl
                border
                border-[#F5E6D8]
                bg-white

                px-5
                py-4

                shadow-[0_20px_50px_rgba(0,0,0,.12)]
              "
              >
                <div className="flex justify-between">
                  {/* HPP */}
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-full bg-[#FFF3E8] flex items-center justify-center">
                      <Wallet className="w-4 h-4 text-[#FF8A00]" />
                    </div>

                    <div>
                      <p className="text-[11px] uppercase tracking-wide text-[#8B6B5A] font-semibold">
                        HPP
                      </p>

                      <h3 className="mt-1 text-lg sm:text-xl font-bold text-[#2A1711]">
                        Rp90K
                      </h3>
                    </div>
                  </div>

                  {/* Margin */}
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-full bg-[#EAFBF3] flex items-center justify-center">
                      <Percent className="w-4 h-4 text-[#059669]" />
                    </div>

                    <div className="text-right">
                      <p className="text-[11px] uppercase tracking-wide text-[#8B6B5A] font-semibold">
                        Margin
                      </p>

                      <h3 className="mt-1 text-lg sm:text-xl font-bold text-[#059669]">
                        13%
                      </h3>
                    </div>
                  </div>
                </div>

                <div className="mt-4 border-t border-[#EFE3D7] pt-3 flex items-center justify-between">
                  <span className="text-sm text-[#8B6B5A]">Margin Bersih</span>

                  <span className="text-lg font-bold text-[#FF8A00]">
                    9.77%
                  </span>
                </div>
              </div>
            </div>

            {/* Feature points */}
            <div className="mt-20 md:mt-24 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-[#FFE2DA] flex items-center justify-center flex-shrink-0">
                  <BookOpen className="w-4.5 h-4.5 text-[#914C00]" />
                </div>
                <div>
                  <p className="font-[var(--font-playfair)] font-semibold text-sm text-[#2A1711]">
                    Manajemen Resep Digital
                  </p>
                  <p className="mt-1 text-xs text-[#564334] leading-relaxed">
                    Standardisasi biaya produksi dengan satu dasbor terpusat.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-[#FFE2DA] flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-4.5 h-4.5 text-[#914C00]" />
                </div>
                <div>
                  <p className="font-[var(--font-playfair)] font-semibold text-sm text-[#2A1711]">
                    Analisis Margin Otomatis
                  </p>
                  <p className="mt-1 text-xs text-[#564334] leading-relaxed">
                    Laporan HPP akurat tiap kali harga bahan baku berubah.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* ── Form (kanan di desktop, bawah di mobile) ── */}
          <section className="order-2 lg:order-2">
            <RegisterForm />
          </section>
        </div>
      </div>
      <Footer />
    </main>
  );
}
