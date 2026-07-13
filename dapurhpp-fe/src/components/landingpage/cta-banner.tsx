"use client";

import { Rocket, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

export function CtaBanner() {
  const router = useRouter();
  return (
    // Latar belakang luar menggunakan warna Cokelat Gelap Solid untuk kesan premium
    <section className="py-16 bg-[#2A1711]">
      <div className="mx-auto max-w-[1500px] px-6">
        {/* Kartu putih bersih dengan bayangan lembut ambient sesuai DESIGN.md */}
        <div className="bg-white rounded-[2rem] p-8 md:p-12 shadow-[0_8px_30px_rgba(109,76,65,0.08)] border border-[#E8D5C4]/30">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            
            {/* Konten Kiri */}
            <div className="flex-1 text-center lg:text-left">
              <div className="flex flex-col sm:flex-row items-center lg:items-start justify-center lg:justify-start gap-3 mb-3">
                <div className="p-2 bg-[#FF8A00]/10 rounded-xl flex items-center justify-center">
                  <Rocket className="w-7 h-7 text-[#FF8A00]" />
                </div>
                <h2 className="font-[var(--font-playfair)] text-2xl md:text-3xl lg:text-4xl font-bold text-[#2A1711] tracking-tight leading-tight">
                  Siap Mengelola Usaha Gorengan Anda Lebih Baik?
                </h2>
              </div>
              <p className="font-[var(--font-be-vietnam)] text-[#564334] text-base md:pl-12">
                Mulai sekarang gratis. Tidak perlu kartu kredit.
              </p>
            </div>

            {/* Tombol Kanan (Aksen Emas + Teks Cokelat sesuai aturan DESIGN.md) */}
            <div className="flex-shrink-0 w-full sm:w-auto">
              <button onClick={() => router.push("/login")} className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#FF8A00] text-[#2A1711] font-[var(--font-be-vietnam)] font-bold text-base px-8 py-4 rounded-full shadow-lg shadow-[#FF8A00]/20 hover:bg-[#E07A00] transition-all duration-300 active:scale-[0.98]">
                Mulai Gratis Sekarang
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}