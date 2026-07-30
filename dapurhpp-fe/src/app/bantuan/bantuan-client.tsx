"use client";

import { useTranslation } from "@/context/language-context";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/landingpage/footer";

export default function BantuanPage() {
  const { t, ready } = useTranslation("landing");

  if (!ready) return null;

  const categories = t("pages.bantuan.helpCenter.categories") as { title: string; desc: string }[];
  const steps = t("pages.bantuan.guides.steps") as string[];
  const faqItems = t("pages.bantuan.faq.items") as { q: string; a: string }[];

  return (
    <main className="min-h-screen bg-[#FFF8F6]">
      <Navbar />
      <div className="pt-24 pb-16 mx-auto max-w-[1200px] px-6">
        <h1 className="font-[var(--font-playfair)] font-bold text-4xl text-[#2A1711] mb-4">
          {t("pages.bantuan.title")}
        </h1>
        <p className="text-[#564334] text-lg mb-16">
          {t("pages.bantuan.subtitle")}
        </p>

        <section id="pusat-bantuan" className="mb-16">
          <h2 className="font-[var(--font-playfair)] font-bold text-2xl text-[#2A1711] mb-6">
            {t("pages.bantuan.helpCenter.title")}
          </h2>
          <div className="max-w-2xl mb-8">
            <input
              type="search"
              placeholder={t("pages.bantuan.helpCenter.searchPlaceholder") as string}
              className="w-full px-6 py-4 bg-white border border-[#F5E6D8] rounded-full text-[#2A1711] placeholder-[#8D6E63] focus:outline-none focus:border-[#FF8A00] focus:ring-2 focus:ring-[#FF8A00]/20"
              disabled
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {categories.map((cat: { title: string; desc: string }) => (
              <div key={cat.title} className="bg-white rounded-2xl border border-[#F5E6D8] p-6 hover:border-[#CCE8CC] transition-colors">
                <h3 className="font-bold text-lg text-[#2A1711] mb-2">{cat.title}</h3>
                <p className="text-sm text-[#564334]">{cat.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="panduan" className="mb-16">
          <h2 className="font-[var(--font-playfair)] font-bold text-2xl text-[#2A1711] mb-6">
            {t("pages.bantuan.guides.title")}
          </h2>
          <ol className="space-y-4 max-w-2xl">
            {steps.map((step: string, i: number) => (
              <li key={i} className="flex gap-4 p-4 bg-white rounded-2xl border border-[#F5E6D8]">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[#FFF3E8] text-[#FF8A00] font-bold flex items-center justify-center text-lg">
                  {i + 1}
                </span>
                <p className="text-[#564334] leading-relaxed pt-1">{step}</p>
              </li>
            ))}
          </ol>
        </section>

        <section id="faq">
          <h2 className="font-[var(--font-playfair)] font-bold text-2xl text-[#2A1711] mb-6">
            {t("pages.bantuan.faq.title")}
          </h2>
          <div className="space-y-3 max-w-2xl">
            {faqItems.map((faq: { q: string; a: string }, i: number) => (
              <details key={i} className="group bg-white rounded-2xl border border-[#F5E6D8] overflow-hidden">
                <summary className="flex items-center justify-between p-5 cursor-pointer list-none">
                  <p className="font-semibold text-[#2A1711] pr-8">{faq.q}</p>
                  <span className="flex-shrink-0 w-5 h-5 text-[#FF8A00] transition-transform group-open:rotate-180">▼</span>
                </summary>
                <div className="px-5 pb-5 border-t border-[#F5E6D8] text-[#564334] leading-relaxed">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </section>
      </div>
      <Footer />
    </main>
  );
}