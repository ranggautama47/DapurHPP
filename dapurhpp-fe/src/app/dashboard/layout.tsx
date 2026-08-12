import { cookies } from "next/headers";
import { DashboardShellClient } from "@/components/dashboard/dashboard-shell-client";
import { api } from "@/lib/axios";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let user: {
    id: number;
    name: string;
    email: string;
    emailVerified: boolean;
    namaUsaha: string | null;
    nomorHp: string | null;
    fontSize: string;
    notifAplikasi: boolean;
    notifStok: boolean;
    notifPenjualan: boolean;
    avatarUrl: string | null;
    createdAt: string;
    updatedAt: string;
  } | null = null;

  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth-token")?.value;

    if (token) {
      const res = await api.get("/users/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      user = res.data;
    }
  } catch {
    user = null;
  }

  return (
    <DashboardShellClient user={user}>
      {children}
    </DashboardShellClient>
  );
}