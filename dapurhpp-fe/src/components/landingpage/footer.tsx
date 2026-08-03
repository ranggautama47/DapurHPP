"use client";

import { Mail, Phone, MapPin } from "lucide-react";
import { useState, useEffect } from "react";
import { useTranslation } from "@/context/language-context";

export function Footer() {
  const { t } = useTranslation("landing");

  const footerLinks = {
    produk: [
      { label: t("footer.links.product"), href: "/produk" },
      { label: t("footer.links.pricing"), href: "/produk#harga" },
      { label: t("footer.links.update"), href: "/produk#update" },
    ],
    perusahaan: [
      { label: t("footer.links.about"), href: "/perusahaan" },
      { label: t("footer.links.careers"), href: "/perusahaan#karir" },
      { label: t("footer.links.contact"), href: "/perusahaan#kontak" },
    ],
    bantuan: [
      { label: t("footer.links.helpCenter"), href: "/bantuan" },
      { label: t("footer.links.guides"), href: "/bantuan#panduan" },
      { label: t("footer.links.faq"), href: "/bantuan#faq" },
    ],
  };

  const kontakData = [
    { icon: Mail, label: "halo@dapurhpp.id" },
    { icon: Phone, label: "0812-3456-7890" },
    { icon: MapPin, label: "Indonesia" },
  ];

  const socialLinks = [
    {
      href: "#",
      label: "Facebook",
      svg: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      ),
    },
    {
      href: "#",
      label: "Instagram",
      svg: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 100-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 100-2.881z"/>
        </svg>
      ),
    },
    {
      href: "#",
      label: "Youtube",
      svg: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
      ),
    },
  ];
  
  // Set default tahun awal aplikasi (2026)
  const [currentYear, setCurrentYear] = useState(2026);

  useEffect(() => {
    // Ini hanya berjalan di sisi client, jadi aman dari Hydration Mismatch
    setCurrentYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="bg-[#412B24] text-[#FFEDE8]">
      <div className="mx-auto max-w-[1500px] px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 mb-12">
          {/* Column 1: Logo & Brand */}
          <div className="col-span-2 md:col-span-3 lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <img
                src="/iconDapurHpp.png"
                alt="Logo DapurHPP"
                className="h-10 w-auto object-contain"
              />
            </div>
            <p className="text-sm text-[#FFEDE8]/70 mb-4 leading-relaxed">
              {t("footer.tagline")}
            </p>
            {/* Social Icons - NON-CLICKABLE */}
            <div className="flex gap-3">
              {socialLinks.map((social, idx) => (
                <span
                  key={idx}
                  className="w-10 h-10 bg-[#FFEDE8]/10 rounded-full flex items-center justify-center opacity-70 cursor-default"
                  aria-hidden="true"
                >
                  {social.svg}
                </span>
              ))}
            </div>
          </div>

          {/* Column 2: Produk */}
          <div>
            <h3 className="font-semibold text-white mb-4">{t("footer.sections.products")}</h3>
            <ul className="space-y-2">
              {footerLinks.produk.map((link, idx) => (
                <li key={idx}>
                  <a
                    href={link.href}
                    className="text-sm text-[#FFEDE8]/70 hover:text-[#FF8A00] focus-visible:text-[#E2B6CF] transition-colors outline-none"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Perusahaan */}
          <div>
            <h3 className="font-semibold text-white mb-4">{t("footer.sections.company")}</h3>
            <ul className="space-y-2">
              {footerLinks.perusahaan.map((link, idx) => (
                <li key={idx}>
                  <a
                    href={link.href}
                    className="text-sm text-[#FFEDE8]/70 hover:text-[#FF8A00] focus-visible:text-[#E2B6CF] transition-colors outline-none"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Bantuan */}
          <div>
            <h3 className="font-semibold text-white mb-4">{t("footer.sections.help")}</h3>
            <ul className="space-y-2">
              {footerLinks.bantuan.map((link, idx) => (
                <li key={idx}>
                  <a
                    href={link.href}
                    className="text-sm text-[#FFEDE8]/70 hover:text-[#FF8A00] focus-visible:text-[#E2B6CF] transition-colors outline-none"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 5: Kontak */}
          <div>
            <h3 className="font-semibold text-white mb-4">{t("footer.sections.contact")}</h3>
            <ul className="space-y-3">
              {kontakData.map((item, idx) => (
                <li
                  key={idx}
                  className="flex items-center gap-2 text-sm text-[#FFEDE8]/70 cursor-default"
                >
                  <item.icon className="w-4 h-4 flex-shrink-0" />
                  <span>{item.label}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#FFEDE8]/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-[#FFEDE8]/60">
              {t("footer.copyright").replace("{year}", currentYear)}
            </p>
            <div className="flex flex-wrap items-center gap-6">
               <a
                 href="/privacy"
                 className="text-sm text-[#FFEDE8]/60 hover:text-[#FF8A00] transition-colors"
               >
                 {t("footer.links.privacy")}
               </a>
               <a
                 href="/terms"
                 className="text-sm text-[#FFEDE8]/60 hover:text-[#FF8A00] transition-colors"
               >
                 {t("footer.links.terms")}
               </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}