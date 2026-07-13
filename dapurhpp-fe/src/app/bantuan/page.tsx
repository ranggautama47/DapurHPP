import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/landingpage/footer";

export const metadata: Metadata = {
  title: "Bantuan — DapurHPP",
  description: "Pusat bantuan dan panduan penggunaan DapurHPP.",
};

export default function BantuanPage() {
  return (
    <main className="min-h-screen bg-[#FFF8F6]">
      <Navbar />
      <div className="pt-24 pb-16 mx-auto max-w-[1200px] px-6">
        <h1 className="font-[var(--font-playfair)] font-bold text-4xl text-[#2A1711] mb-4">
          Bantuan
        </h1>
        <p className="text-[#564334] text-lg mb-16">
          Temukan jawaban dan panduan penggunaan DapurHPP di sini.
        </p>

        {/* Section: Pusat Bantuan */}
        <section id="pusat-bantuan" className="mb-16">
          <h2 className="font-[var(--font-playfair)] font-bold text-2xl text-[#2A1711] mb-6">
            Pusat Bantuan
          </h2>
          <div className="max-w-2xl mb-8">
            <input
              type="search"
              placeholder="Cari artikel bantuan..."
              className="w-full px-6 py-4 bg-white border border-[#F5E6D8] rounded-full text-[#2A1711] placeholder-[#8D6E63] focus:outline-none focus:border-[#FF8A00] focus:ring-2 focus:ring-[#FF8A00]/20"
              disabled
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { title: "Akun", desc: "Registrasi, login, reset password, dan pengaturan profil." },
              { title: "HPP & Resep", desc: "Cara menghitung HPP, manajemen resep, dan bahan baku." },
              { title: "Billing", desc: "Paket langganan, pembayaran, dan manajemen tagihan." },
            ].map((cat) => (
              <div key={cat.title} className="bg-white rounded-2xl border border-[#F5E6D8] p-6 hover:border-[#CCE8CC] transition-colors">
                <h3 className="font-bold text-lg text-[#2A1711] mb-2">{cat.title}</h3>
                <p className="text-sm text-[#564334]">{cat.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Section: Panduan */}
        <section id="panduan" className="mb-16">
          <h2 className="font-[var(--font-playfair)] font-bold text-2xl text-[#2A1711] mb-6">
            Panduan Penggunaan
          </h2>
          <ol className="space-y-4 max-w-2xl">
            {[
              "Daftar akun baru di halaman Registrasi, lalu login.",
              "Tambahkan bahan baku beserta harganya di menu Bahan Baku.",
              "Buat resep gorengan Anda di menu Resep — HPP akan terhitung otomatis.",
              "Catat belanja bahan di menu Belanja untuk update harga terkini.",
              "Masukkan data produksi dan penjualan harian untuk melihat laporan laba rugi.",
            ].map((step, i) => (
              <li key={i} className="flex gap-4 p-4 bg-white rounded-2xl border border-[#F5E6D8]">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[#FFF3E8] text-[#FF8A00] font-bold flex items-center justify-center text-lg">
                  {i + 1}
                </span>
                <p className="text-[#564334] leading-relaxed pt-1">{step}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* Section: FAQ */}
        <section id="faq">
          <h2 className="font-[var(--font-playfair)] font-bold text-2xl text-[#2A1711] mb-6">
            Pertanyaan Sering Diajukan (FAQ)
          </h2>
          <div className="space-y-3 max-w-2xl">
            {[
              {
                q: "Apakah DapurHPP bisa dipakai untuk usaha selain gorengan?",
                a: "Ya, logika kalkulasi HPP berlaku untuk berbagai jenis makanan, namun fitur awal difokuskan untuk gorengan."
              },
              {
                q: "Bagaimana cara reset password jika lupa?",
                a: "Klik 'Lupa Kata Sandi?' di halaman login, masukkan email terdaftar, dan ikuti tautan reset yang dikirim ke email Anda."
              },
              {
                q: "Apakah data resep dan keuangan saya aman?",
                a: "Ya. Semua data dienkripsi dan hanya bisa diakses oleh akun Anda. Kami tidak menjual atau membagikan data ke pihak ketiga."
              },
              {
                q: "Bisakah saya ekspor laporan ke Excel/PDF?",
                a: "Fitur ekspor sedang dalam pengembangan dan akan segera hadir di update mendatang."
              },
            ].map((faq, i) => (
              <details key={i} className="group bg-white rounded-2xl border border-[#F5E6D8] overflow-hidden">
                <summary className="flex items-center justify-between p-5 cursor-pointer list-none">
                  <p className="font-semibold text-[#2A1711] pr-8">{faq.q}</p>
                  <span className="flex-shrink-0 w-5 h-5 text-[#FF8A00] transition-transform group-open:rotate-180">▼</span>
                </summary>
                <div className="px-5 pb-5 border-t border-[#F5E6D8] text-[#564334] leading-relaxed">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </section>
      </div>
      <Footer />
    </main>
  );
}