"use client";

import { CheckCircle2 } from "lucide-react";
import Image from "next/image";

const benefits = [
  {
    title: "Dirancang untuk UMKM Gorengan",
    description: "Fitur khusus yang sesuai dengan kebutuhan usaha gorengan",
  },
  {
    title: "Hitung Otomatis, Keputusan Lebih Cepat",
    description: "Semua perhitungan dilakukan otomatis, hemat waktu dan tenaga",
  },
  {
    title: "Pantau Usaha Kapan Saja",
    description: "Akses data usaha Anda kapan saja dan dari mana saja",
  },
];

export function Benefits() {
  return (
    <section
      id="benefits"
      className="py-16 md:py-24 bg-gradient-to-b from-[#FFF8F6] to-[#FFE9E4] overflow-hidden"
    >
      <div className="mx-auto max-w-[1500px] px-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          
          {/* Left - Illustration */}
          <div className="relative flex justify-center items-center px-4 sm:px-8 w-full">
            {/* Glow */}
            <div className="absolute w-[260px] h-[260px] sm:w-[420px] sm:h-[420px] rounded-full bg-[#FF8A00]/10 blur-3xl" />

            {/* Wrapper Image dengan margin tambahan di mobile agar kartu aman */}
            <div className="relative z-10 w-full max-w-[540px] md:max-w-[620px] my-4">
              <Image
                src="/landingpage/landingpage2.png"
                alt="UMKM Gorengan menggunakan DapurHPP"
                width={620}
                height={520}
                priority
                draggable={false}
                className="
                  w-full
                  h-auto
                  select-none
                  pointer-events-none
                  drop-shadow-[0_15px_35px_rgba(0,0,0,.12)]
                  md:drop-shadow-[0_25px_60px_rgba(0,0,0,.16)]
                "
              />

              {/* Floating Card Atas (Laba Hari Ini) */}
              <div
                className="
                  absolute
                  -top-2 -left-2
                  sm:top-6 sm:-left-6 
                  md:-left-12
                  bg-white
                  rounded-xl sm:rounded-2xl
                  shadow-md sm:shadow-xl
                  border border-[#F3E6DA]
                  px-2.5 py-1.5
                  sm:px-5 sm:py-4
                  transition-all duration-300
                "
              >
                <p className="text-[9px] sm:text-xs uppercase tracking-wide text-[#8B6B5A] font-semibold">
                  Laba Hari Ini
                </p>
                <h3 className="mt-0.5 text-sm sm:text-2xl font-bold text-[#22C55E] leading-none">
                  Rp180K
                </h3>
                <p className="mt-0.5 text-[9px] sm:text-sm text-[#6D4C41]">
                  Profit Bersih
                </p>
              </div>

              {/* Floating Card Bawah (Penjualan) */}
              <div
                className="
                  absolute
                  -bottom-2 -right-2
                  sm:bottom-6 sm:-right-6 
                  md:-right-12
                  bg-white
                  rounded-xl sm:rounded-2xl
                  shadow-md sm:shadow-xl
                  border border-[#F3E6DA]
                  px-2.5 py-1.5
                  sm:px-5 sm:py-4
                  transition-all duration-300
                "
              >
                <p className="text-[9px] sm:text-xs uppercase tracking-wide text-[#8B6B5A] font-semibold">
                  Penjualan
                </p>
                <h3 className="mt-0.5 text-sm sm:text-2xl font-bold text-[#FF8A00] leading-none">
                  Rp430K
                </h3>
                <p className="mt-0.5 text-[9px] sm:text-sm text-[#6D4C41]">
                  Hari Ini
                </p>
              </div>
            </div>
          </div>

          {/* Right - Content */}
          <div className="space-y-8">
            <h2 className="font-[var(--font-playfair)] text-3xl md:text-4xl font-bold text-[#2A1711] mb-4">
              Mengapa Memilih <span className="text-[#FF8A00]">DapurHPP?</span>
            </h2>

            <div className="space-y-6">
              {benefits.map((benefit, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="flex-shrink-0 mt-1">
                    <CheckCircle2 className="w-6 h-6 text-[#FF8A00]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#2A1711] text-lg mb-1">
                      {benefit.title}
                    </h3>
                    <p className="text-[#564334] leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}