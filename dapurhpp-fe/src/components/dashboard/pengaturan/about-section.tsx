
"use client";

import { LogOut } from "lucide-react";
import { useTranslation } from "@/context/language-context";

interface AboutSectionProps {
  onLogout: () => void;
}

export function AboutSection({ onLogout }: AboutSectionProps) {
  const { t } = useTranslation("settings");

  return (
    <section className="bg-white rounded-[24px] border border-[#DDC1AE] p-6 shadow-[0_8px_30px_rgba(109,76,65,0.08)] hover:-translate-y-1 transition-all duration-300 ease-out">
      <h2 className="font-[var(--font-playfair)] font-bold text-2xl text-[#2A1711] mb-6">
        {t("about.title")}
      </h2>

      <div className="space-y-0 max-w-xl">
        <div className="flex items-center justify-between py-2">
          <span className="text-[#564334]">{t("about.appVersion")}</span>
          <span className="font-semibold text-[#2A1711]">v1.3.0</span>
        </div>

        <div className="border-t border-[#EFE3D7]" />

        <div className="flex items-center justify-between py-2">
          <span className="text-[#564334]">{t("about.developer")}</span>
          <a
            href="https://github.com/ranggautama47"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-[#FF8A00] hover:text-[#E67E00] transition-colors duration-200"
          >
            @ranggautama
          </a>
        </div>

        <div className="border-t border-[#EFE3D7]" />

        <div className="pt-3">
          <button
            onClick={onLogout}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-[#BA1A1A] font-semibold hover:bg-[#FFF8F6] active:scale-[0.98] transition-all duration-200 border border-[#F4ACB7] focus:outline-none focus:ring-2 focus:ring-[#BA1A1A] focus:ring-offset-2"
          >
            <LogOut className="w-4 h-4" />
            {t("about.logoutButton")}
          </button>
        </div>
      </div>
    </section>
  );
}