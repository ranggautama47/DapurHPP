"use client";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/context/language-context";

export function Hero() {
  const router = useRouter();
  const { t } = useTranslation("landing");
  const checklists = [
    { text: t("hero.checklist.easy"), icon: "✓" },
    { text: t("hero.checklist.accurate"), icon: "✓" },
    { text: t("hero.checklist.trusted"), icon: "✓" },
  ];

  const scrollToBenefits = () => {
    document.getElementById("benefits")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 bg-gradient-to-b from-[#FFF8F6] to-[#FFE9E4] overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#FFE2DA] rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#FFDBD1] rounded-full blur-3xl opacity-40 translate-y-1/3 -translate-x-1/4" />

      <div className="relative mx-auto max-w-[1500px] px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
{/* Badge */}
             <div className="inline-flex items-center px-4 py-2 bg-[#FFE9E4] rounded-full text-[#914c00] text-sm font-semibold">
               {t("hero.badge")}
             </div>

             {/* Headline */}
             <h1 className="font-[var(--font-playfair)] text-4xl md:text-5xl lg:text-6xl font-bold text-[#2A1711] leading-[1.15]">
               {t("hero.title")}
             </h1>

             {/* Subheadline */}
             <p className="text-[#564334] text-lg md:text-xl leading-relaxed max-w-xl">
               {t("hero.subtitle")}
             </p>

{/* CTA Buttons */}
             <div className="flex flex-wrap gap-4">
               <button
                 onClick={() => router.push("/login")}
                 className="inline-flex items-center gap-2 px-8 py-4 bg-[#FF8A00] text-white font-semibold rounded-full hover:bg-[#E67E00] hover:shadow-[0_4px_12px_rgba(255,138,0,0.3)] transition-all"
               >
                 {t("hero.buttons.startFree")}
                 <svg
                   className="w-5 h-5"
                   fill="none"
                   stroke="currentColor"
                   viewBox="0 0 24 24"
                 >
                   <path
                     strokeLinecap="round"
                     strokeLinejoin="round"
                     strokeWidth={2}
                     d="M14 5l7 7m0 0l-7 7m7-7H3"
                   />
                 </svg>
               </button>
               <button
                 onClick={scrollToBenefits}
                 className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#914c00] font-semibold rounded-full border-2 border-[#914c00] hover:bg-[#FFF8F6] transition-all"
               >
                 {t("hero.buttons.learnMore")}
                 <svg
                   className="w-5 h-5"
                   fill="none"
                   stroke="currentColor"
                   viewBox="0 0 24 24"
                 >
                   <path
                     strokeLinecap="round"
                     strokeLinejoin="round"
                     strokeWidth={2}
                     d="M19 14l-7 7m0 0l-7-7m7 7V3"
                   />
                 </svg>
               </button>
             </div>

            {/* Checklists */}
            <div className="flex flex-wrap gap-6">
              {checklists.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 text-[#2A1711]"
                >
                  <span className="w-5 h-5 bg-[#FF8A00] rounded-full flex items-center justify-center text-white text-xs font-bold">
                    {item.icon}
                  </span>
                  <span className="text-sm font-medium">{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right - Dashboard Preview */}
          <div className="relative flex justify-center items-center">
            {/* Glow Background */}
            <div className="absolute w-[520px] h-[520px] rounded-full bg-[#FF8A00]/10 blur-3xl" />

            <img
              src="/landingpage/landingpage.png"
              alt="Landing Page DapurHPP"
              draggable={false}
              className="
              relative z-10
              w-full
              max-w-[760px]
              h-auto
              drop-shadow-[0_25px_60px_rgba(0,0,0,.18)]
              pointer-events-none
              select-none
              priority
            "
            />
          </div>

          {/* Decorative Elements */}
          <div className="absolute -top-8 -right-8 w-24 h-24 bg-[#FF8A00] rounded-full opacity-10 blur-xl" />
          <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-[#914c00] rounded-full opacity-5 blur-lg" />
        </div>
      </div>
    </section>
  );
}
