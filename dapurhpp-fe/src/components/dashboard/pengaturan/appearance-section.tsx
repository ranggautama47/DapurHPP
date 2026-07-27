"use client";

import {  Globe } from "lucide-react";

interface AppearanceSectionProps {
  fontSize: string;
  onFontSizeChange: (size: string) => void;
}

export function AppearanceSection({ fontSize, onFontSizeChange }: AppearanceSectionProps) {
  return (
    <section className="bg-white rounded-[24px] border border-[#DDC1AE] p-6 shadow-[0_8px_30px_rgba(109,76,65,0.08)] hover:-translate-y-1 transition-all duration-300 ease-out">
      <h2 className="font-[var(--font-playfair)] font-bold text-2xl text-[#2A1711] mb-6">
        Tampilan
      </h2>

      <div className="mb-6">
        <label className="block text-sm font-semibold text-[#564334] mb-3">
          Ukuran Font
        </label>
        <div className="inline-flex bg-[#FFF8F6] rounded-full p-1 border border-[#DDC1AE]">
          {["kecil", "sedang", "besar"].map((size) => (
            <button
              key={size}
              onClick={() => onFontSizeChange(size)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#FF8A00] focus:ring-offset-1 ${
                fontSize === size
                  ? "bg-[#FF8A00] text-white shadow-sm"
                  : "text-[#564334] hover:bg-[#FFE9E4]"
              }`}
            >
              {size.charAt(0).toUpperCase() + size.slice(1)}
            </button>
          ))}
        </div>
      </div>

     

      <div>
        <div className="flex items-center gap-2 mb-1.5">
          <Globe className="w-4 h-4 text-[#564334]" />
          <span className="text-sm font-semibold text-[#564334]">
            Bahasa
          </span>
        </div>
        <div className="relative">
          <select
            disabled
            className="w-full h-12 px-4 bg-[#FFF8F6] border border-[#DDC1AE] rounded-[16px] text-[#564334] opacity-60 cursor-not-allowed appearance-none"
          >
            <option>Bahasa Inggris</option>
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <span className="text-[10px] bg-[#FFE9E4] text-[#FF8A00] px-2 py-0.5 rounded-full font-semibold whitespace-nowrap">
              Segera Hadir
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}