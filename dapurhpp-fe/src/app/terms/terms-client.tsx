"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useTranslation } from "@/context/language-context";

export default function TermsClient() {
  const { t, ready } = useTranslation("landing");

  if (!ready) return null;

  const sections = t("pages.terms.sections") as { title: string; body: string; items: string[]; note?: string }[];

  return (
    <div className="min-h-screen bg-[#FFF8F6] text-[#2A1711] font-[var(--font-be-vietnam)] selection:bg-[#FF8A00]/20">
      <header className="border-b border-[#E8D5C4] sticky top-0 bg-[#FFF8F6]/80 backdrop-blur-md z-50">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-semibold text-[#79564B] hover:text-[#914c00] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {t("pages.terms.backToHome")}
          </Link>
          <span className="text-xs font-bold uppercase tracking-widest text-[#FF8A00] bg-[#FF8A00]/10 px-3 py-1 rounded-full">
            {t("pages.terms.legalBadge")}
          </span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-12 md:py-16">
        <div className="mb-12 text-center md:text-left">
          <h1 className="font-[var(--font-playfair)] font-bold text-4xl md:text-5xl tracking-tight mb-4">
            {t("pages.terms.title")}
          </h1>
          <p className="text-sm text-[#564334] italic">
            {t("pages.terms.lastUpdated")}
          </p>
        </div>

        <div className="space-y-8 text-[#2A1711] leading-relaxed text-base">
          <p className="text-lg text-[#564334]">
            {t("pages.terms.intro")}
          </p>

          {sections.map((section: { title: string; body: string; items: string[]; note?: string }, i: number) => (
            <section key={i} className="space-y-3">
              <h2 className="font-[var(--font-playfair)] font-bold text-2xl text-[#914c00]">
                {section.title}
              </h2>
              <p>{section.body}</p>
              {section.note && (
                <p className="bg-[#fff1ed] p-4 rounded-xl text-sm border-l-4 border-[#FF8A00] text-[#564334]">
                  <strong>{section.note.split(":")[0]}:</strong> {section.note.split(":").slice(1).join(":")}
                </p>
              )}
              {section.items.length > 0 && (
                <ul className="list-disc pl-6 space-y-1.5">
                  {section.items.map((item: string, j: number) => (
                    <li key={j}>{item}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>
      </main>
    </div>
  );
}
