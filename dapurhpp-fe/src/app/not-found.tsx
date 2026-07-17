"use client";

import Image from "next/image";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#FFF8F6] px-6">
      {/* Background */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,#FF8A00_1px,transparent_1px)] [background-size:36px_36px]" />

      {/* Content */}
      <div className="relative z-10 flex w-full max-w-6xl items-center justify-between gap-16">
        {/* Left */}
        <div className="max-w-xl">
          <h1 className="text-[130px] font-black leading-none text-[#FF8A00]">
            404
          </h1>

          <h2 className="mt-3 text-5xl font-bold text-[#2A1711]">
            Ups, halaman tidak ditemukan!
          </h2>

          <p className="mt-6 text-xl leading-9 text-gray-600">
            Sepertinya resep yang kamu cari
            <br />
            sudah dihapus atau belum dibuat.
          </p>

          <a
            href="/dashboard"
            className="mt-10 inline-flex items-center gap-3 rounded-xl bg-[#FF8A00] px-7 py-4 text-lg font-semibold text-white transition hover:bg-[#E67E00]"
          >
            <Home size={24} />
            Kembali ke Dashboard
          </a>
        </div>

        {/* Right */}
        <div className="relative">
          <Image
            src="/loading/panci-404.png"
            alt="404 Pot"
            width={460}
            height={460}
            priority
            draggable={false}
            className="
            select-none
            pointer-events-none
            animate-bounce
            "
          />
        </div>
      </div>
    </main>
  );
}
