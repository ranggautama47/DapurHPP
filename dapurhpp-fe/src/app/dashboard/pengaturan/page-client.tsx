"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { api } from "@/lib/axios";
import { useAuthStore, setTokenCookie, User } from "@/lib/auth-store";
import { useFontSize } from "@/context/font-size-context";
import { useTranslation } from "@/context/language-context";
import { ChevronRight } from "lucide-react";
import {
  ProfileSection,
  SecuritySection,
  AppearanceSection,
  NotificationSection,
  AboutSection,
} from "@/components/dashboard/pengaturan";

interface ProfileData {
  id: number;
  name: string;
  email: string;
  emailVerified: boolean;
  emailVerifiedAt: string | null;
  passwordChangedAt: string | null;
  lastLoginAt: string | null;
  createdAt: string;
  namaUsaha: string | null;
  nomorHp: string | null;
  fontSize: string;
  notifAplikasi: boolean;
  notifStok: boolean;
  notifPenjualan: boolean;
  avatarUrl: string | null;
}

export default function PengaturanPageClient() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { fontSize, setFontSize } = useFontSize();
  const { t } = useTranslation("settings");

  const [namaLengkap, setNamaLengkap] = useState(user?.name || "");
  const [namaUsaha, setNamaUsaha] = useState("");
  const [noHp, setNoHp] = useState("");

  const [passwordSaatIni, setPasswordSaatIni] = useState("");
  const [passwordBaru, setPasswordBaru] = useState("");
  const [konfirmasiPassword, setKonfirmasiPassword] = useState("");

  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);

  const [notifAplikasi, setNotifAplikasi] = useState(true);
  const [notifStok, setNotifStok] = useState(false);
  const [notifPenjualan, setNotifPenjualan] = useState(false);

  const [mounted, setMounted] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [updatingPassword, setUpdatingPassword] = useState(false);

  const [emailVerified, setEmailVerified] = useState(false);
  const [emailVerifiedAt, setEmailVerifiedAt] = useState<string | null>(null);
  const [passwordChangedAt, setPasswordChangedAt] = useState<string | null>(null);
  const [lastLoginAt, setLastLoginAt] = useState<string | null>(null);
  const [createdAt, setCreatedAt] = useState<string>("");

  const [editingEmail, setEditingEmail] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [updatingEmail, setUpdatingEmail] = useState(false);
  const [emailCurrentPassword, setEmailCurrentPassword] = useState("");

  const [avatarUrl, setAvatarUrl] = useState<string | null>(
    user?.avatarUrl || null,
  );
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const fetchProfile = async () => {
      setLoadingProfile(true);
      try {
        const res = await api.get<ProfileData>("/users/profile");
        const d = res.data;
        setNamaLengkap(d.name);
        setNamaUsaha(d.namaUsaha ?? "");
        setNoHp(d.nomorHp ?? "");
        setFontSize(d.fontSize);
        setNotifAplikasi(d.notifAplikasi);
        setNotifStok(d.notifStok);
        setNotifPenjualan(d.notifPenjualan);
        setAvatarUrl(d.avatarUrl || null);
        setEmailVerified(d.emailVerified);
        setEmailVerifiedAt(d.emailVerifiedAt);
        setPasswordChangedAt(d.passwordChangedAt);
        setLastLoginAt(d.lastLoginAt);
        setCreatedAt(d.createdAt);
      } catch {
        toast.error(t("profile.loadError"));
      } finally {
        setLoadingProfile(false);
      }
    };
    fetchProfile();
  }, [mounted]);

  const userEmail = user?.email || "user@dapurhpp.com";

  const handleUpdateEmail = async () => {
    if (!newEmail || newEmail === userEmail) {
      setEditingEmail(false);
      return;
    }
    setUpdatingEmail(true);
    try {
      const res = await api.patch("/users/email", { newEmail, currentPassword: emailCurrentPassword });
      const msg = res.data?.message || t("security.email.success");
      toast.success(msg);
      setEditingEmail(false);
      setEmailCurrentPassword("");
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || t("security.email.error");
      toast.error(msg);
    } finally {
      setUpdatingEmail(false);
    }
  };

  const handleSimpanProfil = async () => {
    setSavingProfile(true);
    try {
      await api.patch("/users/profile", {
        name: namaLengkap,
        namaUsaha: namaUsaha || null,
        nomorHp: noHp || null,
      });
      toast.success(t("profile.success"));
    } catch {
      toast.error(t("profile.error"));
    } finally {
      setSavingProfile(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (passwordBaru !== konfirmasiPassword) {
      toast.error(t("security.changePassword.confirmMatchError"));
      return;
    }
    setUpdatingPassword(true);
    try {
      await api.patch("/users/password", {
        currentPassword: passwordSaatIni,
        newPassword: passwordBaru,
      });
      toast.success(t("security.changePassword.success"));
      setPasswordSaatIni("");
      setPasswordBaru("");
      setKonfirmasiPassword("");
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || t("security.changePassword.error");
      toast.error(msg);
    } finally {
      setUpdatingPassword(false);
    }
  };

  const handleToggleAplikasi = (v: boolean) => {
    const prev = notifAplikasi;
    setNotifAplikasi(v);
    api.patch("/users/profile", { notifAplikasi: v }).catch(() => {
      setNotifAplikasi(prev);
      toast.error(t("notifications.toggleError"));
    });
  };

  const handleToggleStok = (v: boolean) => {
    const prev = notifStok;
    setNotifStok(v);
    api.patch("/users/profile", { notifStok: v }).catch(() => {
      setNotifStok(prev);
      toast.error(t("notifications.toggleError"));
    });
  };

  const handleTogglePenjualan = (v: boolean) => {
    const prev = notifPenjualan;
    setNotifPenjualan(v);
    api.patch("/users/profile", { notifPenjualan: v }).catch(() => {
      setNotifPenjualan(prev);
      toast.error(t("notifications.toggleError"));
    });
  };

  const handleAvatarSelect = async (file: File) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      toast.error(t("profile.fileTypeError"));
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error(t("profile.fileSizeError"));
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("avatar", file);
      const res = await api.patch<ProfileData>("/users/avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const avatarPath = res.data.avatarUrl || null;
      setAvatarUrl(avatarPath);
      if (user) {
        useAuthStore.getState().setUser({ ...user, avatarUrl: avatarPath });
      }
      toast.success(t("profile.avatarSuccess"));
    } catch {
      toast.error(t("profile.avatarError"));
    } finally {
      setIsUploading(false);
    }
  };

  const handleLogout = () => {
    logout();
    setTokenCookie(null);
    router.push("/");
  };

  const API_BASE = (
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api"
  ).replace(/\/api$/, "");
  const fullAvatarUrl = avatarUrl ? `${API_BASE}${avatarUrl}` : null;

  if (!mounted) return null;

  return (
    <div className="mx-auto max-w-[1500px]">
      <nav className="flex items-center gap-1.5 mb-2 text-sm text-[#8A7362] font-[var(--font-be-vietnam)]">
        <Link
          href="/dashboard"
          className="hover:text-[#FF8A00] transition-colors duration-200"
        >
          {t("breadcrumb.home")}
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-[#564334] font-medium">{t("breadcrumb.settings")}</span>
      </nav>

      <h1 className="font-[var(--font-playfair)] font-bold text-3xl md:text-4xl text-[#2A1711] mb-8">
        {t("title")}
      </h1>

      <ProfileSection
        userName={user?.name}
        userEmail={userEmail}
        avatarUrl={fullAvatarUrl}
        isUploading={isUploading}
        onAvatarSelect={handleAvatarSelect}
        namaLengkap={namaLengkap}
        setNamaLengkap={setNamaLengkap}
        namaUsaha={namaUsaha}
        setNamaUsaha={setNamaUsaha}
        noHp={noHp}
        setNoHp={setNoHp}
        savingProfile={savingProfile}
        onSimpanProfil={handleSimpanProfil}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <SecuritySection
          userEmail={userEmail}
          passwordSaatIni={passwordSaatIni}
          setPasswordSaatIni={setPasswordSaatIni}
          passwordBaru={passwordBaru}
          setPasswordBaru={setPasswordBaru}
          konfirmasiPassword={konfirmasiPassword}
          setKonfirmasiPassword={setKonfirmasiPassword}
          showCurrentPw={showCurrentPw}
          setShowCurrentPw={setShowCurrentPw}
          showNewPw={showNewPw}
          setShowNewPw={setShowNewPw}
          showConfirmPw={showConfirmPw}
          setShowConfirmPw={setShowConfirmPw}
          updatingPassword={updatingPassword}
          onUpdatePassword={handleUpdatePassword}
          editingEmail={editingEmail}
          setEditingEmail={setEditingEmail}
          newEmail={newEmail}
          setNewEmail={setNewEmail}
          updatingEmail={updatingEmail}
          onUpdateEmail={handleUpdateEmail}
          emailCurrentPassword={emailCurrentPassword}
          setEmailCurrentPassword={setEmailCurrentPassword}
          emailVerified={emailVerified}
          emailVerifiedAt={emailVerifiedAt}
          passwordChangedAt={passwordChangedAt}
          lastLoginAt={lastLoginAt}
          createdAt={createdAt}
        />

        <AppearanceSection
          fontSize={fontSize}
          onFontSizeChange={setFontSize}
        />
      </div>

      <NotificationSection
        notifAplikasi={notifAplikasi}
        notifStok={notifStok}
        notifPenjualan={notifPenjualan}
        onToggleAplikasi={handleToggleAplikasi}
        onToggleStok={handleToggleStok}
        onTogglePenjualan={handleTogglePenjualan}
      />

      <AboutSection onLogout={handleLogout} />
    </div>
  );
}