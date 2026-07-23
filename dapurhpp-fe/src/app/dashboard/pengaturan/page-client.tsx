"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuthStore, setTokenCookie } from "@/lib/auth-store";
import {
  ChevronRight,
  Mail,
  Eye,
  EyeOff,
  Bell,
  Package,
  TrendingUp,
  Info,
  LogOut,
  Globe,
  Moon,
  Save,
} from "lucide-react";

function Toggle({
  checked,
  onChange,
  disabled = false,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => {
        if (!disabled) onChange(!checked);
      }}
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#FF8A00] focus:ring-offset-2 ${
        disabled
          ? "cursor-not-allowed opacity-60"
          : checked
            ? "bg-[#FF8A00]"
            : "bg-[#DDC1AE]"
      }`}
    >
      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-all duration-200 ${
          checked ? "translate-x-[22px]" : "translate-x-[2px]"
        }`}
      />
    </button>
  );
}

export default function PengaturanPageClient() {
  const { user, logout } = useAuthStore();

  const [namaLengkap, setNamaLengkap] = useState(user?.name || "");
  const [namaUsaha, setNamaUsaha] = useState("");
  const [noHp, setNoHp] = useState("");

  const [passwordSaatIni, setPasswordSaatIni] = useState("");
  const [passwordBaru, setPasswordBaru] = useState("");
  const [konfirmasiPassword, setKonfirmasiPassword] = useState("");

  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);

  const [fontSize, setFontSize] = useState("sedang");

  const [notifAplikasi, setNotifAplikasi] = useState(true);
  const [notifStok, setNotifStok] = useState(false);
  const [notifPenjualan, setNotifPenjualan] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setNotifAplikasi(localStorage.getItem("notif-aplikasi") === "true");
    setNotifStok(localStorage.getItem("notif-stok") === "true");
    setNotifPenjualan(localStorage.getItem("notif-penjualan") === "true");
  }, []);

  useEffect(() => {
    if (mounted) localStorage.setItem("notif-aplikasi", String(notifAplikasi));
  }, [notifAplikasi, mounted]);

  useEffect(() => {
    if (mounted) localStorage.setItem("notif-stok", String(notifStok));
  }, [notifStok, mounted]);

  useEffect(() => {
    if (mounted) localStorage.setItem("notif-penjualan", String(notifPenjualan));
  }, [notifPenjualan, mounted]);

  const userInitial = user?.name?.charAt(0).toUpperCase() || "P";
  const userEmail = user?.email || "user@dapurhpp.com";

  if (!mounted) return null;

  return (
    <div className="mx-auto max-w-[1500px]">
      <nav className="flex items-center gap-1.5 mb-2 text-sm text-[#8A7362] font-[var(--font-be-vietnam)]">
        <Link
          href="/dashboard"
          className="hover:text-[#FF8A00] transition-colors duration-200"
        >
          Beranda
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-[#564334] font-medium">Pengaturan</span>
      </nav>

      <h1 className="font-[var(--font-playfair)] font-bold text-3xl md:text-4xl text-[#2A1711] mb-8">
        Pengaturan
      </h1>

      <section className="bg-white rounded-[24px] border border-[#DDC1AE] p-6 mb-6 shadow-[0_8px_30px_rgba(109,76,65,0.08)] hover:-translate-y-1 transition-all duration-300 ease-out">
        <h2 className="font-[var(--font-playfair)] font-bold text-2xl text-[#2A1711] mb-6">
          Profil
        </h2>

        <div className="flex items-center gap-5 mb-8">
          <div className="w-20 h-20 bg-[#FFE9E4] rounded-full flex items-center justify-center shrink-0">
            <span className="text-[#FF8A00] text-3xl font-bold">
              {userInitial}
            </span>
          </div>
          <div>
            <p className="font-semibold text-[#2A1711] text-lg">
              {user?.name || "Pemilik Usaha"}
            </p>
            <p className="text-sm text-[#8A7362]">{userEmail}</p>
          </div>
        </div>

        <div className="space-y-4 max-w-2xl">
          <div>
            <label className="block text-sm font-semibold text-[#564334] mb-1.5">
              Nama Lengkap
            </label>
            <input
              type="text"
              value={namaLengkap}
              onChange={(e) => setNamaLengkap(e.target.value)}
              className="w-full h-12 px-4 bg-white border border-[#DDC1AE] rounded-[16px] text-[#2A1711] placeholder-[#8A7362] focus:outline-none focus:ring-2 focus:ring-[#FF8A00] focus:border-transparent transition-all duration-200"
              placeholder="Masukkan nama lengkap"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#564334] mb-1.5">
              Nama Usaha
            </label>
            <input
              type="text"
              value={namaUsaha}
              onChange={(e) => setNamaUsaha(e.target.value)}
              className="w-full h-12 px-4 bg-white border border-[#DDC1AE] rounded-[16px] text-[#2A1711] placeholder-[#8A7362] focus:outline-none focus:ring-2 focus:ring-[#FF8A00] focus:border-transparent transition-all duration-200"
              placeholder="Masukkan nama usaha"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#564334] mb-1.5">
              No. HP{" "}
              <span className="text-[#8A7362] font-normal">(opsional)</span>
            </label>
            <input
              type="tel"
              value={noHp}
              onChange={(e) => setNoHp(e.target.value)}
              className="w-full h-12 px-4 bg-white border border-[#DDC1AE] rounded-[16px] text-[#2A1711] placeholder-[#8A7362] focus:outline-none focus:ring-2 focus:ring-[#FF8A00] focus:border-transparent transition-all duration-200"
              placeholder="Masukkan nomor HP"
            />
          </div>
          <button
            onClick={() => {
              /* UI-only */
            }}
            className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-[#FF8A00] text-white font-semibold hover:bg-[#E67E00] active:scale-[0.98] transition-all duration-200 shadow-[0_10px_30px_rgba(255,138,0,0.25)] focus:outline-none focus:ring-2 focus:ring-[#FF8A00] focus:ring-offset-2"
          >
            <Save className="w-4 h-4" />
            Simpan Perubahan
          </button>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <section className="bg-white rounded-[24px] border border-[#DDC1AE] p-6 shadow-[0_8px_30px_rgba(109,76,65,0.08)] hover:-translate-y-1 transition-all duration-300 ease-out">
          <h2 className="font-[var(--font-playfair)] font-bold text-2xl text-[#2A1711] mb-6">
            Keamanan
          </h2>

          <div className="mb-4">
            <label className="block text-sm font-semibold text-[#564334] mb-1.5">
              Email
            </label>
            <div className="flex items-center justify-between bg-[#FFF8F6] border border-[#DDC1AE] rounded-[16px] px-4 h-12">
              <div className="flex items-center gap-2 min-w-0">
                <Mail className="w-4 h-4 text-[#8A7362] shrink-0" />
                <span className="text-[#564334] text-sm truncate">
                  {userEmail}
                </span>
              </div>
              <button
                onClick={() => {
                  /* UI-only */
                }}
                className="text-sm text-[#FF8A00] font-semibold hover:text-[#E67E00] transition-colors duration-200 shrink-0 ml-2"
              >
                Ubah Email
              </button>
            </div>
          </div>

          <div className="border-t border-[#EFE3D7] my-4" />

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-[#564334] mb-1.5">
                Password Saat Ini
              </label>
              <div className="relative">
                <input
                  type={showCurrentPw ? "text" : "password"}
                  value={passwordSaatIni}
                  onChange={(e) => setPasswordSaatIni(e.target.value)}
                  className="w-full h-12 px-4 pr-12 bg-white border border-[#DDC1AE] rounded-[16px] text-[#2A1711] placeholder-[#8A7362] focus:outline-none focus:ring-2 focus:ring-[#FF8A00] focus:border-transparent transition-all duration-200"
                  placeholder="Masukkan password saat ini"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPw(!showCurrentPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8A7362] hover:text-[#564334] transition-colors duration-200"
                  tabIndex={-1}
                >
                  {showCurrentPw ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#564334] mb-1.5">
                Password Baru
              </label>
              <div className="relative">
                <input
                  type={showNewPw ? "text" : "password"}
                  value={passwordBaru}
                  onChange={(e) => setPasswordBaru(e.target.value)}
                  className="w-full h-12 px-4 pr-12 bg-white border border-[#DDC1AE] rounded-[16px] text-[#2A1711] placeholder-[#8A7362] focus:outline-none focus:ring-2 focus:ring-[#FF8A00] focus:border-transparent transition-all duration-200"
                  placeholder="Masukkan password baru"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPw(!showNewPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8A7362] hover:text-[#564334] transition-colors duration-200"
                  tabIndex={-1}
                >
                  {showNewPw ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#564334] mb-1.5">
                Konfirmasi Password Baru
              </label>
              <div className="relative">
                <input
                  type={showConfirmPw ? "text" : "password"}
                  value={konfirmasiPassword}
                  onChange={(e) => setKonfirmasiPassword(e.target.value)}
                  className="w-full h-12 px-4 pr-12 bg-white border border-[#DDC1AE] rounded-[16px] text-[#2A1711] placeholder-[#8A7362] focus:outline-none focus:ring-2 focus:ring-[#FF8A00] focus:border-transparent transition-all duration-200"
                  placeholder="Konfirmasi password baru"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPw(!showConfirmPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8A7362] hover:text-[#564334] transition-colors duration-200"
                  tabIndex={-1}
                >
                  {showConfirmPw ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
            <button
              onClick={() => {
                /* UI-only */
              }}
              className="w-full h-12 rounded-full bg-[#FF8A00] text-white font-semibold hover:bg-[#E67E00] active:scale-[0.98] transition-all duration-200 shadow-[0_10px_30px_rgba(255,138,0,0.25)] focus:outline-none focus:ring-2 focus:ring-[#FF8A00] focus:ring-offset-2"
            >
              Update Password
            </button>
          </div>
        </section>

        <section className="bg-white rounded-[24px] border border-[#DDC1AE] p-6 shadow-[0_8px_30px_rgba(109,76,65,0.08)] hover:-translate-y-1 transition-all duration-300 ease-out">
          <h2 className="font-[var(--font-playfair)] font-bold text-2xl text-[#2A1711] mb-6">
            Tampilan
          </h2>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-[#564334] mb-3">
              Ukuran Font
            </label>
            <div className="inline-flex bg-[#FFF8F6] rounded-full p-1 border border-[#DDC1AE]">
              {["kecil", "sedang", "besar"].map((size) => (
                <button
                  key={size}
                  onClick={() => setFontSize(size)}
                  className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#FF8A00] focus:ring-offset-1 ${
                    fontSize === size
                      ? "bg-[#FF8A00] text-white shadow-sm"
                      : "text-[#564334] hover:bg-[#FFE9E4]"
                  }`}
                >
                  {size.charAt(0).toUpperCase() + size.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Moon className="w-4 h-4 text-[#564334]" />
                <span className="text-sm font-semibold text-[#564334]">
                  Dark Mode
                </span>
              </div>
              <div className="relative group">
                <Toggle checked={false} onChange={() => {}} disabled={true} />
                <span className="absolute -top-8 right-0 bg-[#2A1711] text-white text-[10px] px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none z-10">
                  Segera Hadir
                </span>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Globe className="w-4 h-4 text-[#564334]" />
              <span className="text-sm font-semibold text-[#564334]">
                Bahasa
              </span>
            </div>
            <div className="relative">
              <select
                disabled
                className="w-full h-12 px-4 bg-[#FFF8F6] border border-[#DDC1AE] rounded-[16px] text-[#564334] opacity-60 cursor-not-allowed appearance-none"
              >
                <option>Bahasa Inggris</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <span className="text-[10px] bg-[#FFE9E4] text-[#FF8A00] px-2 py-0.5 rounded-full font-semibold whitespace-nowrap">
                  Segera Hadir
                </span>
              </div>
            </div>
          </div>
        </section>
      </div>

      <section className="bg-white rounded-[24px] border border-[#DDC1AE] p-6 mb-6 shadow-[0_8px_30px_rgba(109,76,65,0.08)] hover:-translate-y-1 transition-all duration-300 ease-out">
        <h2 className="font-[var(--font-playfair)] font-bold text-2xl text-[#2A1711] mb-6">
          Notifikasi
        </h2>

        <div className="space-y-0 max-w-xl">
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-[#564334] shrink-0" />
              <div>
                <p className="font-medium text-[#2A1711] text-sm">
                  Notifikasi dalam aplikasi
                </p>
                <p className="text-xs text-[#8A7362]">
                  Terima notifikasi aktivitas akun
                </p>
              </div>
            </div>
            <Toggle checked={notifAplikasi} onChange={setNotifAplikasi} />
          </div>

          <div className="border-t border-[#EFE3D7]" />

          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <Package className="w-5 h-5 text-[#564334] shrink-0" />
              <div>
                <p className="font-medium text-[#2A1711] text-sm">
                  Reminder stok habis
                </p>
                <p className="text-xs text-[#8A7362]">
                  Pemberitahuan saat bahan baku habis
                </p>
              </div>
            </div>
            <Toggle checked={notifStok} onChange={setNotifStok} />
          </div>

          <div className="border-t border-[#EFE3D7]" />

          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-5 h-5 text-[#564334] shrink-0" />
              <div>
                <p className="font-medium text-[#2A1711] text-sm">
                  Reminder penjualan
                </p>
                <p className="text-xs text-[#8A7362]">
                  Ringkasan penjualan harian
                </p>
              </div>
            </div>
            <Toggle checked={notifPenjualan} onChange={setNotifPenjualan} />
          </div>
        </div>
      </section>

      <section className="bg-white rounded-[24px] border border-[#DDC1AE] p-6 shadow-[0_8px_30px_rgba(109,76,65,0.08)] hover:-translate-y-1 transition-all duration-300 ease-out">
        <h2 className="font-[var(--font-playfair)] font-bold text-2xl text-[#2A1711] mb-6">
          Tentang
        </h2>

        <div className="space-y-0 max-w-xl">
          <div className="flex items-center justify-between py-2">
            <span className="text-[#564334]">Versi Aplikasi</span>
            <span className="font-semibold text-[#2A1711]">v1.2.0</span>
          </div>

          <div className="border-t border-[#EFE3D7]" />

          <div className="flex items-center justify-between py-2">
            <span className="text-[#564334]">Developer</span>
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
              onClick={() => {
                logout();
                setTokenCookie(null);
              }}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-[#BA1A1A] font-semibold hover:bg-[#FFF8F6] active:scale-[0.98] transition-all duration-200 border border-[#F4ACB7] focus:outline-none focus:ring-2 focus:ring-[#BA1A1A] focus:ring-offset-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
