"use client";

import { Globe, Info } from "lucide-react";
import { useTranslation } from "@/context/language-context";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

interface AppearanceSectionProps {
  fontSize: string;
  onFontSizeChange: (size: string) => void;
}
// Mapping antara nilai data backend dengan key i18n UI
const FONT_SIZE_OPTIONS = [
  { value: "kecil", key: "small" },
  { value: "sedang", key: "medium" },
  { value: "besar", key: "large" },
] as const;

export function AppearanceSection({
  fontSize,
  onFontSizeChange,
}: AppearanceSectionProps) {
  const { t, language, setLanguage } = useTranslation("settings");

  return (
    <section className="bg-white rounded-[24px] border border-[#DDC1AE] p-6 shadow-[0_8px_30px_rgba(109,76,65,0.08)] hover:-translate-y-1 transition-all duration-300 ease-out">
      <h2 className="font-[var(--font-playfair)] font-bold text-2xl text-[#2A1711] mb-6">
        {t("appearance.title")}
      </h2>

      <div className="mb-6">
        <label className="block text-sm font-semibold text-[#564334] mb-3">
          {t("appearance.fontSize")}
        </label>
        <div className="inline-flex bg-[#FFF8F6] rounded-full p-1 border border-[#DDC1AE]">
          {FONT_SIZE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => onFontSizeChange(opt.value)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#FF8A00] focus:ring-offset-1 ${
                fontSize === opt.value
                  ? "bg-[#FF8A00] text-white shadow-sm"
                  : "text-[#564334] hover:bg-[#FFE9E4]"
              }`}
            >
              {t(`appearance.fontSizeOptions.${opt.key}`)}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-1.5">
          <Globe className="w-4 h-4 text-[#564334]" />
          <span className="text-sm font-semibold text-[#564334]">
            {t("appearance.language")}
          </span>
          <Popover>
            <PopoverTrigger asChild>
              <button
                type="button"
                className="p-1 rounded-full hover:bg-[#FFE9E4] text-[#FF8A00] transition-colors"
                aria-label={t("common.labels.info", { defaultValue: "Info" })}
              >
                <Info className="w-4 h-4" />
              </button>
            </PopoverTrigger>
            <PopoverContent side="top" align="start" className="w-80">
              <p className="text-sm text-[#564334] leading-relaxed">
                {t("appearance.ugcExplanation")}
              </p>
            </PopoverContent>
          </Popover>
        </div>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value as "id" | "en")}
          className="w-full h-12 px-4 bg-[#FFF8F6] border border-[#DDC1AE] rounded-[16px] text-[#564334] appearance-none focus:outline-none focus:ring-2 focus:ring-[#FF8A00] focus:border-transparent"
        >
          <option value="id">{t("appearance.languageOptions.id")}</option>
          <option value="en">{t("appearance.languageOptions.en")}</option>
        </select>
      </div>
    </section>
  );
}
