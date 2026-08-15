"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslation } from "@/context/language-context";
import { useAuthStore } from "@/lib/auth-store";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

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

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Close mobile menu when pressing Escape.
  useEffect(() => {
    if (!isMobileMenuOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeMobileMenu();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMobileMenuOpen]);

  // Close mobile menu when navigating to another route.
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  return (
    <header className="navbar fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-[#DDC1AE]">
      <nav
        className="relative mx-auto max-w-[1500px] px-6 h-16 flex items-center justify-between"
        aria-label={tAuth("navbar.ariaLabel")}
      >
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 outline-none focus-visible:ring-2 focus-visible:ring-[#FF8A00] rounded-md transition-all"
          aria-label={tAuth("navbar.ariaHome")}
          onClick={closeMobileMenu}
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

        {/* Desktop Navigation */}
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

          {/* Language Switcher desktop */}
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
          type="button"
          className="lg:hidden flex items-center justify-center w-10 h-10 rounded-xl text-[#2A1711] hover:bg-[#FFF8F6] active:bg-[#FFE9E4] transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#FF8A00]"
          onClick={() => setIsMobileMenuOpen((open) => !open)}
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-menu"
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMobileMenuOpen ? (
            <X className="w-6 h-6" strokeWidth={2} />
          ) : (
            <Menu className="w-6 h-6" strokeWidth={2} />
          )}
        </button>

        {/* Mobile backdrop */}
        {isMobileMenuOpen && (
          <button
            type="button"
            aria-label="Close mobile menu"
            className="lg:hidden fixed inset-0 top-16 z-40 bg-black/10 backdrop-blur-[1px]"
            onClick={closeMobileMenu}
          />
        )}

        {/* Mobile Popover */}
        {isMobileMenuOpen && (
          <div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label={tAuth("navbar.ariaLabel")}
            className="lg:hidden absolute top-[calc(100%+10px)] left-3 right-3 z-50 overflow-hidden rounded-2xl border border-[#E8D5CA] bg-[#FFFDFC] shadow-[0_18px_45px_rgba(42,23,17,0.16)]"
          >
            <div className="p-4 sm:p-5">
              

              {/* Navigation links */}
              <div className="flex flex-col gap-1">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;

                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={closeMobileMenu}
                      className={`flex items-center min-h-11 px-3 rounded-xl font-[var(--font-be-vietnam)] text-base font-medium transition-all ${
                        isActive
                          ? "bg-[#FFF0E6] text-[#FF8A00]"
                          : "text-[#2A1711] hover:bg-[#FFF8F6] active:bg-[#FFE9E4]"
                      }`}
                    >
                      <span>{link.label}</span>

                      {isActive && (
                        <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#FF8A00]" />
                      )}
                    </Link>
                  );
                })}
              </div>

              {/* Divider */}
              <div className="my-4 h-px bg-[#EADBD2]" />

              {/* Auth buttons */}
              <div className="flex flex-col gap-2.5">
                {authLinks.map((link, idx) => (
                  <Link
                    key={idx}
                    href={link.href}
                    onClick={closeMobileMenu}
                    className={`flex items-center justify-center min-h-11 w-full px-5 rounded-full font-[var(--font-be-vietnam)] font-semibold text-base transition-all ${
                      link.primary
                        ? "bg-[#FF8A00] text-white hover:bg-[#E67E00] active:bg-[#D96F00] hover:shadow-[0_5px_15px_rgba(255,138,0,0.25)]"
                        : "bg-white text-[#FF8A00] border border-[#FF8A00] hover:bg-[#FFF8F6] active:bg-[#FFF0E6]"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              {/* Language Switcher */}
              <div className="mt-4 flex justify-center">
                <div className="flex items-center gap-1 bg-[#FFF4EF] rounded-full p-1">
                  <button
                    type="button"
                    onClick={() => {
                      setLanguage("id");
                      closeMobileMenu();
                    }}
                    className={`min-w-12 px-3 py-1.5 rounded-full text-sm font-[var(--font-be-vietnam)] font-semibold transition-all ${
                      language === "id"
                        ? "bg-[#FF8A00] text-white shadow-sm"
                        : "text-[#564334] hover:bg-[#FFE9E4]"
                    }`}
                    aria-label="Indonesian"
                    aria-pressed={language === "id"}
                  >
                    ID
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setLanguage("en");
                      closeMobileMenu();
                    }}
                    className={`min-w-12 px-3 py-1.5 rounded-full text-sm font-[var(--font-be-vietnam)] font-semibold transition-all ${
                      language === "en"
                        ? "bg-[#FF8A00] text-white shadow-sm"
                        : "text-[#564334] hover:bg-[#FFE9E4]"
                    }`}
                    aria-label="English"
                    aria-pressed={language === "en"}
                  >
                    EN
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}