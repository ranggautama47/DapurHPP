"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { Resep } from "@/types/resep";
import { api } from "@/lib/axios";
import { toast } from "sonner";
import { ResepCard, ResepForm } from "@/components/dashboard/resep";

const ITEMS_PER_PAGE = 6;

export default function ResepPageClient() {
  const router = useRouter();
  const [resepList, setResepList] = useState<Resep[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchList = async () => {
    setIsLoading(true);
    try {
      const res = await api.get<Resep[]>("/resep");
      setResepList(res.data);
    } catch (err) {
      console.error("Gagal fetch resep:", err);
      toast.error("Gagal memuat data resep");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  const filteredList = resepList.filter((r) =>
    r.nama.toLowerCase().includes(search.toLowerCase()),
  );

  const totalPages = Math.ceil(filteredList.length / ITEMS_PER_PAGE);
  const paginatedList = filteredList.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      const res = await api.post("/resep", data);
      toast.success("Resep berhasil dibuat");
      setShowForm(false);
      fetchList();
      return res.data;
    } catch (err: any) {
      alert(err.response?.data?.message || "Gagal menyimpan resep");
      toast.error("Gagal membuat resep — coba lagi");
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-[var(--font-playfair)] font-bold text-2xl text-[#2A1711]">
            Resep
          </h1>
          <p className="text-sm text-[#564334]">
            Kelola resep dan hitung HPP otomatis
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#FF8A00] text-white font-[var(--font-be-vietnam)] font-semibold text-sm hover:bg-[#E67E00] hover:shadow-[0_4px_12px_rgba(255,138,0,0.3)] transition-all"
        >
          <Plus className="w-5 h-5" strokeWidth={2} />
          Tambah Resep
        </button>
      </div>

      <div className="relative max-w-md">
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8A7362]"
          strokeWidth={1.75}
        />
        <input
          type="search"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          placeholder="Cari resep..."
          className="w-full pl-12 pr-4 py-3 bg-white border-2 border-[#F5E6D8] rounded-full text-[#2A1711] placeholder-[#BCAAA4] focus:outline-none focus:border-[#FF8A00] focus:ring-2 focus:ring-[#FF8A00]/20"
        />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-[24px] border border-[#DDC1AE] overflow-hidden animate-pulse"
            >
              <div className="aspect-[4/3] bg-[#F5E6D8]" />
              <div className="p-5 space-y-3">
                <div className="h-5 bg-[#F5E6D8] rounded w-3/4" />
                <div className="h-3 bg-[#F5E6D8] rounded w-1/2" />
                <div className="h-4 bg-[#F5E6D8] rounded w-1/3" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredList.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-[#564334] text-lg font-[var(--font-be-vietnam)] mb-2">
            {search ? "Resep tidak ditemukan" : "Belum ada resep"}
          </p>
          <p className="text-[#8A7362] text-sm mb-6">
            {search
              ? "Coba kata kunci lain"
              : "Tambahkan resep pertama Anda untuk menghitung HPP"}
          </p>
          {!search && (
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#FF8A00] text-white font-[var(--font-be-vietnam)] font-semibold text-sm hover:bg-[#E67E00] transition-all"
            >
              <Plus className="w-5 h-5" strokeWidth={2} />
              Tambah Resep Pertama
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedList.map((resep) => (
              <ResepCard key={resep.id} resep={resep} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#F5E6D8]">
              <p className="text-sm text-[#564334] font-[var(--font-be-vietnam)]">
                Menampilkan{" "}
                {Math.min(
                  (currentPage - 1) * ITEMS_PER_PAGE + 1,
                  filteredList.length,
                )}
                -{Math.min(currentPage * ITEMS_PER_PAGE, filteredList.length)}{" "}
                dari {filteredList.length} resep
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-full hover:bg-[#FFF8F6] text-[#FF8A00] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" strokeWidth={1.75} />
                </button>
                <span className="px-3 py-1 text-sm font-medium text-[#2A1711] font-[var(--font-be-vietnam)]">
                  Halaman {currentPage} dari {totalPages}
                </span>
                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-full hover:bg-[#FFF8F6] text-[#FF8A00] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-5 h-5" strokeWidth={1.75} />
                </button>
              </div>
            </div>
          )}
        </>
      )}

      <ResepForm
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        onSubmit={handleSubmit}
        initialData={null}
        isLoading={isSubmitting}
      />
    </div>
  );
}
