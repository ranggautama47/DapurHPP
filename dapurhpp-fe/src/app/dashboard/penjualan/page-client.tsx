"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  ShoppingCart,
  Receipt,
  Coins,
  Percent,
  Calendar,
  TrendingUp,
  BarChart2,
} from "lucide-react";
import { PenjualanRingkasan, Penjualan } from "@/types/penjualan";
import { api } from "@/lib/axios";
import {
  PenjualanTable,
  PenjualanForm,
} from "@/components/dashboard/penjualan";
import { formatLocalDate } from "@/lib/utils";
import { useTranslation } from "@/context/language-context";

export default function PenjualanPageClient() {
  const { t, language } = useTranslation("master");
  const { t: tCommon } = useTranslation("common");
  const router = useRouter();
  const [ringkasan, setRingkasan] = useState<{
    totalPendapatan: number;
    totalHpp: number;
    totalLaba: number;
    margin: number;
    list: Penjualan[];
  } | null>(null);

  const [currentDate, setCurrentDate] = useState(new Date());
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const dateInputRef = useRef<HTMLInputElement>(null);

  const fetchRingkasan = useCallback(async (date: Date) => {
    setIsLoading(true);
    setFetchError(null);
    try {
      const tanggal = formatLocalDate(date);
      const res = await api.get<Penjualan[]>(`/penjualan?tanggal=${tanggal}`);

      const totalPendapatan = res.data.reduce(
        (sum, item) => sum + Number(item.totalPendapatan),
        0,
      );
      const totalLaba = res.data.reduce(
        (sum, item) => sum + Number(item.laba),
        0,
      );

      // Calculate Total HPP from API data
      const totalHpp = res.data.reduce(
        (sum, item) => sum + item.terjual * Number(item.produksi.hppPerPcs),
        0,
      );

      // Calculate Margin
      const margin =
        totalPendapatan > 0
          ? parseFloat(
              (((totalPendapatan - totalHpp) / totalPendapatan) * 100).toFixed(
                1,
              ),
            )
          : 0;

      setRingkasan({
        totalPendapatan,
        totalHpp,
        totalLaba,
        margin,
        list: res.data,
      });
    } catch (err) {
      setFetchError(t("sales.errorLoad"));
      setRingkasan(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRingkasan(currentDate);
  }, [currentDate, fetchRingkasan]);

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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="font-[var(--font-playfair)] font-bold text-3xl md:text-4xl text-[#2A1711] mb-2">
            {t("sales.title")}
          </h1>
          <p className="text-[#564334] text-lg">{t("sales.subtitle")}</p>
        </div>
        <div className="flex items-center gap-3">
          {/* DIUBAH: Mengganti "Riwayat" button dengan "Ringkasan" button yang mengarah ke halaman baru */}
          <Link
            href="/dashboard/penjualan/ringkasan"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-[#DDC1AE] text-[#564334] font-semibold hover:bg-[#FFF8F6] hover:border-[#FF8A00] hover:text-[#FF8A00] transition-all bg-white shadow-sm"
          >
            <BarChart2 className="w-5 h-5 text-[#FF8A00]" />
            {t("sales.summaryPage.exportButton")}
          </Link>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#FF8A00] text-white font-semibold hover:bg-[#E67E00] transition-all shadow-[0_10px_30px_rgba(255,138,0,0.25)]"
          >
            <Plus className="w-5 h-5" />
            {t("sales.addTitle")}
          </button>
        </div>
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

      {/* STATS GRID - 4 Card Sesuai Blueprint */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Card 1: Total Pendapatan */}
        <div className="bg-white rounded-[24px] border border-[#DDC1AE] p-5 shadow-[0_8px_30px_rgba(109,76,65,0.08)]">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-xl bg-[#FFF3E5] text-[#FF8A00]">
              <TrendingUp className="w-4 h-4" />
            </div>
            <p className="text-xs text-[#8A7362] font-semibold uppercase tracking-wider">
              {t("sales.form.totalRevenueLabel")}
            </p>
          </div>
          <p className="font-[var(--font-roboto-mono)] font-bold text-2xl text-[#2A1711]">
            Rp {ringkasan?.totalPendapatan.toLocaleString("id-ID") ?? 0}
          </p>
          <p className="text-[10px] text-[#8A7362] font-medium mt-1">
            {t("sales.summaryPage.totalRevenueToday")}
          </p>
        </div>

        {/* Card 2: Total HPP */}
        <div className="bg-white rounded-[24px] border border-[#DDC1AE] p-5 shadow-[0_8px_30px_rgba(109,76,65,0.08)]">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-xl bg-[#F1E9DA] text-[#564334]">
              <Receipt className="w-4 h-4" />
            </div>
            <p className="text-xs text-[#8A7362] font-semibold uppercase tracking-wider">
              {t("sales.form.totalCostLabel")}
            </p>
          </div>
          <p className="font-[var(--font-roboto-mono)] font-bold text-2xl text-[#2A1711]">
            Rp {ringkasan?.totalHpp.toLocaleString("id-ID") ?? 0}
          </p>
          <p className="text-[10px] text-[#8A7362] font-medium mt-1">
            {t("sales.summaryPage.totalHppLabel")}
          </p>
        </div>

        {/* Card 3: Total Laba */}
        <div className="bg-white rounded-[24px] border border-[#DDC1AE] p-5 shadow-[0_8px_30px_rgba(109,76,65,0.08)]">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-xl bg-[#E6FBF7] text-[#06D6A0]">
              <Coins className="w-4 h-4" />
            </div>
            <p className="text-xs text-[#8A7362] font-semibold uppercase tracking-wider">
              {t("sales.summaryPage.totalProfitToday")}
            </p>
          </div>
          <p className="font-[var(--font-roboto-mono)] font-bold text-2xl text-[#06D6A0]">
            Rp {ringkasan?.totalLaba.toLocaleString("id-ID") ?? 0}
          </p>
          <p className="text-[10px] text-[#8A7362] font-medium mt-1">
            {t("sales.summaryPage.totalLabaToday")}
          </p>
        </div>

        {/* Card 4: Margin */}
        <div className="bg-white rounded-[24px] border border-[#DDC1AE] p-5 shadow-[0_8px_30px_rgba(109,76,65,0.08)]">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-xl bg-[#EAF2D7] text-[#606C38]">
              <Percent className="w-4 h-4" />
            </div>
            <p className="text-xs text-[#8A7362] font-semibold uppercase tracking-wider">
              {t("sales.summaryPage.marginKeuntungan")}
            </p>
          </div>
          <p className="font-[var(--font-roboto-mono)] font-bold text-2xl text-[#2A1711]">
            {ringkasan?.margin ?? 0}%
          </p>
          <p className="text-[10px] text-[#564334] font-medium mt-1">
            {t("sales.summaryPage.vsLastWeek")}
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
            {t("common.status.loading")}
          </div>
        ) : !ringkasan || ringkasan.list.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <ShoppingCart className="w-16 h-16 text-[#DDC1AE] mb-4" />
            <p className="text-[#564334] text-lg font-medium mb-2">
              {t("sales.noSalesToday")}
            </p>
            <p className="text-[#8A7362] text-sm mb-6">{dateStr}</p>
            <button
              onClick={() => setShowForm(true)}
              className="px-6 py-2.5 rounded-full bg-[#FF8A00] text-white font-medium hover:bg-[#E67E00]"
            >
              {t("sales.addTitle")}
            </button>
          </div>
        ) : (
          <PenjualanTable data={ringkasan.list} onRefresh={fetchRingkasan} />
        )}
      </div>

      <PenjualanForm
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        onSuccess={() => fetchRingkasan(currentDate)}
      />
    </div>
  );
}
