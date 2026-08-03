"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, RotateCcw, ArrowLeft } from "lucide-react";
import { Belanja } from "@/types/belanja";
import { api } from "@/lib/axios";
import { toast } from "sonner";
import Link from "next/link";
import { useTranslation } from "@/context/language-context";

export default function RiwayatBelanjaPage() {
  const router = useRouter();
  const { t, language } = useTranslation("master");
  const { t: tCommon } = useTranslation("common");

  const dateLocale = language === "id" ? "id-ID" : "en-US";

  const [data, setData] = useState<Belanja[]>([]);
  const [suppliers, setSuppliers] = useState<{ id: number; nama: string }[]>(
    [],
  );
  const [filters, setFilters] = useState({
    tanggalMulai: "",
    tanggalAkhir: "",
    supplierId: "",
  });
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.tanggalMulai)
        params.append("tanggalMulai", filters.tanggalMulai);
      if (filters.tanggalAkhir)
        params.append("tanggalAkhir", filters.tanggalAkhir);
      if (filters.supplierId) params.append("supplierId", filters.supplierId);

      const res = await api.get<Belanja[]>(`/belanja?${params.toString()}`);
      setData(res.data);
    } catch (err) {
      console.error("Gagal fetch riwayat:", err);
      toast.error(t("purchases.errorLoad"));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    api.get("/supplier").then((res) => setSuppliers(res.data));
    fetchData();
  }, []);

  const handleReset = () => {
    setFilters({ tanggalMulai: "", tanggalAkhir: "", supplierId: "" });
    fetchData();
  };

  return (
    <div className="mx-auto max-w-[1500px]">
      <Link
        href="/dashboard/belanja"
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#DDC1AE] text-[#564334] font-medium font-[var(--font-be-vietnam)] hover:bg-[#FFF8F6] hover:border-[#FF8A00] hover:text-[#FF8A00] transition-all mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        {t("purchases.title")}
      </Link>
      <h1 className="font-[var(--font-playfair)] font-bold text-3xl text-[#2A1711] mb-2">
        {t("purchases.history")}
      </h1>
      <p className="text-[#564334] mb-6">
        {t("purchases.historySubtitle")}
      </p>

      <div className="bg-white rounded-[24px] border border-[#DDC1AE] p-4 mb-6 shadow-[0_8px_30px_rgba(109,76,65,0.08)]">
        <div className="flex flex-wrap items-end gap-4">
          <div>
            <label className="block text-xs text-[#8A7362] mb-1">
              {t("purchases.startDate")}
            </label>
            <input
              type="date"
              value={filters.tanggalMulai}
              onChange={(e) =>
                setFilters((f) => ({ ...f, tanggalMulai: e.target.value }))
              }
              className="px-4 py-2 rounded-lg border border-[#DDC1AE] text-sm"
            />
          </div>
          <div>
            <label className="block text-xs text-[#8A7362] mb-1">
              {t("purchases.endDate")}
            </label>
            <input
              type="date"
              value={filters.tanggalAkhir}
              onChange={(e) =>
                setFilters((f) => ({ ...f, tanggalAkhir: e.target.value }))
              }
              className="px-4 py-2 rounded-lg border border-[#DDC1AE] text-sm"
            />
          </div>
          <div>
            <label className="block text-xs text-[#8A7362] mb-1">
              {t("purchases.supplier")}
            </label>
            <select
              value={filters.supplierId}
              onChange={(e) =>
                setFilters((f) => ({ ...f, supplierId: e.target.value }))
              }
              className="px-4 py-2 rounded-lg border border-[#DDC1AE] text-sm min-w-[160px]"
            >
              <option value="">{t("purchases.allSuppliers")}</option>
              {suppliers.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.nama}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={fetchData}
            className="px-6 py-2 rounded-full bg-[#FF8A00] text-white text-sm font-medium hover:bg-[#E67E00]"
          >
            {t("purchases.filterButton")}
          </button>
          <button
            onClick={handleReset}
            className="flex items-center gap-1 px-4 py-2 rounded-full border border-[#DDC1AE] text-[#564334] text-sm hover:bg-[#FFF8F6]"
          >
            <RotateCcw className="w-4 h-4" />
            {t("purchases.resetFilter")}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[24px] border border-[#DDC1AE] shadow-[0_8px_30px_rgba(109,76,65,0.08)] overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-[#FFF8F6] border-b border-[#DDC1AE]">
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.1em] text-[#564334]">
                {t("purchases.columns.date")}
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.1em] text-[#564334]">
                {t("purchases.columns.supplier")}
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.1em] text-[#564334]">
                {t("purchases.columns.items")}
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.1em] text-[#564334]">
                {t("purchases.columns.total")}
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.1em] text-[#564334]">
                {t("purchases.columns.actions")}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F5E6D8]">
            {isLoading ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-[#8A7362]">
                  {tCommon("status.loading")}
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-[#8A7362]">
                  {tCommon("status.noData")}
                </td>
              </tr>
            ) : (
              data.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-[#FFE9E4] transition-colors"
                >
                  <td className="px-6 py-4 font-medium text-[#2A1711]">
                    {new Date(item.tanggal).toLocaleDateString(dateLocale, {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-6 py-4 text-[#564334] text-sm">
                    {item.suppliers.join(", ")}
                  </td>
                  <td className="px-6 py-4 text-[#564334]">
                    {item.jumlahItem} item
                  </td>
                  <td className="px-6 py-4 font-[var(--font-roboto-mono)] font-semibold text-[#2A1711]">
                    Rp {item.totalBelanja.toLocaleString(dateLocale)}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() =>
                        router.push(`/dashboard/belanja/${item.id}`)
                      }
                      className="p-2 rounded-full hover:bg-[#FFE9E4] text-[#564334]"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
