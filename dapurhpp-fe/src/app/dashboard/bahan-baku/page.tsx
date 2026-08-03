import type { Metadata } from "next";
import { Suspense } from "react";
import BahanBakuPageClient from "./page-client";
import BahanbakuLoading from "./loading";

export const metadata: Metadata = {
  title: "Master Bahan Baku — DapurHPP",
  description:
    "Kelola master data bahan baku dan harga untuk perhitungan HPP otomatis.",
};

export default function Page() {
  return (
  <Suspense fallback={<BahanbakuLoading />}>
    <BahanBakuPageClient />;
  </Suspense>
  );
}
