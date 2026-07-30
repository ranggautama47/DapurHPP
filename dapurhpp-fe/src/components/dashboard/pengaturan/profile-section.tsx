"use client";

import { Save, Loader2 } from "lucide-react";
import { useTranslation } from "@/context/language-context";
import { AvatarUpload } from "./avatar-upload";

interface ProfileSectionProps {
  userName: string | undefined;
  userEmail: string;
  avatarUrl: string | null;
  isUploading: boolean;
  onAvatarSelect: (file: File) => void;
  namaLengkap: string;
  setNamaLengkap: (v: string) => void;
  namaUsaha: string;
  setNamaUsaha: (v: string) => void;
  noHp: string;
  setNoHp: (v: string) => void;
  savingProfile: boolean;
  onSimpanProfil: () => void;
}

export function ProfileSection({
  userName,
  userEmail,
  avatarUrl,
  isUploading,
  onAvatarSelect,
  namaLengkap,
  setNamaLengkap,
  namaUsaha,
  setNamaUsaha,
  noHp,
  setNoHp,
  savingProfile,
  onSimpanProfil,
}: ProfileSectionProps) {
  const { t } = useTranslation("settings");

  return (
    <section className="bg-white rounded-[24px] border border-[#DDC1AE] p-6 mb-6 shadow-[0_8px_30px_rgba(109,76,65,0.08)] hover:-translate-y-1 transition-all duration-300 ease-out">
      <h2 className="font-[var(--font-playfair)] font-bold text-2xl text-[#2A1711] mb-6">
        {t("profile.title")}
      </h2>

      <div className="flex items-center gap-5 mb-8">
        <AvatarUpload
          avatarUrl={avatarUrl}
          userName={userName || t("profile.defaultName")}
          isUploading={isUploading}
          onFileSelect={onAvatarSelect}
        />
        <div>
          <p className="font-semibold text-[#2A1711] text-lg">
            {userName || t("profile.defaultName")}
          </p>
          <p className="text-sm text-[#8A7362]">{userEmail}</p>
        </div>
      </div>

      <div className="space-y-4 max-w-2xl">
        <div>
          <label className="block text-sm font-semibold text-[#564334] mb-1.5">
            {t("profile.fullName")}
          </label>
          <input
            type="text"
            value={namaLengkap}
            onChange={(e) => setNamaLengkap(e.target.value)}
            className="w-full h-12 px-4 bg-white border border-[#DDC1AE] rounded-[16px] text-[#2A1711] placeholder-[#8A7362] focus:outline-none focus:ring-2 focus:ring-[#FF8A00] focus:border-transparent transition-all duration-200"
            placeholder={t("profile.fullNamePlaceholder")}
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-[#564334] mb-1.5">
            {t("profile.businessName")}
          </label>
          <input
            type="text"
            value={namaUsaha}
            onChange={(e) => setNamaUsaha(e.target.value)}
            className="w-full h-12 px-4 bg-white border border-[#DDC1AE] rounded-[16px] text-[#2A1711] placeholder-[#8A7362] focus:outline-none focus:ring-2 focus:ring-[#FF8A00] focus:border-transparent transition-all duration-200"
            placeholder={t("profile.businessNamePlaceholder")}
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-[#564334] mb-1.5">
            {t("profile.phoneNumber")}{" "}
            <span className="text-[#8A7362] font-normal">{t("profile.optional")}</span>
          </label>
          <input
            type="tel"
            value={noHp}
            onChange={(e) => setNoHp(e.target.value)}
            className="w-full h-12 px-4 bg-white border border-[#DDC1AE] rounded-[16px] text-[#2A1711] placeholder-[#8A7362] focus:outline-none focus:ring-2 focus:ring-[#FF8A00] focus:border-transparent transition-all duration-200"
            placeholder={t("profile.phoneNumberPlaceholder")}
          />
        </div>
        <button
          onClick={onSimpanProfil}
          disabled={savingProfile}
          className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-[#FF8A00] text-white font-semibold hover:bg-[#E67E00] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 shadow-[0_10px_30px_rgba(255,138,0,0.25)] focus:outline-none focus:ring-2 focus:ring-[#FF8A00] focus:ring-offset-2"
        >
          {savingProfile ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {t("profile.saveButton")}
        </button>
      </div>
    </section>
  );
}