"use client";

import { useEffect, useState } from "react";
import { Plus, Search, ChevronLeft, ChevronRight, Truck, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Supplier } from "@/types/supplier";
import { SupplierTable } from "@/components/dashboard/supplier/SupplierTable";
import { SupplierForm } from "@/components/dashboard/supplier/SupplierForm";
import { ConfirmDeleteDialog } from "@/components/ui/confirm-delete-dialog";
import { toast } from "sonner";
import { api } from "@/lib/axios";

const ITEMS_PER_PAGE = 5;

export default function SupplierPageClient() {
  const router = useRouter();
  const [supplierList, setSupplierList] = useState<Supplier[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState<Supplier | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);

  const fetchList = async () => {
    setIsLoading(true);
    try {
      const res = await api.get<Supplier[]>("/supplier");
      setSupplierList(res.data);
    } catch (err) {
      console.error("Gagal fetch supplier:", err);
      toast.error("Gagal memuat data supplier");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  const handleOpenForm = (supplier?: Supplier) => {
    setEditTarget(supplier ?? null);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditTarget(null);
  };

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      if (editTarget) {
        await api.patch(`/supplier/${editTarget.id}`, data);
        toast.success("Supplier berhasil disimpan");
      } else {
        await api.post("/supplier", data);
        toast.success("Supplier berhasil disimpan");
      }
      handleCloseForm();
      fetchList();
    } catch (err: any) {
      alert(err.response?.data?.message || "Gagal menyimpan supplier");
      toast.error("Gagal menyimpan supplier — coba lagi");
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (deleteTargetId === null) return;
    try {
      await api.delete(`/supplier/${deleteTargetId}`);
      toast.success("Data berhasil dihapus");
      setDeleteTargetId(null);
      fetchList();
    } catch (err) {
      console.error("Gagal hapus:", err);
      toast.error("Gagal menghapus data");
      setDeleteTargetId(null);
    }
  };

  const filteredList = supplierList.filter((s) =>
    s.nama.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredList.length / ITEMS_PER_PAGE);
  const paginatedList = filteredList.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="mx-auto max-w-[1500px]">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="font-[var(--font-playfair)] font-bold text-3xl md:text-4xl text-[#2A1711] mb-2">
              Supplier
            </h1>
            <p className="text-[#564334] text-lg">
              Kelola data supplier bahan baku usaha Anda
            </p>
          </div>
          <button
            onClick={() => handleOpenForm()}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#FF8A00] text-white font-[var(--font-be-vietnam)] font-semibold text-base hover:bg-[#E67E00] hover:shadow-[0_4px_12px_rgba(255,138,0,0.3)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isSubmitting}
          >
            <Plus className="w-5 h-5" strokeWidth={2} />
            Tambah Supplier
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
                placeholder="Cari nama supplier..."
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
            <div className="text-center py-16">
              <Truck className="w-16 h-16 text-[#DDC1AE] mx-auto mb-4" strokeWidth={1.5} />
              <p className="text-[#564334] text-lg font-[var(--font-be-vietnam)] mb-2">
                Belum ada supplier
              </p>
              <p className="text-[#8A7362] text-sm mb-6">
                Tambahkan supplier pertama Anda untuk memulai
              </p>
              <button
                onClick={() => handleOpenForm()}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#FF8A00] text-white font-[var(--font-be-vietnam)] font-semibold text-base hover:bg-[#E67E00] hover:shadow-[0_4px_12px_rgba(255,138,0,0.3)] transition-all"
              >
                <Plus className="w-5 h-5" strokeWidth={2} />
                Tambah Supplier Pertama
              </button>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <SupplierTable
                  data={paginatedList}
                  onEdit={handleOpenForm}
                  onDelete={(id) => setDeleteTargetId(id)}
                  onView={() => {}}
                />
              </div>
              {totalPages > 1 && (
                <div className="px-6 py-4 border-t border-[#F5E6D8] flex flex-col sm:flex-row items-center justify-between gap-4">
                  <p className="text-sm text-[#564334] font-[var(--font-be-vietnam)]">
                    Menampilkan {Math.min((currentPage - 1) * ITEMS_PER_PAGE + 1, filteredList.length)}-{Math.min(currentPage * ITEMS_PER_PAGE, filteredList.length)} dari {filteredList.length} supplier
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
      <SupplierForm
        isOpen={showForm}
        onClose={() => { setShowForm(false); setEditTarget(null); }}
        onSubmit={handleSubmit}
        initialData={editTarget}
        isLoading={isSubmitting}
      />
      <ConfirmDeleteDialog
        open={deleteTargetId !== null}
        onOpenChange={(open) => { if (!open) setDeleteTargetId(null); }}
        onConfirm={handleDelete}
        title="Hapus supplier ini?"
      />
    </div>
  );
}