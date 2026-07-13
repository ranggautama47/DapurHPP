"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/", label: "Beranda" },
  { href: "/produk", label: "Produk" },
  { href: "/perusahaan", label: "Perusahaan" },
  { href: "/bantuan", label: "Bantuan" },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="navbar fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-sm border-b border-[#DDC1AE]">
      <nav
        className="mx-auto max-w-[1500px] px-6 h-16 flex items-center justify-between"
        aria-label="Navigasi utama"
      >
        <Link
          href="/"
          className="flex items-center gap-2 outline-none focus-visible:ring-2 focus-visible:ring-[#FF8A00] rounded-md transition-all"
          aria-label="DapurHPP - Beranda"
        >
          <Image
            src="/iconDapurHpp.png"
            alt="Logo DapurHPP"
            /* Gunakan rasio asli gambar horizontal, misalnya 340x100 */
            width={340}
            height={100}
            loading="eager"
            /* h-8 untuk HP (32px), md:h-10 untuk Laptop (40px), w-auto agar proporsi terjaga */
            className="w-auto h-8 md:h-10 object-contain origin-left"
            draggable={false}
            priority // Tambahkan priority karena ini LCP (Largest Contentful Paint) di navbar
          /> 
        </Link>

        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`group relative text-sm font-[var(--font-be-vietnam)] font-medium transition-colors pb-0.5 ${
                  isActive
                    ? "text-[#FF8A00]"
                    : "text-[#2A1711] hover:text-[#E2B6CF]"
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FF8A00] rounded-full" />
                )}
                {!isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#E2B6CF] rounded-full scale-x-0 transition-transform duration-300 group-hover:scale-x-100" />
                )}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="hidden lg:inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-[#FF8A00] font-[var(--font-be-vietnam)] font-semibold text-sm border border-[#FF8A00] hover:bg-[#FFF8F6] transition-all"
          >
            Masuk
          </Link>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#FF8A00] text-white font-[var(--font-be-vietnam)] font-semibold text-sm hover:bg-[#E67E00] hover:shadow-[0_4px_12px_rgba(255,138,0,0.3)] transition-all"
          >
            Daftar
          </Link>
        </div>
      </nav>
    </header>
  );
}
