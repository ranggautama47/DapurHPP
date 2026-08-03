import type { Metadata } from "next";
import BantuanClient from "./bantuan-client";

export const metadata: Metadata = {
  title: "Bantuan — DapurHPP",
  description:
    "Kelola master data bahan baku dan harga untuk perhitungan HPP otomatis.",
};

export default function BantuanPage() {
  return <BantuanClient />;
}
