"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ShoppingCart, Trash2 } from "lucide-react";
import { BelanjaDetail } from "@/types/belanja";
import { ConfirmDeleteDialog } from "@/components/ui/confirm-delete-dialog";
import { toast } from "sonner";
import { api } from "@/lib/axios";

export default function BelanjaDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [data, setData] = useState<BelanjaDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const fetchDetail = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await api.get<BelanjaDetail>(`/belanja/${params.id}`);
      setData(res.data);
    } catch (err) {
      setError("Gagal memuat detail belanja.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (params.id) fetchDetail();
  }, [params.id]);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await api.delete(`/belanja/${params.id}`);
      toast.success("Data berhasil dihapus");
      setShowDeleteConfirm(false);
      router.push("/dashboard/belanja");
    } catch (err) {
      toast.error("Gagal menghapus data");
      setShowDeleteConfirm(false);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="mx-auto max-w-[1500px]">
      <Link
        href="/dashboard/belanja"
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#DDC1AE] text-[#564334] font-medium font-[var(--font-be-vietnam)] hover:bg-[#FFF8F6] hover:border-[#FF8A00] hover:text-[#FF8A00] transition-all mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        Kembali
      </Link>

      {isLoading ? (
        <div className="p-8 text-center text-[#8A7362]">
          <div className="w-8 h-8 border-4 border-[#FFE9E4] border-t-[#FF8A00] rounded-full animate-spin mx-auto mb-3" />
          Memuat detail...
        </div>
      ) : error || !data ? (
        <div className="flex flex-col items-center justify-center py-16">
          <ShoppingCart className="w-16 h-16 text-[#DDC1AE] mb-4" />
          <p className="text-[#564334] text-lg">{error || "Belanja tidak ditemukan"}</p>
        </div>
      ) : (
        <>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="font-[var(--font-playfair)] font-bold text-3xl md:text-4xl text-[#2A1711] mb-1">
                Detail Belanja
              </h1>
              <p className="text-[#564334] text-lg">
                {new Date(data.tanggal).toLocaleDateString("id-ID", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              disabled={isDeleting}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border-2 border-[#EF4444] text-[#EF4444] font-medium hover:bg-[#FEE2E2] disabled:opacity-50 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              {isDeleting ? "Menghapus..." : "Hapus Belanja"}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-[24px] border border-[#DDC1AE] p-5 shadow-[0_8px_30px_rgba(109,76,65,0.08)]">
              <p className="text-xs text-[#8A7362] font-medium mb-1">Total Belanja</p>
              <p className="font-[var(--font-roboto-mono)] font-bold text-2xl text-[#06D6A0]">
                Rp {data.totalBelanja.toLocaleString("id-ID")}
              </p>
            </div>
            <div className="bg-white rounded-[24px] border border-[#DDC1AE] p-5 shadow-[0_8px_30px_rgba(109,76,65,0.08)]">
              <p className="text-xs text-[#8A7362] font-medium mb-1">Jumlah Item</p>
              <p className="font-[var(--font-roboto-mono)] font-bold text-2xl text-[#2A1711]">
                {data.detailBelanja.length} item
              </p>
            </div>
            {data.catatan && (
              <div className="bg-white rounded-[24px] border border-[#DDC1AE] p-5 shadow-[0_8px_30px_rgba(109,76,65,0.08)] sm:col-span-1">
                <p className="text-xs text-[#8A7362] font-medium mb-1">Catatan</p>
                <p className="text-[#564334]">{data.catatan}</p>
              </div>
            )}
          </div>

          <div className="bg-white rounded-[24px] border border-[#DDC1AE] shadow-[0_8px_30px_rgba(109,76,65,0.08)] overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-[#FFF8F6] border-b border-[#DDC1AE]">
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.1em] text-[#564334]">NO</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.1em] text-[#564334]">BAHAN</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.1em] text-[#564334]">SUPPLIER</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.1em] text-[#564334]">JUMLAH</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.1em] text-[#564334]">HARGA SATUAN</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.1em] text-[#564334]">SUBTOTAL</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F5E6D8]">
                {data.detailBelanja.map((d, i) => (
                  <tr key={d.id} className="hover:bg-[#FFE9E4] transition-colors">
                    <td className="px-6 py-4 text-[#564334]">{i + 1}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="font-medium text-[#2A1711]">{d.bahanBaku.nama}</div>
                        <span className="text-xs text-[#8A7362]">({d.satuan})</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[#564334] text-sm">
                      {d.supplier?.nama || "—"}
                    </td>
                    <td className="px-6 py-4 font-[var(--font-roboto-mono)] text-[#2A1711]">
                      {d.jumlah.toLocaleString("id-ID")} {d.satuan}
                    </td>
                    <td className="px-6 py-4 font-[var(--font-roboto-mono)] text-[#2A1711]">
                      Rp {d.hargaSatuan.toLocaleString("id-ID")}
                    </td>
                    <td className="px-6 py-4 font-[var(--font-roboto-mono)] font-semibold text-[#2A1711]">
                      Rp {d.subtotal.toLocaleString("id-ID")}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-[#FFF8F6] border-t border-[#DDC1AE]">
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-right font-semibold text-[#2A1711]">
                    Total
                  </td>
                  <td className="px-6 py-4 font-[var(--font-roboto-mono)] font-bold text-[#FF8A00]">
                    Rp {data.totalBelanja.toLocaleString("id-ID")}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          <ConfirmDeleteDialog
            open={showDeleteConfirm}
            onOpenChange={setShowDeleteConfirm}
            onConfirm={handleDelete}
            title="Hapus belanja ini?"
            description="Aksi ini tidak dapat dibatalkan."
            isLoading={isDeleting}
          />
        </>
      )}
    </div>
  );
}
