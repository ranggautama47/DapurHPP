"use client";

import { useState } from "react";
import {
  Mail,
  Eye,
  EyeOff,
  Loader2,
  ShieldCheck,
  MailCheck,
  KeyRound,
  LogIn,
  CalendarDays,
  CheckCircle2,
} from "lucide-react";
import { useTranslation } from "@/context/language-context";

interface SecuritySectionProps {
  userEmail: string;
  passwordSaatIni: string;
  setPasswordSaatIni: (v: string) => void;
  passwordBaru: string;
  setPasswordBaru: (v: string) => void;
  konfirmasiPassword: string;
  setKonfirmasiPassword: (v: string) => void;
  showCurrentPw: boolean;
  setShowCurrentPw: (v: boolean) => void;
  showNewPw: boolean;
  setShowNewPw: (v: boolean) => void;
  showConfirmPw: boolean;
  setShowConfirmPw: (v: boolean) => void;
  updatingPassword: boolean;
  onUpdatePassword: () => void;
  editingEmail: boolean;
  setEditingEmail: (v: boolean) => void;
  newEmail: string;
  setNewEmail: (v: string) => void;
  updatingEmail: boolean;
  onUpdateEmail: () => void;
  emailCurrentPassword: string;
  setEmailCurrentPassword: (v: string) => void;
  emailVerified: boolean;
  emailVerifiedAt: string | null;
  passwordChangedAt: string | null;
  lastLoginAt: string | null;
  createdAt: string;
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return (
    d.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }) + " WIB"
  );
}

