import { Metadata } from "next";
import { cookies } from "next/headers";
import { BahanBakuDetail } from "@/components/dashboard/bahan-baku/BahanBakuDetail";
import { BahanBaku } from "@/types/bahan-baku";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string }>;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

async function fetchBahanBaku(id: string): Promise<BahanBaku | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth-token")?.value;
  if (!token) {
    return null;
  }
  try {
    const res = await fetch(`${API_BASE_URL}/bahan-baku/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });
    if (!res.ok) {
      return null;
    }
    return res.json();
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const data = await fetchBahanBaku(id);
  return {
    title: data ? `${data.nama} — Detail Bahan Baku` : "Detail Bahan Baku",
    description: data ? `Detail bahan baku ${data.nama} dengan satuan ${data.satuan}` : "Detail bahan baku",
  };
}

export default async function BahanBakuDetailPage({ params }: PageProps) {
  const { id } = await params;

  const data = await fetchBahanBaku(id);
  if (!data) {
    notFound();
  }

  return <BahanBakuDetail initialData={data} />;
}
