import type { Metadata } from "next";
import PerusahaanClient from "./perusahaan-client";

export const metadata: Metadata = {
  title: "Perusahaan — DapurHPP",
  description:
    "Kenali DapurHPP, solusi pengelolaan HPP untuk bisnis kuliner Anda.",
};

export default function PerusahaanPage() {
  return <PerusahaanClient />;
}
