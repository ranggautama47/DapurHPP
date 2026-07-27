"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/dashboard/sidebar";
import DashboardNavbar from "@/components/dashboard/dashboard-navbar";
import { useAuthStore } from "@/lib/auth-store";
import { api } from "@/lib/axios";
import { FontSizeProvider } from "@/context/font-size-context";
import { VerificationBanner } from "@/components/dashboard/verification-banner";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, setUser } = useAuthStore();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Sync data profil lengkap dari database — SATU KALI saat mount dashboard
  useEffect(() => {
    if (!user) return;
    api
      .get("/users/profile")
      .then((res) => setUser({ ...user, ...res.data }))
      .catch(() => {}); // silent fail — user tetap bisa pakai dashboard
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const currentYear = new Date().getFullYear();

  const handleToggle = () => {
    if (isMobile) {
      setIsMobileOpen((prev) => !prev);
    } else {
      setIsCollapsed((prev) => !prev);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#FFF8F6]">
      {/* Desktop sidebar */}
      <aside
        className={`hidden lg:flex flex-shrink-0 h-full bg-white border-r border-[#DDC1AE] overflow-y-auto transition-all duration-300 ${
          isCollapsed ? "w-[88px]" : "w-[280px]"
        }`}
      >
        <Sidebar
          isCollapsed={isCollapsed}
          onToggle={() => setIsCollapsed(!isCollapsed)}
        />
      </aside>

      {/* Mobile sidebar overlay */}
      {isMobile && (
        <>
          {/* Backdrop */}
          {isMobileOpen && (
            <div
              className="fixed inset-0 bg-black/50 z-40 transition-opacity"
              onClick={() => setIsMobileOpen(false)}
            />
          )}

          <aside
            className={`lg:hidden fixed top-0 left-0 h-full bg-white z-50 overflow-y-auto${
              mounted ? " transition-transform duration-300" : ""
            } ${
              isMobileOpen ? "translate-x-0" : "-translate-x-full"
            } w-[280px] shadow-xl`}
          >
            <Sidebar isCollapsed={false} />
          </aside>
        </>
      )}

      {/* Kanan: navbar + konten + footer, flex column, tidak overflow horizontal */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <DashboardNavbar onToggleSidebar={handleToggle} />

        <VerificationBanner />

        <main className="flex-1 overflow-y-auto p-6">
          <FontSizeProvider>{children}</FontSizeProvider>
        </main>

        <footer className="flex-shrink-0 bg-white border-t border-[#DDC1AE] flex flex-col sm:flex-row items-center justify-between gap-1 px-4 sm:px-6 py-2 text-xs text-center sm:text-left text-[#8A7362] font-[var(--font-be-vietnam)]">
          <span> &copy; {currentYear} DapurHPP. Semua hak dilindungi.</span>
          <span>Dibuat dengan ❤ untuk UMKM Gorengan</span>
        </footer>
      </div>
    </div>
  );
}