"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslation } from "@/context/language-context";
import { useAuthStore } from "@/lib/auth-store";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export function Navbar() {
  const { t: tAuth } = useTranslation("auth");
  const { language, setLanguage } = useTranslation("landing");
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: tAuth("navbar.home") },
    { href: "/produk", label: tAuth("navbar.products") },
    { href: "/perusahaan", label: tAuth("navbar.company") },
    { href: "/bantuan", label: tAuth("navbar.help") },
  ];

  const authLinks = user
    ? [
        {
          href: "/dashboard",
          label: tAuth("navbar.dashboard"),
          primary: true,
        },
      ]
    : [
        {
          href: "/login",
          label: tAuth("navbar.login"),
          primary: false,
        },
        {
          href: "/register",
          label: tAuth("navbar.register"),
          primary: true,
        },
      ];

  return (
    <header className="navbar fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-sm border-b border-[#DDC1AE]">
      <nav
        className="mx-auto max-w-[1500px] px-6 h-16 flex items-center justify-between"
        aria-label={tAuth("navbar.ariaLabel")}
      >
        <Link
          href="/"
          className="flex items-center gap-2 outline-none focus-visible:ring-2 focus-visible:ring-[#FF8A00] rounded-md transition-all"
          aria-label={tAuth("navbar.ariaHome")}
        >
<Image
              src="/iconDapurHpp.png"
              alt={tAuth("navbar.ariaHome")}
              width={340}
              height={100}
              loading="eager"
              className="w-auto h-8 md:h-10 object-contain origin-left"
              draggable={false}
              priority
            />
        </Link>

        {/* Desktop Nav */}
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

          {/* Auth buttons desktop */}
          <div className="flex items-center gap-4">
            {authLinks.map((link, idx) => (
              <Link
                key={idx}
                href={link.href}
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-[var(--font-be-vietnam)] font-semibold text-sm transition-all ${
                  link.primary
                    ? "bg-[#FF8A00] text-white hover:bg-[#E67E00] hover:shadow-[0_4px_12px_rgba(255,138,0,0.3)]"
                    : "bg-white text-[#FF8A00] border border-[#FF8A00] hover:bg-[#FFF8F6]"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Language Switcher Desktop */}
          <div className="hidden lg:flex items-center gap-1 bg-[#FFF8F6] rounded-full p-1 ml-4">
            <button
              onClick={() => setLanguage("id")}
              className={`px-3 py-1.5 rounded-full text-sm font-[var(--font-be-vietnam)] font-medium transition-all ${
                language === "id"
                  ? "bg-[#FF8A00] text-white"
                  : "text-[#564334] hover:bg-[#FFE9E4]"
              }`}
              aria-label="Indonesian"
            >
              ID
            </button>
            <button
              onClick={() => setLanguage("en")}
              className={`px-3 py-1.5 rounded-full text-sm font-[var(--font-be-vietnam)] font-medium transition-all ${
                language === "en"
                  ? "bg-[#FF8A00] text-white"
                  : "text-[#564334] hover:bg-[#FFE9E4]"
              }`}
              aria-label="English"
            >
              EN
            </button>
          </div>
        </div>

        {/* Mobile menu button */}
        <button
          className="lg:hidden p-2 rounded-lg text-[#2A1711] hover:bg-[#FFE9E4] transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-menu"
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          id="mobile-menu"
          className="lg:hidden fixed inset-0 z-50 bg-white flex flex-col items-center justify-start pt-20 px-6 gap-6"
          role="dialog"
          aria-modal="true"
          aria-label={tAuth("navbar.ariaLabel")}
        >
          <div className="flex flex-col items-center gap-4 w-full max-w-sm">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-lg font-[var(--font-be-vietnam)] font-medium transition-colors ${
                    isActive ? "text-[#FF8A00]" : "text-[#2A1711]"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              );
            })}

            <div className="flex flex-col items-center gap-3 w-full mt-4">
              {authLinks.map((link, idx) => (
                <Link
                  key={idx}
                  href={link.href}
                  className={`w-full text-center px-5 py-3 rounded-full font-[var(--font-be-vietnam)] font-semibold text-base transition-all ${
                    link.primary
                      ? "bg-[#FF8A00] text-white hover:bg-[#E67E00]"
                      : "bg-white text-[#FF8A00] border border-[#FF8A00] hover:bg-[#FFF8F6]"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Language Switcher Mobile */}
            <div className="flex items-center gap-1 bg-[#FFF8F6] rounded-full p-1 w-fit mx-auto mt-2">
              <button
                onClick={() => {
                  setLanguage("id");
                  setIsMobileMenuOpen(false);
                }}
                className={`px-3 py-1.5 rounded-full text-sm font-[var(--font-be-vietnam)] font-medium transition-all ${
                  language === "id"
                    ? "bg-[#FF8A00] text-white"
                    : "text-[#564334] hover:bg-[#FFE9E4]"
                }`}
                aria-label="Indonesian"
              >
                ID
              </button>
              <button
                onClick={() => {
                  setLanguage("en");
                  setIsMobileMenuOpen(false);
                }}
                className={`px-3 py-1.5 rounded-full text-sm font-[var(--font-be-vietnam)] font-medium transition-all ${
                  language === "en"
                    ? "bg-[#FF8A00] text-white"
                    : "text-[#564334] hover:bg-[#FFE9E4]"
                }`}
                aria-label="English"
              >
                EN
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}