"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { ConfirmDeleteDialog } from "@/components/ui/confirm-delete-dialog";
import { toast } from "sonner";
import { api } from "@/lib/axios";
import { Produksi } from "@/types/produksi";
import { ProduksiDetail } from "@/components/dashboard/produksi";

export default function ProduksiDetailClient({ id }: { id: string }) {
  const router = useRouter();
  const produksiId = Number(id);
  const [produksi, setProduksi] = useState<Produksi | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const fetchDetail = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await api.get<Produksi>(`/produksi/${produksiId}`);
      setProduksi(res.data);
    } catch (err: any) {
      setError(
        err.response?.data?.message ?? "Gagal memuat detail produksi",
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, [produksiId]);

  const handleSelesaikan = async () => {
    if (
      !window.confirm(
        "Selesaikan produksi ini? Status akan menjadi SELESAI dan data tidak bisa diubah lagi.",
      )
    )
      return;
    setActionLoading(true);
    try {
      await api.patch(`/produksi/${produksiId}/selesai`);
      toast.success("Produksi ditandai selesai");
      await fetchDetail();
    } catch (err: any) {
      alert(
        err.response?.data?.message || "Gagal menyelesaikan produksi",
      );
      toast.error("Gagal menyelesaikan produksi — coba lagi");
    } finally {
      setActionLoading(false);
    }
  };

  const handleBatal = async () => {
    setActionLoading(true);
    try {
      await api.delete(`/produksi/${produksiId}`);
      toast.success("Data berhasil dihapus");
      setShowDeleteConfirm(false);
      await fetchDetail();
    } catch (err: any) {
      toast.error("Gagal menghapus data");
      setShowDeleteConfirm(false);
    } finally {
      setActionLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-[1500px] animate-pulse">
        <div className="h-6 bg-[#F5E6D8] rounded-lg w-48 mb-6" />
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="h-96 bg-[#F5E6D8] rounded-[24px]" />
          <div className="lg:col-span-2 h-96 bg-[#F5E6D8] rounded-[24px]" />
          <div className="h-96 bg-[#F5E6D8] rounded-[24px]" />
        </div>
      </div>
    );
  }

  if (error || !produksi) {
    return (
      <div className="mx-auto max-w-[1500px]">
        <button
          onClick={() => router.push("/dashboard/produksi")}
          className="flex items-center gap-2 text-[#FF8A00] hover:underline mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali
        </button>
        <div className="p-6 rounded-2xl bg-[#FEE2E2] border border-[#FCA5A5] text-[#EF4444]">
          {error || "Produksi tidak ditemukan"}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1500px]">
      <div className="flex items-center gap-2 text-sm text-[#8A7362] mb-6">
        <button
          onClick={() => router.push("/dashboard/produksi")}
          className="flex items-center gap-2 text-[#FF8A00] hover:underline"
        >
          <ArrowLeft className="w-4 h-4" /> Produksi
        </button>
        <span>/</span>
        <span className="text-[#2A1711] font-medium">Detail Produksi</span>
      </div>

      <ProduksiDetail
        produksi={produksi}
        onSelesaikan={produksi.status === "DRAFT" ? handleSelesaikan : undefined}
        onBatal={produksi.status === "DRAFT" ? () => setShowDeleteConfirm(true) : undefined}
        isActionLoading={actionLoading}
      />
      <ConfirmDeleteDialog
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        onConfirm={handleBatal}
        title="Batalkan produksi ini?"
        description="Status akan menjadi BATAL."
        isLoading={actionLoading}
      />
    </div>
  );
}
