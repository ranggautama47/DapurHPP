import { Metadata } from "next";
import { cookies } from "next/headers";
import { ResepDetail } from "@/components/dashboard/resep/ResepDetail";
import { Resep } from "@/types/resep";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string }>;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

async function fetchResep(id: string): Promise<Resep | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth-token")?.value;
  if (!token) return null;
  try {
    const res = await fetch(`${API_BASE_URL}/resep/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const data = await fetchResep(id);
  return {
    title: data ? `${data.nama} — Detail Resep` : "Detail Resep",
    description: data ? `Detail resep ${data.nama}` : "Detail resep",
  };
}

export default async function ResepDetailPage({ params }: PageProps) {
  const { id } = await params;
  const data = await fetchResep(id);
  if (!data) notFound();
  return <ResepDetail initialData={data} />;
}