export function SecuritySection({
  userEmail,
  passwordSaatIni,
  setPasswordSaatIni,
  passwordBaru,
  setPasswordBaru,
  konfirmasiPassword,
  setKonfirmasiPassword,
  showCurrentPw,
  setShowCurrentPw,
  showNewPw,
  setShowNewPw,
  showConfirmPw,
  setShowConfirmPw,
  updatingPassword,
  onUpdatePassword,
  editingEmail,
  setEditingEmail,
  newEmail,
  setNewEmail,
  updatingEmail,
  onUpdateEmail,
  emailCurrentPassword,
  setEmailCurrentPassword,
  emailVerified,
  emailVerifiedAt,
  passwordChangedAt,
  lastLoginAt,
  createdAt,
}: SecuritySectionProps) {
  const { t } = useTranslation("settings");
  const [showEmailCurrentPw, setShowEmailCurrentPw] = useState(false);

  return (
    <section className="bg-white rounded-[24px] border border-[#DDC1AE] p-6 shadow-[0_8px_30px_rgba(109,76,65,0.08)] hover:-translate-y-1 transition-all duration-300 ease-out">
      <h2 className="font-[var(--font-playfair)] font-bold text-2xl text-[#2A1711] mb-6">
        {t("security.title")}
      </h2>

      <div className="mb-4">
        <label className="block text-sm font-semibold text-[#564334] mb-1.5">
          {t("security.email.label")}
        </label>
        {editingEmail ? (
          <div className="space-y-2">
            <div className="relative">
              <input
                type={showEmailCurrentPw ? "text" : "password"}
                value={emailCurrentPassword}
                onChange={(e) => setEmailCurrentPassword(e.target.value)}
                placeholder={t("security.email.currentPasswordPlaceholder")}
                className="w-full h-12 px-4 pr-12 bg-white border border-[#DDC1AE] rounded-[16px] text-[#2A1711] placeholder-[#8A7362] focus:outline-none focus:ring-2 focus:ring-[#FF8A00] focus:border-transparent transition-all duration-200 text-sm"
                disabled={updatingEmail}
              />
              <button
                type="button"
                onClick={() => setShowEmailCurrentPw(!showEmailCurrentPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8A7362] hover:text-[#564334] transition-colors duration-200"
                tabIndex={-1}
              >
                {showEmailCurrentPw ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A7362]" />
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder={t("security.email.newEmailPlaceholder")}
                className="w-full h-12 pl-11 pr-4 bg-white border border-[#DDC1AE] rounded-[16px] text-[#2A1711] placeholder-[#8A7362] focus:outline-none focus:ring-2 focus:ring-[#FF8A00] focus:border-transparent transition-all duration-200 text-sm"
                disabled={updatingEmail}
              />
            </div>
            <div className="flex items-center gap-2 justify-end">
              <button
                type="button"
                onClick={() => setEditingEmail(false)}
                disabled={updatingEmail}
                className="px-4 h-9 rounded-full border border-[#DDC1AE] text-[#564334] text-xs font-semibold hover:bg-[#FFF8F6] transition-colors"
              >
                {t("security.email.cancelButton")}
              </button>
              <button
                type="button"
                onClick={onUpdateEmail}
                disabled={updatingEmail}
                className="px-4 h-9 rounded-full bg-[#FF8A00] text-white text-xs font-semibold hover:bg-[#E67E00] transition-colors inline-flex items-center gap-1.5 disabled:opacity-60"
              >
                {updatingEmail ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    {t("security.email.savingText")}
                  </>
                ) : (
                  t("security.email.saveButton")
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between bg-[#FFF8F6] border border-[#DDC1AE] rounded-[16px] px-4 h-12">
            <div className="flex items-center gap-2 min-w-0">
              <Mail className="w-4 h-4 text-[#8A7362] shrink-0" />
              <span className="text-[#564334] text-sm truncate">
                {userEmail}
              </span>
            </div>
            <button
              onClick={() => {
                setNewEmail(userEmail);
                setEditingEmail(true);
              }}
              className="text-sm text-[#FF8A00] font-semibold hover:text-[#E67E00] transition-colors duration-200 shrink-0 ml-2"
            >
              {t("security.email.changeButton")}
            </button>
          </div>
        )}
      </div>

      <div className="border-t border-[#EFE3D7] my-4" />

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-[#564334] mb-1.5">
            {t("security.changePassword.currentPassword")}
          </label>
          <div className="relative">
            <input
              type={showCurrentPw ? "text" : "password"}
              value={passwordSaatIni}
              onChange={(e) => setPasswordSaatIni(e.target.value)}
              className="w-full h-12 px-4 pr-12 bg-white border border-[#DDC1AE] rounded-[16px] text-[#2A1711] placeholder-[#8A7362] focus:outline-none focus:ring-2 focus:ring-[#FF8A00] focus:border-transparent transition-all duration-200"
              placeholder={t("security.changePassword.currentPasswordPlaceholder")}
            />
            <button
              type="button"
              onClick={() => setShowCurrentPw(!showCurrentPw)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8A7362] hover:text-[#564334] transition-colors duration-200"
              tabIndex={-1}
            >
              {showCurrentPw ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold text-[#564334] mb-1.5">
            {t("security.changePassword.newPassword")}
          </label>
          <div className="relative">
            <input
              type={showNewPw ? "text" : "password"}
              value={passwordBaru}
              onChange={(e) => setPasswordBaru(e.target.value)}
              className="w-full h-12 px-4 pr-12 bg-white border border-[#DDC1AE] rounded-[16px] text-[#2A1711] placeholder-[#8A7362] focus:outline-none focus:ring-2 focus:ring-[#FF8A00] focus:border-transparent transition-all duration-200"
              placeholder={t("security.changePassword.newPasswordPlaceholder")}
            />
            <button
              type="button"
              onClick={() => setShowNewPw(!showNewPw)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8A7362] hover:text-[#564334] transition-colors duration-200"
              tabIndex={-1}
            >
              {showNewPw ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold text-[#564334] mb-1.5">
            {t("security.changePassword.confirmPassword")}
          </label>
          <div className="relative">
            <input
              type={showConfirmPw ? "text" : "password"}
              value={konfirmasiPassword}
              onChange={(e) => setKonfirmasiPassword(e.target.value)}
              className="w-full h-12 px-4 pr-12 bg-white border border-[#DDC1AE] rounded-[16px] text-[#2A1711] placeholder-[#8A7362] focus:outline-none focus:ring-2 focus:ring-[#FF8A00] focus:border-transparent transition-all duration-200"
              placeholder={t("security.changePassword.confirmPasswordPlaceholder")}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPw(!showConfirmPw)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8A7362] hover:text-[#564334] transition-colors duration-200"
              tabIndex={-1}
            >
              {showConfirmPw ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>
        <button
          onClick={onUpdatePassword}
          disabled={updatingPassword}
          className="w-full h-12 rounded-full bg-[#FF8A00] text-white font-semibold hover:bg-[#E67E00] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 shadow-[0_10px_30px_rgba(255,138,0,0.25)] focus:outline-none focus:ring-2 focus:ring-[#FF8A00] focus:ring-offset-2"
        >
          {updatingPassword ? (
            <span className="inline-flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              {t("security.changePassword.processing")}
            </span>
          ) : (
            t("security.changePassword.updateButton")
          )}
        </button>
      </div>

      <div className="border-t border-[#EFE3D7] mt-6 pt-6">
        <div className="flex items-center gap-2 mb-5">
          <ShieldCheck className="w-5 h-5 text-[#564334]" />
          <h3 className="font-[var(--font-playfair)] font-bold text-lg text-[#2A1711]">
            {t("security.summary.title")}
          </h3>
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-between py-3.5">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded-full bg-[#FFF8F6] border border-[#DDC1AE] flex items-center justify-center shrink-0">
                <MailCheck className="w-4 h-4 text-[#8A7362]" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-semibold text-[#564334] truncate">
                  {t("security.summary.emailVerified")}
                </span>
                {emailVerified && emailVerifiedAt && (
                  <span className="text-xs text-[#8A7362] mt-0.5">
                    {formatDate(emailVerifiedAt)}
                  </span>
                )}
              </div>
            </div>
            {emailVerified ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-green-50 text-xs font-semibold text-green-700 border border-green-200 shrink-0 ml-3">
                <CheckCircle2 className="w-3 h-3" />
                {t("security.summary.verified")}
              </span>
            ) : (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-red-50 text-xs font-semibold text-red-700 border border-red-200 shrink-0 ml-3">
                {t("security.summary.notVerified")}
              </span>
            )}
          </div>

          <div className="border-t border-[#EFE3D7]" />

          <div className="flex items-center justify-between py-3.5">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded-full bg-[#FFF8F6] border border-[#DDC1AE] flex items-center justify-center shrink-0">
                <KeyRound className="w-4 h-4 text-[#8A7362]" />
              </div>
              <span className="text-sm font-semibold text-[#564334]">
                {t("security.summary.passwordChanged")}
              </span>
            </div>
            <span className="text-sm font-medium text-[#2A1711] shrink-0 ml-3">
              {passwordChangedAt
                ? formatDate(passwordChangedAt)
                : t("security.summary.neverChanged")}
            </span>
          </div>

          <div className="border-t border-[#EFE3D7]" />

          <div className="flex items-center justify-between py-3.5">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded-full bg-[#FFF8F6] border border-[#DDC1AE] flex items-center justify-center shrink-0">
                <LogIn className="w-4 h-4 text-[#8A7362]" />
              </div>
              <span className="text-sm font-semibold text-[#564334]">
                {t("security.summary.lastLogin")}
              </span>
            </div>
            <span
              className={`text-sm font-medium shrink-0 ml-3 ${
                lastLoginAt ? "text-[#2A1711]" : "text-[#8A7362] italic"
              }`}
            >
              {lastLoginAt ? formatDate(lastLoginAt) : t("security.summary.noHistory")}
            </span>
          </div>

          <div className="border-t border-[#EFE3D7]" />

          <div className="flex items-center justify-between py-3.5">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded-full bg-[#FFF8F6] border border-[#DDC1AE] flex items-center justify-center shrink-0">
                <CalendarDays className="w-4 h-4 text-[#8A7362]" />
              </div>
              <span className="text-sm font-semibold text-[#564334]">
                {t("security.summary.accountCreated")}
              </span>
            </div>
            <span className="text-sm font-medium text-[#2A1711] shrink-0 ml-3">
              {formatDate(createdAt)}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}