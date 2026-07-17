import type { Metadata } from "next";
import { Suspense } from "react";
import BelanjaPageClient from "./page-client";
import BenlanjaLoading from "./loading";
("./page-client");

export const metadata: Metadata = {
  title: "Belanja — DapurHPP",
};

export default function Page() {
  return (
    <Suspense fallback={<BenlanjaLoading />}>
      <BelanjaPageClient />
    </Suspense>
  );
}
