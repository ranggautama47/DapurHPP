"use client";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuthStore, setTokenCookie } from "@/lib/auth-store";
import {
  Home,
  ShoppingCart,
  Package,
  BookOpen,
  ChefHat,
  TrendingUp,
  Truck,
  Receipt,
  BarChart2,
  Settings,
  LogOut,
} from "lucide-react";

interface MenuItem {
  href: string;
  label: string;
  icon: React.ComponentType<{
    size?: number;
    strokeWidth?: number;
    color?: string;
    stroke?: string;
  }>;
}

const menuItems: MenuItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/dashboard/belanja", label: "Belanja", icon: ShoppingCart },
  { href: "/dashboard/bahan-baku", label: "Bahan Baku", icon: Package },
  { href: "/dashboard/resep", label: "Resep", icon: BookOpen },
  { href: "/dashboard/produksi", label: "Produksi", icon: ChefHat },
  { href: "/dashboard/penjualan", label: "Penjualan", icon: TrendingUp },
  { href: "/dashboard/supplier", label: "Supplier", icon: Truck },
  {
    href: "/dashboard/pengeluaran",
    label: "Pengeluaran Lain-lain",
    icon: Receipt,
  },
  { href: "/dashboard/laporan", label: "Laporan", icon: BarChart2 },
  { href: "/dashboard/pengaturan", label: "Pengaturan", icon: Settings },
];

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const [userName, setUserName] = useState("Loading...");
  const [userInitial, setUserInitial] = useState("");

  useEffect(() => {
    setMounted(true);

    if (user?.name) {
      setUserName(user.name);
      setUserInitial(user.name.charAt(0).toUpperCase());
    } else {
      setUserName("Pemilik Usaha");
      setUserInitial("P");
    }
  }, [user]);

  if (!mounted) return null;

  return (
    <aside className="w-full">
      <div className="px-4 pt-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            {!isCollapsed ? (
              <div className="relative h-9 w-[180px]">
                <Image
                  src="/iconDapurHpp.png"
                  alt="Logo DapurHPP"
                  fill
                  sizes="180px"
                  priority
                  className="object-contain object-left"
                  draggable={false}
                />
              </div>
            ) : (
              <div className="relative h-9 w-9">
                <Image
                  src="/iconDapurHpp.png"
                  alt="Logo DapurHPP"
                  fill
                  sizes="36px"
                  priority
                  className="object-contain"
                  draggable={false}
                />
              </div>
            )}
          </div>
          <button
            onClick={onToggle}
            className="p-2 rounded-full hover:bg-[#FFF8F6] transition-colors"
            title="Toggle sidebar"
          >
            <svg
              className="w-5 h-5"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>

        <nav className="space-y-1">
          {menuItems.map((item, index) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={index}
                href={item.href}
                className={`flex items-center px-3 py-2 rounded-2xl transition-colors ${
                  isActive
                    ? "bg-[#FFE9E4] text-[#FF8A00]"
                    : "text-[#564334] hover:bg-[#FFF8F6]"
                }`}
              >
                {!isCollapsed ? (
                  <div className="flex items-center gap-3 w-full">
                    <item.icon size={20} strokeWidth={1.75} />
                    <span className="whitespace-nowrap">{item.label}</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center w-full">
                    <item.icon size={20} strokeWidth={1.75} />
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* 5. USER INFO YANG SUDAH DINAMIS & LOGOUT */}
        <div className="mt-8 pt-4 border-t border-[#F5E6D8]">
          {/* Sembunyikan profil jika sidebar sedang collapse agar rapi */}
          {!isCollapsed && (
            <div className="flex items-center gap-3 mb-4 px-2">
              <div className="w-10 h-10 bg-[#FFE2DA] rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-[#FF8A00] font-bold">{userInitial}</span>
              </div>
              <div className="space-y-0.5 overflow-hidden">
                {/* Variabel state userName dipanggil di sini */}
                <p
                  className="font-semibold text-[#2A1711] truncate"
                  title={userName}
                >
                  {userName}
                </p>
                <p className="text-xs text-[#564334]">Pemilik Usaha</p>
              </div>
            </div>
          )}

          <button
            onClick={() => {
              logout();
              setTokenCookie(null);
            }}
            className={`w-full flex items-center ${isCollapsed ? "justify-center" : "justify-start"} px-3 py-2.5 text-left text-[#BA1A1A] hover:bg-[#FFF8F6] transition-colors rounded-xl`}
          >
            <LogOut size={18} strokeWidth={1.75} />
            {!isCollapsed && (
              <span className="text-sm font-medium ml-3">Logout</span>
            )}
          </button>
        </div>
      </div>
    </aside>
  );
}
