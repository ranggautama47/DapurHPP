import type { Metadata } from "next";
import { Suspense } from "react";
import SupplierPageClient from "./page-client";
import SupplierLoading from "./loading";

export const metadata: Metadata = {
  title: "Supplier — DapurHPP",
};

export default function Page() {
  return (
    <Suspense fallback={<SupplierLoading />}>
      <SupplierPageClient />
    </Suspense>
  );
}
