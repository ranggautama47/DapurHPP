import type { Metadata } from "next";
import { Suspense } from "react";
import ProduksiPageClient from "./page-client";
import ProduksiLoading from "./loading";

export const metadata: Metadata = {
  title: "Produksi — DapurHPP",
};

export default function Page() {
  return (
    <Suspense fallback={<ProduksiLoading />}>
      <ProduksiPageClient />
    </Suspense>
  );
}
