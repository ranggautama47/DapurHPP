import type { Metadata } from "next";
import { Suspense } from "react";
import ActivityPageClient from "./page-client";
import AktivitasLoading from "./loading";

export const metadata: Metadata = {
  title: "Aktivitas — DapurHPP",
  description:
    "Pantau riwayat aktivitas dan perubahan yang terjadi di aplikasi DapurHPP.",
};

export const dynamic = "force-dynamic";

export default function AktivitasPage() {
  return (
    <Suspense fallback={<AktivitasLoading />}>
      <ActivityPageClient />
    </Suspense>
  );
}
