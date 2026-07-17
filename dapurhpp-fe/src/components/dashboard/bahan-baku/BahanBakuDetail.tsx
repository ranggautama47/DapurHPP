"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Pencil, Trash2, Package } from "lucide-react";
import { BahanBaku } from "@/types/bahan-baku";
import { api } from "@/lib/axios";
import { PriceHistoryChart } from "./PriceHistoryChart";
import { BahanBakuForm } from "./BahanBakuForm";
import { kategoriBadge } from "./kategori-badge";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") ||
  "http://localhost:3001";

interface BahanBakuDetailProps {
  initialData: BahanBaku;
}

export function BahanBakuDetail({ initialData }: BahanBakuDetailProps) {
  const router = useRouter();
  const params = useParams();
  const [bahan, setBahan] = useState<BahanBaku>(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (initialData) setBahan(initialData);
  }, [initialData]);

  const fetchDetail = async () => {
    setIsLoading(true);
    try {
      const res = await api.get<BahanBaku>(`/bahan-baku/${params.id}`);
      setBahan(res.data);
    } catch (err) {
      console.error("Gagal fetch detail:", err);
      router.push("/dashboard/bahan-baku");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (params.id) fetchDetail();
  }, [params.id, router]);

  const handleEdit = () => setShowForm(true);

  const handleDelete = async () => {
    if (!window.confirm("Yakin ingin menghapus bahan baku ini?")) return;
    try {
      await api.delete(`/bahan-baku/${bahan.id}`);
      router.push("/dashboard/bahan-baku");
    } catch (err) {
      console.error("Gagal hapus:", err);
      alert("Gagal menghapus bahan baku");
    }
  };

  const handleFormSubmit = async (data: any) => {
    try {
      await api.patch(`/bahan-baku/${bahan.id}`, data);
      setShowForm(false);
      fetchDetail();
    } catch (err: any) {
      alert(err.response?.data?.message || "Gagal menyimpan");
      throw err;
    }
  };

  const stokPercent =
    bahan.stokMinimal > 0
      ? Math.min(
          100,
          Math.round((Number(bahan.stok) / Number(bahan.stokMinimal)) * 100),
        )
      : 100;

  const isLowStock = Number(bahan.stok) <= Number(bahan.stokMinimal);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <div className="w-10 h-10 border-4 border-[#FFE9E4] border-t-[#FF8A00] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* CONTAINER UTAMA UNTUK TOMBOL SEJAJAR KANAN-KIRI */}
      <div className="flex items-center justify-between">
        {/* TOMBOL KEMBALI (KIRI) */}
        <Link
          href="/dashboard/bahan-baku"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#DDC1AE] text-[#564334] font-medium font-[var(--font-be-vietnam)] hover:bg-[#FFF8F6] hover:border-[#FF8A00] hover:text-[#FF8A00] transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali
        </Link>

        {/* TOMBOL EDIT (KANAN) */}
        <button
          onClick={handleEdit}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#DDC1AE] text-[#FF8A00] hover:bg-[#FFF8F6] transition-colors text-sm font-medium font-[var(--font-be-vietnam)]"
        >
          <Pencil className="w-4 h-4" strokeWidth={1.75} />
          Edit Bahan
        </button>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* KOLOM KIRI */}
        <div className="space-y-6">
          {/* CARD INFO UTAMA */}
          <div className="bg-white rounded-[24px] border border-[#DDC1AE] p-6 shadow-[0_8px_30px_rgba(109,76,65,0.08)]">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-16 h-16 rounded-xl overflow-hidden bg-[#FFF8F6] border border-[#F5E6D8] flex items-center justify-center flex-shrink-0">
                {bahan.fotoUrl ? (
                  <img
                    src={`${API_URL}${bahan.fotoUrl}`}
                    alt={bahan.nama}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Package
                    className="w-8 h-8 text-[#FF8A00]"
                    strokeWidth={1.5}
                  />
                )}
              </div>
              <div>
                <h2 className="font-[var(--font-playfair)] font-bold text-xl text-[#2A1711]">
                  {bahan.nama}
                </h2>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#D0F4DE] text-[#06D6A0] mt-1">
                  Aktif
                </span>
              </div>
            </div>

            <dl className="grid grid-cols-2 gap-4">
              <div>
                <dt className="text-xs text-[#8A7362] font-[var(--font-be-vietnam)] mb-1">
                  Kategori
                </dt>
                <dd className="font-medium text-[#2A1711] font-[var(--font-be-vietnam)]">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${kategoriBadge[bahan.kategori].bg} ${kategoriBadge[bahan.kategori].text}`}
                  >
                    <span>{kategoriBadge[bahan.kategori].emoji}</span>
                    {kategoriBadge[bahan.kategori].label}
                  </span>
                </dd>
              </div>
              <div>
                <dt className="text-xs text-[#8A7362] font-[var(--font-be-vietnam)] mb-1">
                  Satuan
                </dt>
                <dd className="font-medium text-[#2A1711] font-[var(--font-be-vietnam)]">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-[#FFF8F6] text-[#564334] border border-[#F5E6D8]">
                    {bahan.satuan.toUpperCase()}
                  </span>
                </dd>
              </div>
              <div>
                <dt className="text-xs text-[#8A7362] font-[var(--font-be-vietnam)] mb-1">
                  Harga Terakhir
                </dt>
                <dd className="font-[var(--font-roboto-mono)] font-bold text-xl text-[#2A1711]">
                  Rp {Number(bahan.hargaTerakhir).toLocaleString("id-ID")}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-[#8A7362] font-[var(--font-be-vietnam)] mb-1">
                  Terakhir Update
                </dt>
                <dd className="font-medium text-[#2A1711] font-[var(--font-be-vietnam)]">
                  {new Date(bahan.updatedAt).toLocaleDateString("id-ID", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </dd>
              </div>
            </dl>
          </div>

          {/* CARD STOK SAAT INI */}
          <div className="bg-white rounded-[24px] border border-[#DDC1AE] p-6 shadow-[0_8px_30px_rgba(109,76,65,0.08)]">
            <h3 className="font-[var(--font-playfair)] font-bold text-lg text-[#2A1711] mb-4">
              Stok Saat Ini
            </h3>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="font-[var(--font-roboto-mono)] font-bold text-3xl text-[#2A1711]">
                {Number(bahan.stok).toLocaleString("id-ID")}
              </span>
              <span className="text-lg text-[#8A7362] font-[var(--font-be-vietnam)]">
                {bahan.satuan}
              </span>
            </div>
            <p className="text-sm text-[#8A7362] font-[var(--font-be-vietnam)] mb-3">
              Minimal Stok: {Number(bahan.stokMinimal).toLocaleString("id-ID")}{" "}
              {bahan.satuan}
            </p>
            <div className="w-full h-2.5 bg-[#F5E6D8] rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${isLowStock ? "bg-[#EF4444]" : "bg-[#06D6A0]"}`}
                style={{ width: `${stokPercent}%` }}
              />
            </div>
          </div>

          {/* CARD HAPUS */}
          <div className="bg-white rounded-[24px] border border-[#DDC1AE] p-6 shadow-[0_8px_30px_rgba(109,76,65,0.08)]">
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-[#EF4444]/30 text-[#EF4444] hover:bg-[#FEF2F2] hover:border-[#EF4444] transition-all font-medium font-[var(--font-be-vietnam)]"
            >
              <Trash2 className="w-5 h-5" strokeWidth={1.75} />
              Hapus Bahan
            </button>
          </div>
        </div>

        {/* KOLOM KANAN */}
        <div className="bg-white rounded-[24px] border border-[#DDC1AE] p-6 shadow-[0_8px_30px_rgba(109,76,65,0.08)]">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-[var(--font-playfair)] font-bold text-xl text-[#2A1711]">
              Riwayat Harga 6 Bulan Terakhir
            </h3>
            <select className="px-3 py-1.5 rounded-full border border-[#DDC1AE] text-sm text-[#564334] bg-[#FFF8F6] font-[var(--font-be-vietnam)] focus:outline-none focus:border-[#FF8A00]">
              <option>6 Bulan Terakhir</option>
              <option>1 Tahun Terakhir</option>
            </select>
          </div>
          <PriceHistoryChart bahanId={bahan.id} />
        </div>
      </div>

      {/* Delete Confirm Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-[24px] shadow-[0_24px_64px_-12px_rgba(42,23,17,0.4)] w-full max-w-md relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#EF4444] via-[#BA1A1A] to-[#EF4444]" />
            <div className="p-6 pt-10">
              <h2 className="font-[var(--font-playfair)] font-bold text-[1.75rem] text-[#2A1711] mb-2">
                Hapus Bahan Baku
              </h2>
              <p className="text-sm text-[#5D4037] mb-6">
                Yakin ingin menghapus{" "}
                <strong className="text-[#2A1711]">{bahan.nama}</strong>? Data
                akan di-soft-delete dan tetap bisa dipulihkan.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 px-6 py-3 rounded-full border-2 border-[#DDC1AE] text-[#564334] hover:bg-[#FFF8F6] font-semibold"
                >
                  Batal
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 px-6 py-3 rounded-full bg-[#EF4444] text-white font-semibold hover:bg-[#DC2626]"
                >
                  Hapus Sekarang
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Form Modal */}
      {showForm && (
        <BahanBakuForm
          isOpen={showForm}
          onClose={() => setShowForm(false)}
          onSubmit={handleFormSubmit}
          initialData={bahan}
          isLoading={isLoading}
        />
      )}
    </div>
  );
}
