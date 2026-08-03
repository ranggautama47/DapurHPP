import type { Metadata } from "next";
import { Suspense } from "react";
import LaporanPageClient from "./page-client";
import LaporanLoading from "./loading";

export const metadata: Metadata = {
  title: "Laporan — DapurHPP",
};

export default function Page() {
  return (
    <Suspense fallback={<LaporanLoading />}>
      <LaporanPageClient />
    </Suspense>
  );
}