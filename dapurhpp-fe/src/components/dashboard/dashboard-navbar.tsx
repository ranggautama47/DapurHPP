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
    <nav className="bg-white rounded-[24px] border border-[#E8D5C4] p-4 sm:p-6 shadow-[0_8px_30px_rgba(109,76,65,0.08)] mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-lg hover:bg-[#FFF8F6] transition-colors lg:hidden"
          >
            <svg className="w-6 h-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <div className="space-y-1">
            <h3 className="text-lg font-semibold text-[#2A1711]">{greeting}</h3>
            <p className="text-sm text-[#564334]">{dateStr}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 px-3 py-1.5 rounded-full border border-[#DDC1AE] text-sm text-[#564334] cursor-default">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>{dateStr}</span>
          </div>

          <div className="relative">
            <button className="p-2 rounded-full hover:bg-[#FFF8F6] transition-colors">
              <svg className="w-5 h-5" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.023-.595 1.421L4 16h5v3a2 2 0 002 2z" />
              </svg>
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-[#FF8A00] rounded-full" />
            </button>
          </div>

          <div className="w-10 h-10 bg-[#FFE2DA] rounded-full flex items-center justify-center">
            <span className="text-[#FF8A00] font-bold">{user?.name?.charAt(0).toUpperCase() || "M"}</span>
          </div>
        </div>
      </div>
    </nav>
  );
}