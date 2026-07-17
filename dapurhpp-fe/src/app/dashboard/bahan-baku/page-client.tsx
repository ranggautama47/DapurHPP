"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Package, Search, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { BahanBaku } from "@/types/bahan-baku";
import { BahanBakuTable, BahanBakuForm } from "@/components/dashboard/bahan-baku";
import { api } from "@/lib/axios";

export default function BahanBakuPageClient() {
  const router = useRouter();
  const [bahanList, setBahanList] = useState<BahanBaku[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState<BahanBaku | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const ITEMS_PER_PAGE = 7;
  const filteredList = bahanList.filter((b) =>
    b.nama.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.ceil(filteredList.length / ITEMS_PER_PAGE);
  const paginatedList = filteredList.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const fetchList = async () => {
    setIsLoading(true);
    try {
      const res = await api.get<BahanBaku[]>("/bahan-baku");
      setBahanList(res.data);
    } catch (err) {
      console.error("Gagal fetch bahan baku:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  const handleCreate = async (data: any) => {
    setIsSubmitting(true);
    try {
      const res = await api.post("/bahan-baku", data);
      fetchList();
      setShowForm(false);
      return res.data.id;
    } catch (err: any) {
      alert(err.response?.data?.message || "Gagal menambah bahan baku");
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (bahan: BahanBaku) => {
    setEditTarget(bahan);
    setShowForm(true);
  };

  const handleUpdate = async (data: any) => {
    if (!editTarget) return;
    setIsSubmitting(true);
    try {
      await api.patch(`/bahan-baku/${editTarget.id}`, data);
      fetchList();
      setShowForm(false);
      setEditTarget(null);
    } catch (err: any) {
      alert(err.response?.data?.message || "Gagal mengedit bahan baku");
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Yakin ingin menghapus bahan baku ini? Data terkait (resep, belanja, dll) tetap terjaga.")) return;
    try {
      await api.delete(`/bahan-baku/${id}`);
      fetchList();
    } catch (err) {
      console.error("Gagal hapus:", err);
      alert("Gagal menghapus bahan baku");
    }
  };

  const handleFormSubmit = editTarget ? handleUpdate : handleCreate;

  const handleOpenForm = () => {
    setEditTarget(null);
    setShowForm(true);
  };

  return (
    <div className="mx-auto max-w-[1500px]">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="font-[var(--font-playfair)] font-bold text-3xl md:text-4xl text-[#2A1711] mb-2">
              Master Bahan Baku
            </h1>
            <p className="text-[#564334] text-lg">
              Kelola bahan baku untuk perhitungan HPP otomatis
            </p>
          </div>
          <button
            onClick={handleOpenForm}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#FF8A00] text-white font-[var(--font-be-vietnam)] font-semibold text-base hover:bg-[#E67E00] hover:shadow-[0_4px_12px_rgba(255,138,0,0.3)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isSubmitting}
          >
            <Plus className="w-5 h-5" strokeWidth={2} />
            Tambah Bahan
          </button>
        </div>

        <div className="bg-white rounded-[24px] border border-[#DDC1AE] shadow-[0_8px_30px_rgba(109,76,65,0.08)] overflow-hidden">
          <div className="p-6 border-b border-[#F5E6D8]">
            <div className="relative max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8A7362]" strokeWidth={1.75} />
              <input
                type="search"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                placeholder="Cari nama bahan..."
                className="w-full pl-12 pr-4 py-3 bg-[#FFF8F6] border-2 border-[#F5E6D8] rounded-full text-[#2A1711] placeholder-[#BCAAA4] focus:outline-none focus:border-[#FF8A00] focus:ring-2 focus:ring-[#FF8A00]/20"
              />
            </div>
          </div>

          {isLoading ? (
            <div className="p-6">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="animate-pulse flex items-center gap-3 py-3 border-b border-[#F5E6D8]">
                  <div className="w-10 h-10 rounded-full bg-[#F5E6D8]" />
                  <div className="flex-1 space-y-1">
                    <div className="h-4 bg-[#F5E6D8] rounded w-3/4" />
                    <div className="h-3 bg-[#F5E6D8] rounded w-1/2" />
                  </div>
                  <div className="w-20 h-6 bg-[#F5E6D8] rounded" />
                </div>
              ))}
            </div>
          ) : filteredList.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Package className="w-16 h-16 text-[#DDC1AE] mb-4" strokeWidth={1.5} />
              <p className="text-[#564334] text-lg font-[var(--font-be-vietnam)] mb-2">
                Belum ada bahan baku
              </p>
              <p className="text-[#8A7362] text-sm mb-6">
                Tambahkan bahan baku pertama Anda untuk memulai
              </p>
              <button
                onClick={handleOpenForm}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#FF8A00] text-white font-[var(--font-be-vietnam)] font-semibold text-base hover:bg-[#E67E00] hover:shadow-[0_4px_12px_rgba(255,138,0,0.3)] transition-all"
              >
                <Plus className="w-5 h-5" strokeWidth={2} />
                Tambah Bahan Pertama
              </button>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <BahanBakuTable
                  data={paginatedList}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onView={(id) => router.push(`/dashboard/bahan-baku/${id}`)}
                />
              </div>
              {totalPages > 1 && (
                <div className="px-6 py-4 border-t border-[#F5E6D8] flex flex-col sm:flex-row items-center justify-between gap-4">
                  <p className="text-sm text-[#564334] font-[var(--font-be-vietnam)]">
                    Menampilkan {Math.min((currentPage - 1) * ITEMS_PER_PAGE + 1, filteredList.length)}-{Math.min(currentPage * ITEMS_PER_PAGE, filteredList.length)} dari {filteredList.length} bahan
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="p-2 rounded-full hover:bg-[#FFF8F6] text-[#FF8A00] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      aria-label="Halaman sebelumnya"
                    >
                      <ChevronLeft className="w-5 h-5" strokeWidth={1.75} />
                    </button>
                    <span className="px-3 py-1 text-sm font-medium text-[#2A1711] font-[var(--font-be-vietnam)]">
                      Halaman {currentPage} dari {totalPages}
                    </span>
                    <button
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="p-2 rounded-full hover:bg-[#FFF8F6] text-[#FF8A00] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      aria-label="Halaman selanjutnya"
                    >
                      <ChevronRight className="w-5 h-5" strokeWidth={1.75} />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
      </div>
      <BahanBakuForm
        isOpen={showForm}
        onClose={() => { setShowForm(false); setEditTarget(null); }}
        onSubmit={handleFormSubmit}
        initialData={editTarget}
        isLoading={isSubmitting}
      />
    </div>
  );
}
