"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { Search, Plus, ChevronLeft, ChevronRight, ChefHat } from "lucide-react";
import { useTranslation } from "@/context/language-context";
import { Resep } from "@/types/resep";
import { api } from "@/lib/axios";
import { toast } from "sonner";
import { ResepCard } from "@/components/dashboard/resep/ResepCard";

// Modal ResepForm diload on-demand (chunk terpisah) — react-hook-form + zod
// hanya dimuat saat pengguna membuka form "Tambah Resep".
const ResepForm = dynamic(
  () =>
    import("@/components/dashboard/resep/ResepForm").then(
      (m) => m.ResepForm,
    ),
  { ssr: false },
);

const ITEMS_PER_PAGE = 6;

export default function ResepPageClient() {
  const router = useRouter();
  const { t } = useTranslation("master");
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
      console.error(t("recipes.errorLoad"), err);
      toast.error(t("recipes.errorLoad"));
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
      toast.success(t("recipes.successCreate"));
      setShowForm(false);
      fetchList();
      return res.data;
    } catch (err: any) {
      alert(err.response?.data?.message || t("recipes.errorCreate"));
      toast.error(t("recipes.errorCreate"));
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
            {t("recipes.title")}
          </h1>
          <p className="text-sm text-[#564334]">{t("recipes.subtitle")}</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#FF8A00] text-white font-[var(--font-be-vietnam)] font-semibold text-sm hover:bg-[#E67E00] hover:shadow-[0_4px_12px_rgba(255,138,0,0.3)] transition-all"
        >
          <Plus className="w-5 h-5" strokeWidth={2} />
          {t("recipes.addTitle")}
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
          placeholder={t("recipes.form.searchPlaceholder")}
          className="w-full pl-12 pr-4 py-3 bg-white border-2 border-[#F5E6D8] rounded-full text-[#2A1711] placeholder-[#BCAAA4] focus:outline-none focus:border-[#FF8A00] focus:ring-2 focus:ring-[#FF8A00]/20"
        />
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <div className="p-5 bg-white rounded-3xl border border-[#F5E6D8] shadow-[0_8px_30px_rgba(109,76,65,0.08)]">
            <div className="h-5 bg-[#F5E6D8] rounded w-3/4 mb-3" />
            <div className="h-3 bg-[#F5E6D8] rounded w-1/2" />
          </div>
          <div className="p-5 bg-white rounded-3xl border border-[#F5E6D8] shadow-[0_8px_30px_rgba(109,76,65,0.08)]">
            <div className="h-5 bg-[#F5E6D8] rounded w-2/3 mb-3" />
            <div className="h-3 bg-[#F5E6D8] rounded w-1/3" />
          </div>
          <div className="p-5 bg-white rounded-3xl border border-[#F5E6D8] shadow-[0_8px_30px_rgba(109,76,65,0.08)]">
            <div className="h-5 bg-[#F5E6D8] rounded w-1/2 mb-3" />
            <div className="h-3 bg-[#F5E6D8] rounded w-1/4" />
          </div>
        </div>
      ) : filteredList.length === 0 ? (
        <div className="text-center py-16">
          <ChefHat className="w-16 h-16 text-[#DDC1AE] mx-auto mb-4" strokeWidth={1.5} />
          <p className="text-[#564334] text-lg font-[var(--font-be-vietnam)] mb-2">
            {search ? t("recipes.searchNotFound") : t("recipes.emptyState")}
          </p>
          <p className="text-[#8A7362] text-sm mb-6">
            {search ? t("recipes.searchEmptyHint") : t("recipes.emptyHint")}
          </p>
          {!search && (
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#FF8A00] text-white font-[var(--font-be-vietnam)] font-semibold text-sm hover:bg-[#E67E00] transition-all"
            >
              <Plus className="w-5 h-5" strokeWidth={2} />
              {t("recipes.addFirstButton")}
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
                {t("recipes.pagination.displayedRange", {
                  from: String(
                    Math.min(
                      (currentPage - 1) * ITEMS_PER_PAGE + 1,
                      filteredList.length,
                    ),
                  ),
                  to: String(
                    Math.min(currentPage * ITEMS_PER_PAGE, filteredList.length),
                  ),
                  total: String(filteredList.length),
                })}
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
                  {t("recipes.pagination.pageLabel", {
                    current: String(currentPage),
                    total: String(totalPages),
                  })}
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

      {showForm && (
        <ResepForm
          isOpen={showForm}
          onClose={() => setShowForm(false)}
          onSubmit={handleSubmit}
          initialData={null}
          isLoading={isSubmitting}
        />
      )}
    </div>
  );
}
