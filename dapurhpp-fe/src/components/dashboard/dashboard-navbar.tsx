"use client";

import { useAuthStore } from "@/lib/auth-store";

interface DashboardNavbarProps {
  onToggleSidebar: () => void;
}

export default function DashboardNavbar({ onToggleSidebar }: DashboardNavbarProps) {
  const { user } = useAuthStore();

  const name = user?.name ? user.name.split(" ")[0] : "Pemilik";
  const greeting = `Halo, ${name} 👋`;
  const dateStr = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <nav className="bg-white rounded-[24px] border border-[#E8D5C4] p-4 sm:p-6 shadow-[0_8px_30px_rgba(109,76,65,0.08)] mb-6 sm:mb-8">
      <div className="flex items-center justify-between gap-2 sm:gap-4">
        {/* Kiri: Hamburger Menu + Greeting */}
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-lg hover:bg-[#FFF8F6] transition-colors lg:hidden shrink-0"
            aria-label="Toggle Navigation"
          >
            <svg className="w-6 h-6 text-[#2A1711]" stroke="currentColor" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <div className="space-y-0.5 sm:space-y-1">
            <h3 className="text-base sm:text-lg font-semibold text-[#2A1711] leading-tight">{greeting}</h3>
            <p className="text-xs sm:text-sm text-[#564334]">{dateStr}</p>
          </div>
        </div>

        {/* Kanan: Pill Tanggal (Desktop Only), Notifikasi & Avatar */}
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          {/* Pill Tanggal hanya tampil di layar tablet/desktop (sm ke atas) */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#DDC1AE] text-sm text-[#564334] cursor-default">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>{dateStr}</span>
          </div>

          {/* Notifikasi - ikon bell solid dengan warna hitam */}
          <div className="relative">
            <button className="p-2 rounded-full hover:bg-[#FFF8F6] transition-colors text-[#2A1711]">
              <svg
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="currentColor"   // <-- fill solid, warna mengikuti text color
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
              </svg>
              <div className="absolute top-1 right-1 w-2 h-2 bg-[#FF8A00] rounded-full" />
            </button>
          </div>

          {/* Avatar User */}
          <div className="w-9 h-9 sm:w-10 sm:h-10 bg-[#FFE2DA] rounded-full flex items-center justify-center font-bold text-[#FF8A00]">
            {user?.name?.charAt(0).toUpperCase() || "M"}
          </div>
        </div>
      </div>
    </nav>
  );
}