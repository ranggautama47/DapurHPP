import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, Lock, Eye } from "lucide-react";

export const metadata: Metadata = {
  title: "DapurHPP - Kebijakan Privasi",
  description: "Kebijakan privasi DapurHPP - aplikasi hitung HPP & keuntungan untuk UMKM Gorengan",
};

export default function PrivacyPolicyPage() {
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
            Kebijakan Privasi
          </h1>
          <p className="text-sm text-[#564334] italic">
            Terakhir Diperbarui: Juli 2026
          </p>
        </div>

        {/* Highlight Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          <div className="bg-[#fff1ed] p-5 rounded-2xl border border-[#ffe2da]">
            <ShieldCheck className="w-6 h-6 text-[#914c00] mb-3" />
            <h3 className="font-semibold text-sm mb-1">Data Aman</h3>
            <p className="text-xs text-[#564334]/80 leading-relaxed">Formulasi resep dan harga bahan Anda dilindungi dengan enkripsi ketat.</p>
          </div>
          <div className="bg-[#fff1ed] p-5 rounded-2xl border border-[#ffe2da]">
            <Lock className="w-6 h-6 text-[#914c00] mb-3" />
            <h3 className="font-semibold text-sm mb-1">Kepemilikan Penuh</h3>
            <p className="text-xs text-[#564334]/80 leading-relaxed">Data produksi dan riwayat laba rugi murni milik UMKM Anda sendiri.</p>
          </div>
          <div className="bg-[#fff1ed] p-5 rounded-2xl border border-[#ffe2da]">
            <Eye className="w-6 h-6 text-[#914c00] mb-3" />
            <h3 className="font-semibold text-sm mb-1">Transparansi</h3>
            <p className="text-xs text-[#564334]/80 leading-relaxed">Kami tidak akan pernah menjual atau membagikan rahasia dapur bisnis Anda.</p>
          </div>
        </div>

        {/* Content Body */}
        <div className="space-y-8 text-[#2A1711] leading-relaxed text-base">
          <section className="space-y-3">
            <h2 className="font-[var(--font-playfair)] font-bold text-2xl text-[#914c00]">
              1. Informasi yang Kami Kumpulkan
            </h2>
            <p>
              DapurHPP mengumpulkan data yang Anda masukkan secara sadar untuk keperluan kalkulasi bisnis kuliner Anda, yang mencakup:
            </p>
            <ul className="list-disc pl-6 space-y-1.5">
              <li><strong>Informasi Akun:</strong> Nama Lengkap, Alamat Email, Kata Sandi (dienkripsi dengan Bcrypt), dan Nama Bisnis Kuliner Anda.</li>
              <li><strong>Data Operasional Dapur:</strong> Daftar Bahan Baku, Supplier, Formula Resep, Biaya Belanja, Data Produksi, Snapshot Harga Jual, serta riwayat Pengeluaran Lain.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-[var(--font-playfair)] font-bold text-2xl text-[#914c00]">
              2. Penggunaan Informasi Anda
            </h2>
            <p>
              Semua data operasional yang Anda masukkan ke dalam sistem diolah semata-mata untuk memberikan visualisasi finansial yang akurat bagi Anda sendiri, antara lain:
            </p>
            <ul className="list-disc pl-6 space-y-1.5">
              <li>Menghitung Harga Pokok Produksi (HPP) gorengan secara dinamis dan real-time berdasarkan belanja terbaru.</li>
              <li>Menyajikan grafik ringkasan keuntungan, akumulasi kerugian, serta performa penjualan berkala pada dasbor Anda.</li>
              <li>Memvalidasi kepemilikan data (JWT Identity Verification Check) agar pengguna lain tidak dapat mengintip resep dapur Anda.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-[var(--font-playfair)] font-bold text-2xl text-[#914c00]">
              3. Keamanan Informasi Finansial
            </h2>
            <p>
              Kami mengimplementasikan protokol pengamanan standar industri menggunakan JWT Token Ownership berbasis Guard di NestJS untuk menjaga agar API endpoints aman dari manipulasi eksternal. Password Anda diproteksi menggunakan hashing salt searah sehingga mustahil dibaca secara manual bahkan oleh tim administrator DapurHPP.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-[var(--font-playfair)] font-bold text-2xl text-[#914c00]">
              4. Hak Akses Data UMKM Anda
            </h2>
            <p>
              Sebagai pemilik bisnis, Anda memiliki kendali penuh atas data Anda sendiri. Anda dapat melakukan penambahan, perubahan resep, maupun penghapusan records operasional (termasuk mekanisme *soft-delete* pada master bahan baku agar tidak merusak kalkulasi data transaksi masa lalu).
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}