"use client";

import { useEffect, useState, useCallback } from "react";
import { Plus, Receipt } from "lucide-react";
import { api } from "@/lib/axios";
import { formatLocalDate } from "@/lib/utils";
import type { Pengeluaran, Kategori } from "@/types/pengeluaran";
import {
  calculateStats,
  filterByDateRange,
  filterByKategori,
  type PengeluaranStats,
} from "@/lib/pengeluaran-lain";
import {
  StatsCards,
  FilterBar,
  PengeluaranTable,
  PengeluaranForm,
} from "@/components/dashboard/pengeluaran";

export default function PengeluaranPageClient() {
  const [allData, setAllData] = useState<Pengeluaran[]>([]);
  const [filteredData, setFilteredData] = useState<Pengeluaran[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter state
  const [tanggal, setTanggal] = useState(formatLocalDate(new Date()));
  const [tanggalMulai, setTanggalMulai] = useState("");
  const [tanggalAkhir, setTanggalAkhir] = useState("");
  const [kategori, setKategori] = useState<Kategori | "Semua">("Semua");

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<Pengeluaran | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get<Pengeluaran[]>("/pengeluaran-lain");
      setAllData(res.data);
      setFilteredData(res.data);
    } catch {
      setError("Gagal memuat data pengeluaran");
      setAllData([]);
      setFilteredData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const applyFilter = useCallback(() => {
    let result = [...allData];
    if (tanggalMulai && tanggalAkhir) {
      result = filterByDateRange(result, tanggalMulai, tanggalAkhir);
    }
    result = filterByKategori(result, kategori);
    setFilteredData(result);
  }, [allData, tanggalMulai, tanggalAkhir, kategori]);

  const handleApplyFilter = () => {
    applyFilter();
  };

  // Reset filter when allData changes (after CRUD)
  useEffect(() => {
    setFilteredData(allData);
  }, [allData]);

  const todayStr = formatLocalDate(new Date());
  const stats: PengeluaranStats = calculateStats(allData, todayStr);

  const handleEdit = (item: Pengeluaran) => {
    setEditingItem(item);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/pengeluaran-lain/${id}`);
      setDeleteConfirm(null);
      await fetchAll();
    } catch {
      alert("Gagal menghapus pengeluaran");
    }
  };

  const handleFormSuccess = () => {
    fetchAll();
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingItem(null);
  };

  return (
    <div className="mx-auto max-w-[1500px]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="font-[var(--font-playfair)] font-bold text-3xl md:text-4xl text-[#2A1711] mb-2">
            Pengeluaran Lain-lain
          </h1>
          <p className="text-[#564334] text-lg">
            Kelola semua pengeluaran operasional UMKM Anda
          </p>
        </div>
        <button
          onClick={() => {
            setEditingItem(null);
            setShowForm(true);
          }}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#FF8A00] text-white font-semibold hover:bg-[#E67E00] transition-all shadow-[0_10px_30px_rgba(255,138,0,0.25)]"
        >
          <Plus className="w-5 h-5" />
          Tambah Pengeluaran
        </button>
      </div>

      {/* Stats Cards */}
      <StatsCards stats={stats} loading={loading} />

      {/* Filter */}
      <FilterBar
        tanggal={tanggal}
        tanggalMulai={tanggalMulai}
        tanggalAkhir={tanggalAkhir}
        kategori={kategori}
        onTanggalChange={(v) => {
          setTanggal(v);
          if (v) {
            api
              .get<Pengeluaran[]>(`/pengeluaran-lain?tanggal=${v}`)
              .then((res) => {
                setAllData(res.data);
              })
              .catch(() => {});
          }
        }}
        onTanggalMulaiChange={setTanggalMulai}
        onTanggalAkhirChange={setTanggalAkhir}
        onKategoriChange={setKategori}
        onApply={handleApplyFilter}
      />

      {/* Error */}
      {error && (
        <div className="mb-6 p-4 rounded-2xl bg-[#FEE2E2] border border-[#FCA5A5] text-[#EF4444] text-sm flex items-center gap-2">
          <Receipt size={16} />
          {error}
        </div>
      )}

      {/* Content: 2 columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Table */}
        <div className="lg:col-span-2">
          <PengeluaranTable
            data={filteredData}
            loading={loading}
            onEdit={handleEdit}
            onDelete={(id) => setDeleteConfirm(id)}
          />
        </div>

        {/* Right: Form */}
        <div>
          {showForm && (
            <PengeluaranForm
              editingItem={editingItem}
              onClose={handleFormClose}
              onSuccess={handleFormSuccess}
            />
          )}
          {!showForm && (
            <div className="bg-white rounded-[24px] border border-[#DDC1AE] shadow-[0_8px_30px_rgba(109,76,65,0.08)] p-6 lg:sticky lg:top-6">
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <div className="w-14 h-14 rounded-2xl bg-[#FFF3E5] flex items-center justify-center mb-4">
                  <Receipt className="w-7 h-7 text-[#FF8A00]" />
                </div>
                <p className="text-[#564334] font-medium mb-1">
                  Belum ada pengeluaran dipilih
                </p>
                <p className="text-[#8A7362] text-sm mb-5">
                  Klik tombol Tambah Pengeluaran untuk memulai
                </p>
                <button
                  onClick={() => {
                    setEditingItem(null);
                    setShowForm(true);
                  }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#FF8A00] text-white font-semibold text-sm hover:bg-[#E67E00] transition-all"
                >
                  <Plus className="w-4 h-4" />
                  Tambah Pengeluaran
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      {deleteConfirm !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2A1711]/60 backdrop-blur-sm">
          <div className="bg-white rounded-[24px] shadow-[0_24px_64px_-12px_rgba(42,23,17,0.4)] p-6 max-w-sm w-full">
            <h3 className="font-[var(--font-playfair)] font-bold text-xl text-[#2A1711] mb-2">
              Hapus Pengeluaran
            </h3>
            <p className="text-[#564334] text-sm mb-6">
              Apakah Anda yakin ingin menghapus pengeluaran ini? Tindakan ini
              tidak dapat dibatalkan.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 h-12 rounded-full border-2 border-[#DDC1AE] text-[#564334] font-semibold text-sm hover:bg-[#FFF8F6] transition-all"
              >
                Batal
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 h-12 rounded-full bg-[#EF4444] text-white font-semibold text-sm hover:bg-[#DC2626] transition-all"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
