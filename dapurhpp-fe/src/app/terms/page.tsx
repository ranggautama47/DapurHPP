import type { Metadata } from "next";

import Link from "next/link";
import { ArrowLeft, Scale, ScaleIcon } from "lucide-react";

export const metadata: Metadata = {
  title: "DapurHPP - Syarat & Ketentuan",
};

export default function TermsAndConditionsPage() {
  return (
    <div className="min-h-screen bg-[#FFF8F6] text-[#2A1711] font-[var(--font-be-vietnam)] selection:bg-[#FF8A00]/20">
      {/* Top Navigation Bar */}
      <header className="border-b border-[#E8D5C4] sticky top-0 bg-[#FFF8F6]/80 backdrop-blur-md z-50">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-semibold text-[#79564B] hover:text-[#914c00] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Beranda
          </Link>
          <span className="text-xs font-bold uppercase tracking-widest text-[#FF8A00] bg-[#FF8A00]/10 px-3 py-1 rounded-full">
            DapurHPP Legal
          </span>
        </div>
      </header>

      {/* Main Content Content */}
      <main className="max-w-3xl mx-auto px-6 py-12 md:py-16">
        {/* Header Section */}
        <div className="mb-12 text-center md:text-left">
          <h1 className="font-[var(--font-playfair)] font-bold text-4xl md:text-5xl tracking-tight mb-4">
            Syarat & Ketentuan
          </h1>
          <p className="text-sm text-[#564334] italic">
            Terakhir Diperbarui: Juli 2026
          </p>
        </div>

        {/* Content Body */}
        <div className="space-y-8 text-[#2A1711] leading-relaxed text-base">
          <p className="text-lg text-[#564334]">
            Selamat datang di DapurHPP. Dengan mendaftar, mengakses, atau menggunakan platform kami, Anda dianggap menyetujui seluruh ketentuan dan aturan main bisnis yang kami tetapkan di bawah ini.
          </p>

          <section className="space-y-3">
            <h2 className="font-[var(--font-playfair)] font-bold text-2xl text-[#914c00]">
              1. Ketentuan Pendaftaran Akun
            </h2>
            <p>
              Layanan ini dirancang khusus untuk mempermudah perhitungan manajerial pelaku usaha UMKM kuliner. Anda diwajibkan untuk:
            </p>
            <ul className="list-disc pl-6 space-y-1.5">
              <li>Menyediakan alamat email aktif dan valid guna keperluan otentikasi login JWT.</li>
              <li>Menjaga kerahasiaan kredensial password Anda demi mencegah penyalahgunaan hak akses oleh pihak lain.</li>
              <li>Satu akun direkomendasikan digunakan untuk satu kesatuan entitas bisnis kuliner (UMKM) agar keaslian perhitungan laba bersih terjaga.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-[var(--font-playfair)] font-bold text-2xl text-[#914c00]">
              2. Akurasi Kalkulasi HPP & Angka Finansial
            </h2>
            <p>
              Sistem DapurHPP menghitung Harga Pokok Produksi (HPP) secara otomatis berdasarkan rumus matematis dinamis yang mengacu pada variabel input data belanja terbaru Anda.
            </p>
            <p className="bg-[#fff1ed] p-4 rounded-xl text-sm border-l-4 border-[#FF8A00] text-[#564334]">
              <strong>Catatan Penting:</strong> Hasil akhir kalkulasi laba/rugi sangat bergantung pada ketepatan dan kedisiplinan pengguna dalam memasukkan riwayat belanja riil dan snapshot penjualan operasional. DapurHPP menyediakan modul alat hitung dan tidak bertanggung jawab atas selisih uang kas fisik akibat kelalaian input data transaksi atau kesalahan manajemen internal warung Anda.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-[var(--font-playfair)] font-bold text-2xl text-[#914c00]">
              3. Kebijakan Batasan Penggunaan Umum
            </h2>
            <p>
              Pengguna dilarang keras mencoba melakukan tindakan eksploitasi, penetrasi celah keamanan (cyber attack) pada sistem backend API NestJS kami, merusak struktur database MySQL via SQL Injection, atau memalsukan JWT token payload untuk memperoleh akses ilegal ke data milik pengguna lain. Pelanggaran terhadap poin ini akan berakibat pada pemblokiran akun secara permanen.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-[var(--font-playfair)] font-bold text-2xl text-[#914c00]">
              4. Perubahan Layanan & Pembaruan Aturan
            </h2>
            <p>
              Platform DapurHPP terus dikembangkan guna memberikan modul laporan keuangan dan grafik performa yang makin komprehensif bagi pengusaha gorengan Indonesia. Oleh karena itu, syarat dan ketentuan ini sewaktu-waktu dapat disesuaikan tanpa pemberitahuan tertulis sebelumnya, dan perubahan akan langsung mengikat setelah dipublikasikan pada halaman ini.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}