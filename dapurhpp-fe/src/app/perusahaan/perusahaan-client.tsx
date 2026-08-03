"use client";

import { useTranslation } from "@/context/language-context";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/landingpage/footer";

export default function PerusahaanClient() {
  const { t, ready } = useTranslation("landing");

  if (!ready) return null;

  const paragraphs = t("pages.perusahaan.aboutUs.paragraphs") as string[];
  const positions = t("pages.perusahaan.career.positions") as { title: string; type: string; location: string; status: string; desc: string }[];

  return (
    <main className="min-h-screen bg-[#FFF8F6]">
      <Navbar />
      <div className="pt-24 pb-16 mx-auto max-w-[1200px] px-6">
        <h1 className="font-[var(--font-playfair)] font-bold text-4xl text-[#2A1711] mb-4">
          {t("pages.perusahaan.title")}
        </h1>
        <p className="text-[#564334] text-lg mb-16">
          {t("pages.perusahaan.subtitle")}
        </p>

        <section id="tentang-kami" className="mb-16">
          <h2 className="font-[var(--font-playfair)] font-bold text-2xl text-[#2A1711] mb-6">
            {t("pages.perusahaan.aboutUs.title")}
          </h2>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-4 text-[#564334] leading-relaxed">
              {paragraphs.map((p: string, i: number) => (
                <p key={i}>{p}</p>
              ))}
            </div>
            <div className="bg-[#FFE2DA] rounded-2xl aspect-video flex items-center justify-center overflow-hidden">
              <img
                src="landingpage/software-team.jpg"
                alt={t("pages.perusahaan.aboutUs.imageAlt")}
                draggable={false}
                className="object-cover pointer-events-none select-none"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </section>

        <section id="karir" className="mb-16">
          <h2 className="font-[var(--font-playfair)] font-bold text-2xl text-[#2A1711] mb-6">
            {t("pages.perusahaan.career.title")}
          </h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-2xl">
            {positions.map((job: { title: string; type: string; location: string; status: string; desc: string }) => (
              <div key={job.title} className="bg-white rounded-2xl border border-[#F5E6D8] p-6 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-lg text-[#2A1711]">{job.title}</h3>
                  <span className="text-xs font-bold bg-[#CCE8CC] text-[#2A1711] px-2 py-1 rounded-full">
                    {job.status}
                  </span>
                </div>
                <p className="text-sm text-[#564334] mb-1">{job.type} · {job.location}</p>
                <p className="text-sm text-[#564334]">{job.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="kontak">
          <h2 className="font-[var(--font-playfair)] font-bold text-2xl text-[#2A1711] mb-6">
            {t("pages.perusahaan.contact.title")}
          </h2>
          <div className="max-w-xl">
            <p className="text-sm text-[#FF8A00] font-semibold mb-4">
              {t("pages.perusahaan.contact.comingSoon")}
            </p>
            <form className="space-y-4 bg-white rounded-2xl border border-[#F5E6D8] p-6">
              <div>
                <label className="block text-sm font-medium text-[#2A1711] mb-1">
                  {t("pages.perusahaan.contact.form.nameLabel")}
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 bg-[#FFF8F6] border border-[#F5E6D8] rounded-lg text-[#2A1711] placeholder-[#8D6E63]"
                  placeholder={t("pages.perusahaan.contact.form.namePlaceholder") as string}
                  disabled
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#2A1711] mb-1">
                  {t("pages.perusahaan.contact.form.emailLabel")}
                </label>
                <input
                  type="email"
                  className="w-full px-4 py-2 bg-[#FFF8F6] border border-[#F5E6D8] rounded-lg text-[#2A1711] placeholder-[#8D6E63]"
                  placeholder={t("pages.perusahaan.contact.form.emailPlaceholder") as string}
                  disabled
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#2A1711] mb-1">
                  {t("pages.perusahaan.contact.form.messageLabel")}
                </label>
                <textarea
                  rows={4}
                  className="w-full px-4 py-2 bg-[#FFF8F6] border border-[#F5E6D8] rounded-lg text-[#2A1711] placeholder-[#8D6E63] resize-none"
                  placeholder={t("pages.perusahaan.contact.form.messagePlaceholder") as string}
                  disabled
                />
              </div>
              <button
                type="submit"
                className="w-full px-6 py-3 bg-[#FF8A00] text-white font-semibold rounded-full hover:bg-[#E67E00] transition-colors opacity-50 cursor-not-allowed"
                disabled
              >
                {t("pages.perusahaan.contact.form.submit")}
              </button>
            </form>
          </div>
        </section>
      </div>
      <Footer />
    </main>
  );
}
