"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useTranslation } from "@/context/language-context";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  ChefHat,
  Target,
  CheckCircle,
  Wallet,
  Calendar,
} from "lucide-react";
import { Produksi } from "@/types/produksi";
import { api } from "@/lib/axios";
import { ProduksiTable } from "@/components/dashboard/produksi/ProduksiTable";
import { formatLocalDate } from "@/lib/utils";

// Modal ProduksiForm diload on-demand (chunk terpisah) — react-hook-form + zod
// hanya dimuat saat pengguna membuka form "Catat Produksi".
const ProduksiForm = dynamic(
  () =>
    import("@/components/dashboard/produksi/ProduksiForm").then(
      (m) => m.ProduksiForm,
    ),
  { ssr: false },
);

export default function ProduksiPageClient() {
  const { t, language } = useTranslation("master");
  const { t: tCommon } = useTranslation("common");
  const router = useRouter();
  const [produksiList, setProduksiList] = useState<Produksi[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const dateInputRef = useRef<HTMLInputElement>(null);

  const fetchList = useCallback(async (date: Date) => {
    setIsLoading(true);
    setFetchError(null);
    try {
      const tanggal = formatLocalDate(date);
      const res = await api.get<Produksi[]>(`/produksi?tanggal=${tanggal}`);
      setProduksiList(res.data);
    } catch (err) {
      setFetchError(t("production.errorLoad"));
      setProduksiList([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchList(currentDate);
  }, [currentDate, fetchList]);

  // Stats computed from data — EXCLUDE status BATAL, dan cast Number()
  // karena field Decimal (totalModal, hppPerPcs) bisa datang sebagai string dari API
  const validList = produksiList.filter((p) => p.status !== "BATAL");
  const totalBatch = validList.length;
  const totalEstimasi = validList.reduce(
    (s, p) => s + Number(p.estimasiHasil),
    0,
  );
  const totalHasilNyata = validList.reduce(
    (s, p) => s + Number(p.hasilNyata ?? 0),
    0,
  );
  const totalModal = validList.reduce((s, p) => s + Number(p.totalModal), 0);
  const fulfillmentRate =
    totalEstimasi > 0 ? Math.round((totalHasilNyata / totalEstimasi) * 100) : 0;

  const handlePrevDay = () => {
    const prev = new Date(currentDate);
    prev.setDate(prev.getDate() - 1);
    setCurrentDate(prev);
  };

  const handleNextDay = () => {
    const next = new Date(currentDate);
    next.setDate(next.getDate() + 1);
    setCurrentDate(next);
  };

  const handleToday = () => setCurrentDate(new Date());

  const handleDatePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.value) return;
    const [y, m, d] = e.target.value.split("-").map(Number);
    setCurrentDate(new Date(y, m - 1, d));
  };

  const dateLocale = language === "id" ? "id-ID" : "en-US";

  const dateStr = currentDate.toLocaleDateString(dateLocale, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const dateInputValue = formatLocalDate(currentDate);
  const isToday =
    new Date().toLocaleDateString(dateLocale) ===
    currentDate.toLocaleDateString(dateLocale);

  return (
    <div className="mx-auto max-w-[1500px]">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="font-[var(--font-playfair)] font-bold text-3xl md:text-4xl text-[#2A1711] mb-2">
            {t("production.title")}
          </h1>
          <p className="text-[#564334] text-lg">{t("production.subtitle")}</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#FF8A00] text-white font-semibold hover:bg-[#E67E00] transition-all shadow-[0_10px_30px_rgba(255,138,0,0.25)]"
        >
          <Plus className="w-5 h-5" />
          {t("production.addTitle")}
        </button>
      </div>

      {/* NAVIGASI TANGGAL */}
      <div className="flex items-center justify-between bg-[#FFF8F6] px-4 py-3 rounded-2xl border border-[#DDC1AE] mb-8">
        <button
          onClick={handlePrevDay}
          className="p-2 rounded-full hover:bg-[#FFE9E4] text-[#FF8A00] transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="inline-flex bg-white p-1 rounded-full border border-[#DDC1AE]">
          <button
            onClick={handleToday}
            className={`px-4 py-2 rounded-full text-xs font-semibold font-[var(--font-be-vietnam)] transition-all ${
              isToday
                ? "bg-[#FF8A00] text-white shadow-sm"
                : "text-[#564334] hover:bg-[#FFF8F6]"
            }`}
          >
            {tCommon("buttons.today")}
          </button>

          <div className="relative">
            <button
              onClick={() => dateInputRef.current?.showPicker()}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold font-[var(--font-be-vietnam)] transition-all ${
                !isToday
                  ? "bg-[#FF8A00] text-white shadow-sm"
                  : "text-[#564334] hover:bg-[#FFF8F6]"
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>{dateStr}</span>
            </button>
            <input
              type="date"
              ref={dateInputRef}
              value={dateInputValue}
              onChange={handleDatePick}
              className="absolute inset-0 w-0 h-0 opacity-0 pointer-events-none"
            />
          </div>
        </div>

        <button
          onClick={handleNextDay}
          className="p-2 rounded-full hover:bg-[#FFE9E4] text-[#FF8A00] transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-[24px] border border-[#DDC1AE] p-5 shadow-[0_8px_30px_rgba(109,76,65,0.08)]">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-xl bg-[#FFF3E5] text-[#FF8A00]">
              <ChefHat className="w-4 h-4" />
            </div>
            <p className="text-xs text-[#8A7362] font-medium">
              {t("reports.summary.totalProduction")}
            </p>
          </div>
          <p className="font-[var(--font-roboto-mono)] font-bold text-2xl text-[#2A1711]">
            {totalBatch} Batch
          </p>
          <p className="text-xs text-[#06D6A0] mt-1">
            {t("production.stats.todayProduction", {
              count: String(totalBatch),
            })}
          </p>
        </div>

        <div className="bg-white rounded-[24px] border border-[#DDC1AE] p-5 shadow-[0_8px_30px_rgba(109,76,65,0.08)]">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-xl bg-[#FFF3E5] text-[#FF8A00]">
              <Target className="w-4 h-4" />
            </div>
            <p className="text-xs text-[#8A7362] font-medium">
              {t("production.estimatedYield")}
            </p>
          </div>
          <p className="font-[var(--font-roboto-mono)] font-bold text-2xl text-[#2A1711]">
            {totalEstimasi.toLocaleString("id-ID")} pcs
          </p>
          <p className="text-xs text-[#564334] mt-1">
            {t("production.stats.estimatedDescription")}
          </p>
        </div>

        <div className="bg-white rounded-[24px] border border-[#DDC1AE] p-5 shadow-[0_8px_30px_rgba(109,76,65,0.08)]">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-xl bg-[#E6FBF7] text-[#06D6A0]">
              <CheckCircle className="w-4 h-4" />
            </div>
            <p className="text-xs text-[#8A7362] font-medium">
              {t("production.actualYield")}
            </p>
          </div>
          <p className="font-[var(--font-roboto-mono)] font-bold text-2xl text-[#06D6A0]">
            {totalHasilNyata.toLocaleString("id-ID")} pcs
          </p>
          <p
            className={`text-xs mt-1 ${
              fulfillmentRate >= 90 ? "text-[#06D6A0]" : "text-[#FF8A00]"
            }`}
          >
            {t("production.stats.fulfillmentLabel", {
              percent: String(fulfillmentRate),
            })}
          </p>
        </div>

        <div className="bg-white rounded-[24px] border border-[#DDC1AE] p-5 shadow-[0_8px_30px_rgba(109,76,65,0.08)]">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-xl bg-[#FFF3E5] text-[#FF8A00]">
              <Wallet className="w-4 h-4" />
            </div>
            <p className="text-xs text-[#8A7362] font-medium">
              {t("production.totalCost")}
            </p>
          </div>
          <p className="font-[var(--font-roboto-mono)] font-bold text-2xl text-[#FF8A00]">
            Rp {totalModal.toLocaleString("id-ID")}
          </p>
          <p className="text-xs text-[#564334] mt-1">
            {t("production.stats.costDescription")}
          </p>
        </div>
      </div>

      {/* ERROR MESSAGE */}
      {fetchError && (
        <div className="mb-4 p-4 rounded-2xl bg-[#FEE2E2] border border-[#FCA5A5] text-[#EF4444] text-sm">
          {fetchError}
        </div>
      )}

      {/* TABEL DATA */}
      <div className="bg-white rounded-[24px] border border-[#DDC1AE] shadow-[0_8px_30px_rgba(109,76,65,0.08)] overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-[#8A7362]">
            <div className="w-8 h-8 border-4 border-[#FFE9E4] border-t-[#FF8A00] rounded-full animate-spin mx-auto mb-3" />
            {t("production.loading")}
          </div>
        ) : produksiList.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <ChefHat className="w-16 h-16 text-[#DDC1AE] mb-4" />
            <p className="text-[#564334] text-lg font-medium mb-2">
              {t("production.emptyState")}
            </p>
            <p className="text-[#8A7362] text-sm mb-6">{dateStr}</p>
            <button
              onClick={() => setShowForm(true)}
              className="px-6 py-2.5 rounded-full bg-[#FF8A00] text-white font-medium hover:bg-[#E67E00]"
            >
              {t("production.addTitle")}
            </button>
          </div>
        ) : (
          <ProduksiTable
            data={produksiList}
            onRefresh={() => fetchList(currentDate)}
          />
        )}
      </div>

      {showForm && (
        <ProduksiForm
          isOpen={showForm}
          onClose={() => setShowForm(false)}
          onSuccess={() => fetchList(currentDate)}
        />
      )}
    </div>
  );
}
