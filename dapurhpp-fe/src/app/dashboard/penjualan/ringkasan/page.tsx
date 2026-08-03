import type { Metadata } from "next";
import { Suspense } from "react";
import RingkasanPageClient from "./page-client";
import PenjualanLoading from "../loading"; // Reuse existing loading skeleton

export const metadata: Metadata = {
  title: "Ringkasan Penjualan — DapurHPP",
};

export default function Page() {
  return (
    <Suspense fallback={<PenjualanLoading />}>
      <RingkasanPageClient />
    </Suspense>
  );
}