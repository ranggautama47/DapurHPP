"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import DashboardLoading from "@/app/dashboard/loading";

export function LoadingProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Setiap kali pathname berubah, set loading true sebentar
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 800); // Durasi minimal
    return () => clearTimeout(timer);
  }, [pathname, searchParams]);

  if (loading) return <DashboardLoading />;

  return <>{children}</>;
}