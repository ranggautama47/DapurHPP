"use client";
import Image from "next/image";
import {
  Wallet,
  ReceiptText,
  TrendingUp,
  ChefHat,
  Sparkles,
} from "lucide-react";
import { useTranslation } from "@/context/language-context";

export function HeroSection() {
  const { t } = useTranslation("auth");

  return (
    <section
      className="flex-1 flex flex-col justify-center px-6 py-16 md:py-24 overflow-x-hidden"
      aria-labelledby="hero-title"
    >
      <div className="max-w-lg mx-auto text-center md:text-left md:max-w-xl">
        <h1 id="hero-title" className="hero-title mb-6">
          {t("hero.title")}
          <br />
          <span className="text-[#FF8A00]">{t("hero.brand")}</span>
        </h1>
        <p className="text-base md:text-lg leading-relaxed text-[#6D4C41] font-[var(--font-be-vietnam)]">
          {t("hero.subtitle")}
        </p>

        <div className="mt-16 md:mt-20 flex justify-center md:justify-start">
          
          <div className="relative w-full max-w-[280px] sm:max-w-sm md:max-w-md">
            
            <div className="absolute -top-8 -right-4 md:-top-11 md:-right-6 bg-white rounded-xl md:rounded-2xl shadow-xl border border-[#F5E6D8] px-3 py-2 md:px-4 md:py-3 flex items-center gap-2 md:gap-4 z-10">
              <div className="w-8 h-8 md:w-12 md:h-12 rounded-full bg-[#FFF3E8] flex items-center justify-center shrink-0">
                <TrendingUp
                  className="w-4 h-4 md:w-5 md:h-5 text-[#FF8A00]"
                  strokeWidth={2.5}
                />
              </div>

              <div>
                <p className="text-[9px] md:text-[11px] uppercase tracking-wider text-[#8B6B5A] font-semibold">
                  {t("hero.revenueCard")}
                </p>
                <h3 className="text-lg md:text-2xl font-bold text-[#059669] tracking-tight">
                  {t("hero.revenueValue")}
                </h3>
              </div>
            </div>

            <Image
              src="/login1.png"
              alt={t("hero.brand")}
              width={500}
              height={420}
              priority
              className="w-full h-auto rounded-[24px] md:rounded-[32px] shadow-2xl border-4 md:border-8 border-white object-cover"
              draggable={false}
            />

            <div className="absolute -bottom-8 -left-4 md:-bottom-12 md:-left-6 bg-[#4E2F22] rounded-xl md:rounded-2xl shadow-2xl px-3 py-2 md:px-4 md:py-4 flex items-center gap-3 md:gap-4 z-30">
              <Image
                src="/keranjang.png"
                alt={t("hero.usersCard")}
                width={100}
                height={100}
                className="w-12 h-12 md:w-[100px] md:h-[100px] shrink-0 object-contain drop-shadow-md"
                draggable={false}
              />

              <div>
                <p className="text-white text-base md:text-xl font-bold">
                  {t("hero.usersValue")}
                </p>
                <p className="text-[#F3D4B3] text-[10px] md:text-sm">
                  {t("hero.usersCard")}
                </p>
              </div>
            </div>

          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-[#E8D5C4]">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-8 gap-y-4">
            <div className="flex items-center gap-2">
              <Wallet className="w-5 h-5 text-[#FF8A00]" />
              <span className="text-sm font-medium text-[#4E342E]">
                {t("hero.features.recordCapital")}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <ReceiptText className="w-5 h-5 text-[#FF8A00]" />
              <span className="text-sm font-medium text-[#4E342E]">
                {t("hero.features.calculateHpp")}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#FF8A00]" />
              <span className="text-sm font-medium text-[#4E342E]">
                {t("hero.features.trackProfit")}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <ChefHat className="w-5 h-5 text-[#FF8A00]" />
              <span className="text-sm font-medium text-[#4E342E]">
                {t("hero.features.umkmFnB")}
              </span>
            </div>
          </div>
        </div>
        <div className="mt-10 rounded-3xl bg-white border border-[#F5E6D8] shadow-lg p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#FFF3E8] flex items-center justify-center shrink-0">
              <Sparkles className="w-6 h-6 text-[#FF8A00]" strokeWidth={2.2} />
            </div>

            <div>
              <h3 className="font-semibold text-[#2A1711] text-lg">
                {t("hero.manageTitle")}
              </h3>
              <p className="mt-2 text-[#6D4C41] leading-relaxed text-sm sm:text-base">
                {t("hero.manageText")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}