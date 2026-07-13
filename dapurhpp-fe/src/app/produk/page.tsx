import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/landingpage/footer";

export const metadata: Metadata = {
  title: "Produk — DapurHPP",
  description: "Fitur lengkap DapurHPP untuk UMKM kuliner gorengan.",
};

export default function ProdukPage() {
  return (
    <main className="min-h-screen bg-[#FFF8F6]">
      <Navbar />
      <div className="pt-24 pb-16 mx-auto max-w-[1200px] px-6">
        <h1 className="font-[var(--font-playfair)] font-bold text-4xl text-[#2A1711] mb-4">
          Produk
        </h1>
        <p className="text-[#564334] text-lg mb-16">
          Semua fitur yang kamu butuhkan untuk kelola bisnis kuliner.
        </p>

        {/* Section: Fitur */}
        <section id="fitur" className="mb-16">
          <h2 className="font-[var(--font-playfair)] font-bold text-2xl text-[#2A1711] mb-6">
            Fitur Unggulan
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {["Kalkulasi HPP Otomatis", "Manajemen Bahan Baku", "Laporan Laba Rugi",
              "Riwayat Harga Bahan", "Manajemen Produksi", "Pencatatan Penjualan"].map((f) => (
              <div key={f} className="bg-white rounded-2xl border border-[#F5E6D8] p-6 shadow-sm hover:shadow-md transition-shadow hover:border-[#CCE8CC]">
                <div className="w-10 h-10 rounded-full bg-[#FFF3E8] flex items-center justify-center mb-4">
                  <span className="text-[#FF8A00] text-lg">✦</span>
                </div>
                <h3 className="font-semibold text-[#2A1711] mb-2">{f}</h3>
                <p className="text-sm text-[#564334]">Deskripsi dummy fitur {f} untuk UMKM kuliner.</p>
              </div>
            ))}
          </div>
        </section>

        {/* Section: Harga */}
        <section id="harga" className="mb-16">
          <h2 className="font-[var(--font-playfair)] font-bold text-2xl text-[#2A1711] mb-6">
            Harga
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
            {[
              { plan: "Gratis", price: "Rp 0", desc: "Untuk UMKM yang baru mulai.", color: "#CCE8CC" },
              { plan: "Pro", price: "Rp 99.000/bln", desc: "Untuk bisnis yang sudah berkembang.", color: "#FF8A00" },
            ].map((p) => (
              <div key={p.plan} className="bg-white rounded-2xl border-2 p-6" style={{ borderColor: p.color }}>
                <h3 className="font-bold text-xl text-[#2A1711] mb-1">{p.plan}</h3>
                <p className="text-2xl font-bold mb-3" style={{ color: p.color }}>{p.price}</p>
                <p className="text-sm text-[#564334]">{p.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Section: Update */}
        <section id="update">
          <h2 className="font-[var(--font-playfair)] font-bold text-2xl text-[#2A1711] mb-6">
            Update Terbaru
          </h2>
          <div className="space-y-4 max-w-2xl">
            {[
              { ver: "v1.2.0", date: "Juli 2026", desc: "Tambah fitur laporan mingguan otomatis." },
              { ver: "v1.1.0", date: "Juni 2026", desc: "Perbaikan kalkulasi HPP multi-bahan." },
              { ver: "v1.0.0", date: "Mei 2026", desc: "Rilis perdana DapurHPP." },
            ].map((u) => (
              <div key={u.ver} className="flex gap-4 p-4 bg-white rounded-2xl border border-[#F5E6D8]">
                <span className="text-xs font-bold bg-[#CCE8CC] text-[#2A1711] px-2 py-1 rounded-full h-fit">{u.ver}</span>
                <div>
                  <p className="text-xs text-[#564334] mb-1">{u.date}</p>
                  <p className="text-sm text-[#2A1711]">{u.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
      <Footer />
    </main>
  );
}