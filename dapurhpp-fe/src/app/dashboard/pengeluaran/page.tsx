import type { Metadata } from "next";
import { Suspense } from "react";
import PengeluaranPageClient from "./page-client";

export const metadata: Metadata = {
  title: "Pengeluaran Lain-lain — DapurHPP",
};

function LoadingFallback() {
  return (
    <div className="mx-auto max-w-[1500px] space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-pulse">
        <div>
          <div className="h-10 bg-[#F5E6D8] rounded-xl w-[250px] mb-2" />
          <div className="h-5 bg-[#F5E6D8] rounded-lg w-[380px]" />
        </div>
        <div className="h-12 bg-[#F5E6D8] rounded-full w-[180px]" />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-[24px] border border-[#DDC1AE] p-5 animate-pulse"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-xl bg-[#F5E6D8]" />
              <div className="h-3 bg-[#F5E6D8] rounded-lg w-[100px]" />
            </div>
            <div className="h-8 bg-[#F5E6D8] rounded-lg w-[60%]" />
          </div>
        ))}
      </div>

      <div className="bg-white rounded-[24px] border border-[#DDC1AE] p-8 animate-pulse">
        <div className="h-6 bg-[#F5E6D8] rounded-lg w-[200px] mx-auto mb-3" />
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <PengeluaranPageClient />
    </Suspense>
  );
}
