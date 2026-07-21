"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Produksi } from "@/types/produksi";
import { Eye, MoreVertical, Edit3, XCircle } from "lucide-react";
import { ConfirmDeleteDialog } from "@/components/ui/confirm-delete-dialog";
import { toast } from "sonner";
import { api } from "@/lib/axios";

interface ProduksiTableProps {
  data: Produksi[];
  onRefresh: () => void;
}

export function ProduksiTable({ data, onRefresh }: ProduksiTableProps) {
  const router = useRouter();
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);
  const [actionLoading, setActionLoading] = useState<Set<number>>(new Set());
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);

  const statusColor = (status: string) => {
    switch (status) {
      case "DRAFT":
        return "bg-[#FF8A00] text-white";
      case "SELESAI":
        return "bg-[#06D6A0] text-white";
      case "BATAL":
        return "bg-[#EF4444] text-white";
      default:
        return "bg-[#DDC1AE] text-white";
    }
  };

  const handleBatal = async () => {
    if (deleteTargetId === null) return;
    const id = deleteTargetId;
    setActionLoading((prev) => new Set(prev).add(id));
    try {
      await api.delete(`/produksi/${id}`);
      toast.success("Data berhasil dihapus");
      setDeleteTargetId(null);
      onRefresh();
    } catch (err: any) {
      toast.error("Gagal menghapus data");
      setDeleteTargetId(null);
    } finally {
      setActionLoading((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  const handleSelesaikan = async (id: number) => {
    if (
      !window.confirm(
        "Selesaikan produksi ini? Status akan menjadi SELESAI dan data tidak bisa diubah lagi.",
      )
    )
      return;

    setActionLoading((prev) => new Set(prev).add(id));
    try {
      await api.patch(`/produksi/${id}/selesai`);
      toast.success("Produksi ditandai selesai");
      onRefresh();
    } catch (err: any) {
      alert(
        err.response?.data?.message || "Gagal menyelesaikan produksi",
      );
      toast.error("Gagal menyelesaikan produksi — coba lagi");
    } finally {
      setActionLoading((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-[#FFF8F6] border-b border-[#DDC1AE]">
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.1em] text-[#564334] font-[var(--font-be-vietnam)]">
              No
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.1em] text-[#564334] font-[var(--font-be-vietnam)]">
              Tanggal
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.1em] text-[#564334] font-[var(--font-be-vietnam)]">
              Resep
            </th>
            <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-[0.1em] text-[#564334] font-[var(--font-be-vietnam)]">
              Estimasi
            </th>
            <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-[0.1em] text-[#564334] font-[var(--font-be-vietnam)]">
              Hasil Nyata
            </th>
            <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-[0.1em] text-[#564334] font-[var(--font-be-vietnam)]">
              HPP / pcs
            </th>
            <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-[0.1em] text-[#564334] font-[var(--font-be-vietnam)]">
              Total Modal
            </th>
            <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-[0.1em] text-[#564334] font-[var(--font-be-vietnam)]">
              Status
            </th>
            <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-[0.1em] text-[#564334] font-[var(--font-be-vietnam)]">
              Aksi
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#F5E6D8]">
          {data.map((item, idx) => (
            <tr
              key={item.id}
              className="hover:bg-[#FFE9E4] transition-colors cursor-pointer"
              onClick={() => router.push(`/dashboard/produksi/${item.id}`)}
            >
              <td className="px-4 py-3 font-[var(--font-roboto-mono)] text-sm text-[#564334]">
                #{String(idx + 1).padStart(2, "0")}
              </td>
              <td className="px-4 py-3">
                <span className="font-[var(--font-be-vietnam)] text-sm text-[#564334]">
                  {new Date(item.tanggal).toLocaleDateString("id-ID", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </td>
              <td className="px-4 py-3">
                <span className="font-[var(--font-playfair)] font-semibold text-[#2A1711]">
                  {item.resep.nama}
                </span>
              </td>
              <td className="px-4 py-3 text-center font-[var(--font-roboto-mono)] text-sm text-[#2A1711]">
                {item.estimasiHasil}
              </td>
              <td className="px-4 py-3 text-center font-[var(--font-roboto-mono)] text-sm text-[#2A1711]">
                {item.hasilNyata ?? "-"}
              </td>
              <td className="px-4 py-3 text-center font-[var(--font-roboto-mono)] text-sm text-[#2A1711]">
                Rp {Math.round(item.hppPerPcs).toLocaleString("id-ID")}
              </td>
              <td className="px-4 py-3 text-right font-[var(--font-roboto-mono)] text-sm font-semibold text-[#2A1711]">
                Rp {Math.round(item.totalModal).toLocaleString("id-ID")}
              </td>
              <td className="px-4 py-3 text-center">
                <span
                  className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${statusColor(item.status)}`}
                >
                  {item.status}
                </span>
              </td>
              <td className="px-4 py-3 text-center relative">
                <div className="flex items-center justify-center gap-1">
                  <Link
                    href={`/dashboard/produksi/${item.id}`}
                    onClick={(e) => e.stopPropagation()}
                    className="p-1.5 rounded-full hover:bg-[#FFF8F6] text-[#8A7362] hover:text-[#FF8A00] transition-colors"
                  >
                    <Eye className="w-4 h-4" strokeWidth={1.75} />
                  </Link>

                  {item.status === "DRAFT" && (
                    <div className="relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenDropdownId(
                            openDropdownId === item.id ? null : item.id,
                          );
                        }}
                        className="p-1.5 rounded-full hover:bg-[#FFF8F6] text-[#8A7362] hover:text-[#FF8A00] transition-colors"
                      >
                        <MoreVertical className="w-4 h-4" strokeWidth={1.75} />
                      </button>

                      {openDropdownId === item.id && (
                        <>
                          <div
                            className="fixed inset-0 z-10"
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenDropdownId(null);
                            }}
                          />
                          <div className="absolute right-0 mt-1 w-44 bg-white rounded-xl border border-[#DDC1AE] shadow-lg z-20 overflow-hidden">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setOpenDropdownId(null);
                                handleSelesaikan(item.id);
                              }}
                              disabled={actionLoading.has(item.id)}
                              className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-[#06D6A0] hover:bg-[#F5E6D8] transition-colors disabled:opacity-50"
                            >
                              <Edit3 className="w-4 h-4" strokeWidth={1.75} />
                              Selesaikan
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setOpenDropdownId(null);
                                setDeleteTargetId(item.id);
                              }}
                              disabled={actionLoading.has(item.id)}
                              className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-[#EF4444] hover:bg-[#F5E6D8] transition-colors disabled:opacity-50 border-t border-[#F5E6D8]"
                            >
                              <XCircle className="w-4 h-4" strokeWidth={1.75} />
                              Batalkan
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <ConfirmDeleteDialog
        open={deleteTargetId !== null}
        onOpenChange={(open) => { if (!open) setDeleteTargetId(null); }}
        onConfirm={handleBatal}
        title="Batalkan produksi ini?"
        description="Status akan menjadi BATAL."
      />
    </div>
  );
}
