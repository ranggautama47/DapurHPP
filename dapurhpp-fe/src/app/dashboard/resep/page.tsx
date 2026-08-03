import type { Metadata } from "next";
import { Suspense } from "react";
import ResepPageClient from "./page-client";
import ResepLoading from "./loading";

export const metadata: Metadata = {
  title: "Resep — DapurHPP",
};

export default function Page() {
  return (
    <Suspense fallback={<ResepLoading />}>
      <ResepPageClient />
    </Suspense>
  );
}
