"use client";

import { useState } from "react";
import { Sidebar } from "@/components/dashboard/sidebar";
import DashboardNavbar from "@/components/dashboard/dashboard-navbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const currentYear = new Date().getFullYear();
  
  return (
    <div className="flex h-screen overflow-hidden bg-[#FFF8F6]">
      {/* Sidebar: fixed width, tidak shrink */}
      <aside
        className={`flex-shrink-0 h-full bg-white border-r border-[#DDC1AE] overflow-y-auto transition-all duration-300 ${
          isCollapsed ? "w-[88px]" : "w-[280px]"
        }`}
      >
        <Sidebar isCollapsed={isCollapsed} onToggle={() => setIsCollapsed(!isCollapsed)} />
      </aside>

      {/* Kanan: navbar + konten + footer, flex column, tidak overflow horizontal */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <DashboardNavbar onToggleSidebar={() => setIsCollapsed(!isCollapsed)} />

        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>

        <footer className="flex-shrink-0 h-12 bg-white border-t border-[#DDC1AE] flex items-center justify-between px-6 text-xs text-[#8A7362] font-[var(--font-be-vietnam)]">
          <span> &copy; {currentYear} DapurHPP. Semua hak dilindungi.</span>
          <span>Dibuat dengan ❤ untuk UMKM Gorengan</span>
        </footer>
      </div>
    </div>
  );
}