import type { Metadata } from "next";
import ProdukClient from "./produk-client";

export const metadata: Metadata = {
  title: "Produk — DapurHPP",
  description:
    "Fitur, harga, dan update terbaru DapurHPP untuk pengelolaan HPP bisnis kuliner.",
};

export default function ProdukPage() {
  return <ProdukClient />;
}
