"use client";

import { useEffect, useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { Plus, Receipt } from "lucide-react";
import { ConfirmDeleteDialog } from "@/components/ui/confirm-delete-dialog";
import { toast } from "sonner";
import { api } from "@/lib/axios";
import { formatLocalDate } from "@/lib/utils";
import type { Pengeluaran, Kategori } from "@/types/pengeluaran";
import { calculateStats, type PengeluaranStats } from "@/lib/pengeluaran-lain";
import { StatsCards } from "@/components/dashboard/pengeluaran/stats-cards";
import { FilterBar } from "@/components/dashboard/pengeluaran/filter-bar";
import { PengeluaranTable } from "@/components/dashboard/pengeluaran/pengeluaran-table";
import { useTranslation } from "@/context/language-context";

// Modal PengeluaranForm diload on-demand (chunk terpisah) — react-hook-form + zod
// hanya dimuat saat pengguna membuka form "Catat Pengeluaran".
const PengeluaranForm = dynamic(
  () =>
    import("@/components/dashboard/pengeluaran/pengeluaran-form").then(
      (m) => m.PengeluaranForm,
    ),
  { ssr: false },
);

export default function PengeluaranPageClient() {
  const { t } = useTranslation("master");
  const [allData, setAllData] = useState<Pengeluaran[]>([]);
  const [filteredData, setFilteredData] = useState<Pengeluaran[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter state
  const [tanggal, setTanggal] = useState("");
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
      setError(t("expenses.errorLoad"));
      setAllData([]);
      setFilteredData([]);
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  // Logika Filter Presisi tanpa menimpa allData
  const applyFilter = useCallback(() => {
    let result = [...allData];

    // 1. Filter Rentang Tanggal (Dari - Sampai)
    if (tanggalMulai || tanggalAkhir) {
      result = result.filter((item) => {
        const itemDate = item.tanggal ? item.tanggal.split("T")[0] : "";
        if (tanggalMulai && itemDate < tanggalMulai) return false;
        if (tanggalAkhir && itemDate > tanggalAkhir) return false;
        return true;
      });
    } else if (tanggal) {
      // 2. Filter Tanggal Tunggal (jika rentang tidak diisi)
      result = result.filter((item) => {
        const itemDate = item.tanggal ? item.tanggal.split("T")[0] : "";
        return itemDate === tanggal;
      });
    }

    // 3. Filter Kategori
    if (kategori && kategori !== "Semua") {
      result = result.filter((item) => item.kategori === kategori);
    }

    setFilteredData(result);
  }, [allData, tanggal, tanggalMulai, tanggalAkhir, kategori]);

  const handleApplyFilter = () => {
    applyFilter();
  };

  const handleResetFilter = () => {
    setTanggal("");
    setTanggalMulai("");
    setTanggalAkhir("");
    setKategori("Semua");
    setFilteredData(allData);
  };

  const todayStr = formatLocalDate(new Date());
  const stats: PengeluaranStats = calculateStats(allData, todayStr);

  const handleEdit = (item: Pengeluaran) => {
    setEditingItem(item);
    setShowForm(true);
  };

  const handleDelete = async () => {
    if (deleteConfirm === null) return;
    try {
      await api.delete(`/pengeluaran-lain/${deleteConfirm}`);
      toast.success(t("expenses.successDelete"));
      setDeleteConfirm(null);
      await fetchAll();
    } catch {
      toast.error(t("expenses.errorDelete"));
      setDeleteConfirm(null);
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
            {t("expenses.title")}
          </h1>
          <p className="text-[#564334] text-lg">
            {t("expenses.subtitle", {
              defaultValue: "Kelola operasional dan pengeluaran harian usaha",
            })}
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
          {t("expenses.addTitle")}
        </button>
      </div>

      {/* Stats Cards */}
      <StatsCards stats={stats} loading={loading} />

      {/* Filter Bar */}
      <FilterBar
        tanggal={tanggal}
        tanggalMulai={tanggalMulai}
        tanggalAkhir={tanggalAkhir}
        kategori={kategori}
        onTanggalChange={setTanggal}
        onTanggalMulaiChange={setTanggalMulai}
        onTanggalAkhirChange={setTanggalAkhir}
        onKategoriChange={setKategori}
        onApply={handleApplyFilter}
        onReset={handleResetFilter}
      />

      {/* Error */}
      {error && (
        <div className="mb-6 p-4 rounded-2xl bg-[#FEE2E2] border border-[#FCA5A5] text-[#EF4444] text-sm flex items-center gap-2">
          <Receipt size={16} />
          {error}
        </div>
      )}

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <PengeluaranTable
            data={filteredData}
            loading={loading}
            onEdit={handleEdit}
            onDelete={(id) => setDeleteConfirm(id)}
          />
        </div>

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
                  {t("expenses.noExpenseSelected")}
                </p>
                <p className="text-[#8A7362] text-sm mb-5">
                  {t("expenses.clickToAdd")}
                </p>
                <button
                  onClick={() => {
                    setEditingItem(null);
                    setShowForm(true);
                  }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#FF8A00] text-white font-semibold text-sm hover:bg-[#E67E00] transition-all"
                >
                  <Plus className="w-4 h-4" />
                  {t("expenses.addTitle")}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <ConfirmDeleteDialog
        open={deleteConfirm !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteConfirm(null);
        }}
        onConfirm={handleDelete}
        title={t("expenses.confirmDelete")}
      />
    </div>
  );
}
