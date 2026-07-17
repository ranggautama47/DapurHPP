import type { Metadata } from "next";
import { Suspense } from "react";
import ProduksiDetailClient from "./page-client";

export const metadata: Metadata = {
  title: "Detail Produksi — DapurHPP",
};

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-[1500px] animate-pulse">
          <div className="h-6 bg-[#F5E6D8] rounded-lg w-48 mb-6" />
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="h-96 bg-[#F5E6D8] rounded-[24px]" />
            <div className="lg:col-span-2 h-96 bg-[#F5E6D8] rounded-[24px]" />
            <div className="h-96 bg-[#F5E6D8] rounded-[24px]" />
          </div>
        </div>
      }
    >
      <ProduksiDetailClient id={id} />
    </Suspense>
  );
}