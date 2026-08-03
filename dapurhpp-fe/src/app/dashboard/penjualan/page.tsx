import type { Metadata } from "next";
import { Suspense } from "react";
import PenjualanPageClient from "./page-client";
import PenjualanLoading from "./loading";

export const metadata: Metadata = {
  title: "Penjualan — DapurHPP",
};

export default function Page() {
  return (
    <Suspense fallback={<PenjualanLoading />}>
      <PenjualanPageClient />
    </Suspense>
  );
}