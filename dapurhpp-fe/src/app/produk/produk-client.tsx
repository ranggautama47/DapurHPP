"use client";

import { useTranslation } from "@/context/language-context";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/landingpage/footer";

export default function ProdukClient() {
  const { t, ready } = useTranslation("landing");

  if (!ready) return null;

  const featureItems = t("pages.produk.features.items") as string[];
  const pricingPlans = t("pages.produk.pricing.plans") as { plan: string; price: string; desc: string }[];
  const updateItems = t("pages.produk.updates.items") as { ver: string; date: string; desc: string }[];

  return (
    <main className="min-h-screen bg-[#FFF8F6]">
      <Navbar />
      <div className="pt-24 pb-16 mx-auto max-w-[1200px] px-6">
        <h1 className="font-[var(--font-playfair)] font-bold text-4xl text-[#2A1711] mb-4">
          {t("pages.produk.title")}
        </h1>
        <p className="text-[#564334] text-lg mb-16">
          {t("pages.produk.subtitle")}
        </p>

        <section id="fitur" className="mb-16">
          <h2 className="font-[var(--font-playfair)] font-bold text-2xl text-[#2A1711] mb-6">
            {t("pages.produk.features.title")}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featureItems.map((f: string) => (
              <div key={f} className="bg-white rounded-2xl border border-[#F5E6D8] p-6 shadow-sm hover:shadow-md transition-shadow hover:border-[#CCE8CC]">
                <div className="w-10 h-10 rounded-full bg-[#FFF3E8] flex items-center justify-center mb-4">
                  <span className="text-[#FF8A00] text-lg">✦</span>
                </div>
                <h3 className="font-semibold text-[#2A1711] mb-2">{f}</h3>
                <p className="text-sm text-[#564334]">{t("pages.produk.features.itemDesc", { name: f })}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="harga" className="mb-16">
          <h2 className="font-[var(--font-playfair)] font-bold text-2xl text-[#2A1711] mb-6">
            {t("pages.produk.pricing.title")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
            {pricingPlans.map((p: { plan: string; price: string; desc: string }) => (
              <div
                key={p.plan}
                className="bg-white rounded-2xl border-2 p-6 shadow-sm"
                style={{ borderColor: p.plan === "Pro" ? "#FF8A00" : "#CCE8CC" }}
              >
                <h3 className="font-bold text-xl text-[#2A1711] mb-1">{p.plan}</h3>
                <p className="text-2xl font-bold mb-3" style={{ color: p.plan === "Pro" ? "#FF8A00" : "#CCE8CC" }}>{p.price}</p>
                <p className="text-sm text-[#564334]">{p.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="update">
          <h2 className="font-[var(--font-playfair)] font-bold text-2xl text-[#2A1711] mb-6">
            {t("pages.produk.updates.title")}
          </h2>
          <div className="space-y-4 max-w-2xl">
            {updateItems.map((u: { ver: string; date: string; desc: string }) => (
              <div key={u.ver} className="flex gap-4 p-4 bg-white rounded-2xl border border-[#F5E6D8]">
                <span className="text-xs font-bold bg-[#CCE8CC] text-[#2A1711] px-2 py-1 rounded-full h-fit">{u.ver}</span>
                <div>
                  <p className="text-xs text-[#564334] mb-1">{u.date}</p>
                  <p className="text-sm text-[#2A1711]">{u.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
      <Footer />
    </main>
  );
}
