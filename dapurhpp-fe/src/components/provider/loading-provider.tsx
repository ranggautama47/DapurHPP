"use client";

import { Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import DashboardLoading from "@/app/dashboard/loading";

function LoadingProviderInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, [pathname, searchParams]);

  if (loading) return <DashboardLoading />;

  return <>{children}</>;
}

export function LoadingProvider({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<>{children}</>}>
      <LoadingProviderInner>{children}</LoadingProviderInner>
    </Suspense>
  );
}