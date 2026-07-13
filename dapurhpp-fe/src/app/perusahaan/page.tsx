import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/landingpage/footer";


export const metadata: Metadata = {
  title: "Perusahaan — DapurHPP",
  description: "Tentang tim dan misi DapurHPP.",
};

export default function PerusahaanPage() {
  return (
    <main className="min-h-screen bg-[#FFF8F6]">
      <Navbar />
      <div className="pt-24 pb-16 mx-auto max-w-[1200px] px-6">
        <h1 className="font-[var(--font-playfair)] font-bold text-4xl text-[#2A1711] mb-4">
          Perusahaan
        </h1>
        <p className="text-[#564334] text-lg mb-16">
          Misi kami mempermudah UMKM kuliner mengelola bisnis dengan cerdas.
        </p>

        {/* Section: Tentang Kami */}
        <section id="tentang-kami" className="mb-16">
          <h2 className="font-[var(--font-playfair)] font-bold text-2xl text-[#2A1711] mb-6">
            Tentang Kami
          </h2>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-4 text-[#564334] leading-relaxed">
              <p>
                DapurHPP lahir dari pengalaman nyata melihat UMKM gorengan
                kesulitan menghitung modal, HPP, dan keuntungan secara akurat.
                Banyak yang masih mencatat manual di kertas, ragu harga bahan
                naik turun, dan tak tahu apakah usahanya untung atau rugi.
              </p>
              <p>
                Kami hadir sebagai solusi digital yang sederhana, otomatis, dan
                terpercaya. Dengan DapurHPP, para pengusaha gorengan bisa fokus
                menggoreng dan melayani pelanggan — biarkan kami yang urus
                perhitungan angka-angkanya.
              </p>
            </div>
            <div className="bg-[#FFE2DA] rounded-2xl aspect-video flex items-center justify-center overflow-hidden">
              <img
                src="landingpage/software-team.jpg"
                alt="Tim DapurHPP"
                draggable={false}
                className="object-coverpointer-events-none select-none"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </section>

        {/* Section: Karir */}
        <section id="karir" className="mb-16">
          <h2 className="font-[var(--font-playfair)] font-bold text-2xl text-[#2A1711] mb-6">
            Karir
          </h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-2xl">
            {[
              {
                title: "Fullstack Developer",
                type: "Full-time",
                location: "Remote / Jakarta",
                status: "Buka",
              },
              {
                title: "UI/UX Designer",
                type: "Full-time",
                location: "Remote / Bandung",
                status: "Buka",
              },
            ].map((job) => (
              <div
                key={job.title}
                className="bg-white rounded-2xl border border-[#F5E6D8] p-6 shadow-sm"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-lg text-[#2A1711]">
                    {job.title}
                  </h3>
                  <span className="text-xs font-bold bg-[#CCE8CC] text-[#2A1711] px-2 py-1 rounded-full">
                    {job.status}
                  </span>
                </div>
                <p className="text-sm text-[#564334] mb-1">
                  {job.type} · {job.location}
                </p>
                <p className="text-sm text-[#564334]">
                  Deskripsi lowongan dummy untuk posisi {job.title} di DapurHPP.
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Section: Kontak */}
        <section id="kontak">
          <h2 className="font-[var(--font-playfair)] font-bold text-2xl text-[#2A1711] mb-6">
            Kontak
          </h2>
          <div className="max-w-xl">
            <p className="text-sm text-[#FF8A00] font-semibold mb-4">
              Segera Hadir
            </p>
            <form className="space-y-4 bg-white rounded-2xl border border-[#F5E6D8] p-6">
              <div>
                <label className="block text-sm font-medium text-[#2A1711] mb-1">
                  Nama
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 bg-[#FFF8F6] border border-[#F5E6D8] rounded-lg text-[#2A1711] placeholder-[#8D6E63]"
                  placeholder="Nama Anda"
                  disabled
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#2A1711] mb-1">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full px-4 py-2 bg-[#FFF8F6] border border-[#F5E6D8] rounded-lg text-[#2A1711] placeholder-[#8D6E63]"
                  placeholder="email@contoh.com"
                  disabled
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#2A1711] mb-1">
                  Pesan
                </label>
                <textarea
                  rows={4}
                  className="w-full px-4 py-2 bg-[#FFF8F6] border border-[#F5E6D8] rounded-lg text-[#2A1711] placeholder-[#8D6E63] resize-none"
                  placeholder="Tulis pesan Anda di sini..."
                  disabled
                />
              </div>
              <button
                type="submit"
                className="w-full px-6 py-3 bg-[#FF8A00] text-white font-semibold rounded-full hover:bg-[#E67E00] transition-colors opacity-50 cursor-not-allowed"
                disabled
              >
                Kirim Pesan
              </button>
            </form>
          </div>
        </section>
      </div>
      <Footer />
    </main>
  );
}
