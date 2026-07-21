"use client";

import { useState } from "react";
import { Penjualan } from "@/types/penjualan";
import { Trash2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/axios";

interface PenjualanTableProps {
  data: Penjualan[];
  onRefresh: (date: Date) => void;
}

export function PenjualanTable({ data, onRefresh }: PenjualanTableProps) {
  const [updatingIds, setUpdatingIds] = useState<Set<number>>(new Set());

  const handleClose = async (id: number) => {
    if (!window.confirm("Tandai penjualan ini sebagai CLOSED? Stok akan dikunci.")) return;
    
    setUpdatingIds(prev => new Set(prev).add(id));
    try {
      await api.patch(`/penjualan/${id}`, { status: 'CLOSED' });
      toast.success("Penjualan ditutup");
      // Trigger refresh by calling onRefresh with current date
      const today = new Date();
      onRefresh(today);
    } catch (err: any) {
      alert(err.response?.data?.message || "Gagal menutup penjualan");
      toast.error("Gagal menutup penjualan — coba lagi");
    } finally {
      setUpdatingIds(prev => {
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
              Tanggal & Produk
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.1em] text-[#564334] font-[var(--font-be-vietnam)]">
              Terjual
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.1em] text-[#564334] font-[var(--font-be-vietnam)]">
              Harga Jual
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.1em] text-[#564334] font-[var(--font-be-vietnam)]">
              Total Pendapatan
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.1em] text-[#564334] font-[var(--font-be-vietnam)]">
              Laba Bersih
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.1em] text-[#564334] font-[var(--font-be-vietnam)]">
              Status
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.1em] text-[#564334] font-[var(--font-be-vietnam)]">
              Aksi
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#F5E6D8]">
          {data.map((item) => (
            <tr key={item.id} className="hover:bg-[#FFE9E4] transition-colors">
              <td className="px-4 py-3">
                <div className="flex flex-col gap-1">
                  <span className="font-[var(--font-be-vietnam)] text-sm text-[#564334]">
                    {new Date(item.tanggal).toLocaleDateString("id-ID", { day: "2-digit", month: "short" })}
                  </span>
                  <span className="font-[var(--font-playfair)] font-semibold text-[#2A1711]">
                    {item.produksi.resep.nama}
                  </span>
                </div>
              </td>
              <td className="px-4 py-3 text-center font-[var(--font-roboto-mono)] font-medium text-[#2A1711]">
                {item.terjual.toLocaleString("id-ID")}
              </td>
              <td className="px-4 py-3 font-[var(--font-roboto-mono)] font-semibold text-[#2A1711]">
                Rp {Number(item.hargaJual).toLocaleString("id-ID")}
              </td>
              <td className="px-4 py-3 font-[var(--font-roboto-mono)] font-semibold text-[#2A1711]">
                Rp {Number(item.totalPendapatan).toLocaleString("id-ID")}
              </td>
              <td className="px-4 py-3 font-[var(--font-roboto-mono)] font-bold text-[#06D6A0]">
                Rp {Number(item.laba).toLocaleString("id-ID")}
              </td>
              <td className="px-4 py-3">
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                  item.status === 'OPEN' 
                    ? 'bg-[#FFF3E5] text-[#FF8A00]' 
                    : 'bg-[#E6FBF7] text-[#06D6A0]'
                }`}>
                  {item.status}
                </span>
              </td>
              <td className="px-4 py-3">
                {item.status === 'OPEN' && (
                  <button
                    onClick={() => handleClose(item.id)}
                    disabled={updatingIds.has(item.id)}
                    className="px-3 py-1.5 rounded-full border border-[#EF4444]/30 text-[#EF4444] hover:bg-[#FEF2F2] hover:border-[#EF4444] transition-all text-xs font-medium font-[var(--font-be-vietnam)] disabled:opacity-50"
                  >
                    {updatingIds.has(item.id) ? (
                      <span className="flex items-center gap-1">
                        <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Menutup...
                      </span>
                    ) : (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 inline-block mr-1" />
                        Selesaikan
                      </>
                    )}
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}