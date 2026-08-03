import type { Metadata } from "next";
import { Suspense } from "react";
import PengaturanPageClient from "./page-client";
import PengaturanLoading from "./loading";

export const metadata: Metadata = {
  title: "Pengaturan — DapurHPP",
};

export default function Page() {
  return (
    <Suspense fallback={<PengaturanLoading />}>
      <PengaturanPageClient />
    </Suspense>
  );
}
