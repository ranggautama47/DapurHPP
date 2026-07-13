"use client";

const testimonials = [
  {
    rating: 5,
    quote: "DapurHPP sangat membantu saya menghitung modal dan keuntungan. Sekarang usaha saya lebih terkendali!",
    name: "Ibu Siti",
    role: "Penjual Gorengan",
    avatar: "👩",
  },
  {
    rating: 5,
    quote: "Aplikasi yang sederhana tapi sangat berguna. HPP otomatisnya akurat dan mudah dipahami.",
    name: "Pak Budi",
    role: "Pemilik Usaha Camilan",
    avatar: "👨",
  },
  {
    rating: 5,
    quote: "Dengan DapurHPP, saya bisa pantau laba rugi setiap hari. Recommended!",
    name: "Bu Rina",
    role: "Usaha Aneka Gorengan",
    avatar: "👩",
  },
];

export function Testimonials() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="mx-auto max-w-[1500px] px-6">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="font-[var(--font-playfair)] text-3xl md:text-4xl font-bold text-[#2A1711] mb-4">
            Dipercaya oleh Banyak{" "}
            <span className="text-[#FF8A00]">UMKM</span>
          </h2>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, idx) => (
            <div
              key={idx}
              className="bg-[#FFF8F6] rounded-2xl p-6 border border-[#DDC1AE]/30 hover:border-[#FF8A00]/30 hover:shadow-[0_8px_30px_rgba(255,138,0,0.08)] transition-all duration-300"
            >
              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <span key={i} className="text-[#FF8A00] text-lg">⭐</span>
                ))}
              </div>

              {/* Quote */}
              <blockquote className="text-[#2A1711] text-sm leading-relaxed mb-6">
                "{testimonial.quote}"
              </blockquote>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-[#FFE2DA] rounded-full flex items-center justify-center text-2xl">
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="font-semibold text-[#2A1711]">
                    {testimonial.name}
                  </div>
                  <div className="text-xs text-[#564334]">
                    {testimonial.role}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}