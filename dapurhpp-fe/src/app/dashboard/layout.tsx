import { DashboardShellClient } from "@/components/dashboard/dashboard-shell-client";
import { api } from "@/lib/axios";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Fetch user profile on server
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
    const res = await api.get("/users/profile");
    user = res.data;
  } catch {
    user = null;
  }

  return (
    <DashboardShellClient user={user}>
      {children}
    </DashboardShellClient>
  );
}