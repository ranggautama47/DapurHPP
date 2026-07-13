"use client";

import { Navbar, Hero, FeaturesGrid, Benefits, Testimonials, CtaBanner, Footer } from "@/components/landingpage";

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <FeaturesGrid />
      <Benefits />
      <Testimonials />
      <CtaBanner />
      <Footer />
    </main>
  );
}