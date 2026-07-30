"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { 
  ArrowLeft, 
  Calendar, 
  Download, 
  TrendingUp, 
  Receipt, 
  Coins, 
  Percent,
  TrendingDown
} from "lucide-react";
import { api } from "@/lib/axios";
import { useTranslation } from "@/context/language-context";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from "recharts";

interface RingkasanStats {
  totalPendapatan: number;
  totalHpp: number;
  totalLaba: number;
  margin: number;
}

interface Tren {
  pendapatan: number;
  hpp: number;
  laba: number;
  margin: number;
}

interface TopProduct {
  nama: string;
  terjual: number;
  pendapatan: number;
  laba: number;
}

interface DailyRow {
  tanggal: string;
  pendapatan: number;
  hpp: number;
  laba: number;
  margin: number;
}

function TrenIndicator({ value }: { value: number | undefined }) {
  const v = value ?? 0;
  if (v > 0) {
    return (
      <p className="text-[11px] text-[#06D6A0] font-medium mt-1">
        ▲ {v}% vs minggu lalu
      </p>
    );
  }
  if (v < 0) {
    return (
      <p className="text-[11px] text-[#EF4444] font-medium mt-1">
        ▼ {Math.abs(v)}% vs minggu lalu
      </p>
    );
  }
  return (
    <p className="text-[11px] text-[#8A7362] font-medium mt-1">
      0% vs minggu lalu
    </p>
  );
}

export default function RingkasanPageClient() {
  const { t, language } = useTranslation("master");
  const { t: tCommon } = useTranslation("common");
  const dateLocale = language === "id" ? "id-ID" : "en-US";
  const [periode, setPeriode] = useState("7"); // 7 hari, 30 hari, custom
  const [tanggalMulai, setTanggalMulai] = useState("");
  const [tanggalAkhir, setTanggalAkhir] = useState("");
  const [stats, setStats] = useState<RingkasanStats>({
    totalPendapatan: 0,
    totalHpp: 0,
    totalLaba: 0,
    margin: 0,
  });

  const [tren, setTren] = useState<Tren>({
    pendapatan: 0,
    hpp: 0,
    laba: 0,
    margin: 0,
  });

  const [chartData, setChartData] = useState<
    { name: string; Pendapatan: number; HPP: number; Laba: number }[]
  >([]);

  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);

  const [dailyReport, setDailyReport] = useState<DailyRow[]>([]);

  const [isLoading, setIsLoading] = useState(false);

  // Set default custom dates based on 7 days range
  useEffect(() => {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - 7);
    setTanggalMulai(start.toISOString().split("T")[0]);
    setTanggalAkhir(end.toISOString().split("T")[0]);
  }, []);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      // NOTE: backend (laporan.controller.ts) hanya menerima query `days`
      // (7/30/90/180). Custom date-range (tanggalMulai/tanggalAkhir) BELUM
      // didukung oleh getRingkasan/getGrafikLaba — kalau periode "custom"
      // dipilih, kita fallback ke 7 hari sampai backend menambah dukungan itu.
      const params = periode === "custom"
        ? { days: 7 }
        : { days: periode };

      const [resStats, resChart, resProducts] = await Promise.all([
        api.get("/laporan/ringkasan", { params }),
        api.get("/laporan/grafik-laba", { params }),
        api.get("/laporan/produk-terlaris", { params })
      ]);

      // Map stats + tren
      if (resStats.data) {
        setStats({
          totalPendapatan: Number(resStats.data.totalPendapatan ?? 0),
          totalHpp: Number(resStats.data.totalHpp ?? 0),
          totalLaba: Number(resStats.data.totalLaba ?? 0),
          margin: Number(resStats.data.margin ?? 0),
        });
        setTren({
          pendapatan: Number(resStats.data.tren?.pendapatan ?? 0),
          hpp: Number(resStats.data.tren?.hpp ?? 0),
          laba: Number(resStats.data.tren?.laba ?? 0),
          margin: Number(resStats.data.tren?.margin ?? 0),
        });
      }

      // Map grafik-laba -> chart (backend sekarang balikin {label, pendapatan, hpp, laba} lengkap)
      if (Array.isArray(resChart.data)) {
        setChartData(
          resChart.data.map(
            (d: { label: string; pendapatan: number; hpp: number; laba: number }) => ({
              name: d.label,
              Pendapatan: Number(d.pendapatan ?? 0),
              HPP: Number(d.hpp ?? 0),
              Laba: Number(d.laba ?? 0),
            }),
          ),
        );
      }

      // Map produk terlaris (backend sekarang balikin laba per produk juga)
      if (Array.isArray(resProducts.data)) {
        setTopProducts(
          resProducts.data.map((p: any) => ({
            nama: p.name,
            terjual: Number(String(p.sold).replace(/[^\d]/g, "")),
            pendapatan: Number(String(p.revenue).replace(/[^\d]/g, "")),
            laba: Number(p.laba ?? 0),
          })),
        );
      }
    } catch (err) {
      console.error("Gagal sinkronisasi data real API, menggunakan preset visual.", err);
    } finally {
      setIsLoading(false);
    }
  }, [periode, tanggalMulai, tanggalAkhir]);

  useEffect(() => {
    if (periode !== "custom" || (tanggalMulai && tanggalAkhir)) {
      fetchData();
    }
  }, [periode, tanggalMulai, tanggalAkhir, fetchData]);

  return (
    <div className="mx-auto max-w-[1400px] space-y-6 pb-12">
      {/* Header Back & Nav */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-[#564334] mb-2 font-medium">
            <Link href="/dashboard/penjualan" className="hover:text-[#FF8A00] flex items-center gap-1 transition-all">
              <ArrowLeft className="w-4 h-4" /> {t("sales.title")}
            </Link>
            <span>•</span>
            <span className="text-[#8A7362]">{t("sales.summaryPage.breadcrumbCurrent")}</span>
          </div>
          <h1 className="font-[var(--font-playfair)] font-bold text-3xl text-[#2A1711]">
            {t("sales.summaryPage.title")}
          </h1>
          <p className="text-[#8A7362] text-sm mt-0.5">{t("sales.summaryPage.subtitle")}</p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={periode}
            onChange={(e) => setPeriode(e.target.value)}
            className="px-4 py-2.5 rounded-xl border border-[#DDC1AE] bg-white text-sm text-[#564334] font-medium focus:outline-none focus:border-[#FF8A00]"
          >
            <option value="7">{t("sales.summaryPage.7days")}</option>
            <option value="30">{t("sales.summaryPage.30days")}</option>
            <option value="90">{t("sales.summaryPage.90days")}</option>
            <option value="custom">{t("sales.summaryPage.customPeriod")}</option>
          </select>

          {periode === "custom" && (
            <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-[#DDC1AE]">
              <input
                type="date"
                value={tanggalMulai}
                onChange={(e) => setTanggalMulai(e.target.value)}
                className="text-xs text-[#564334] focus:outline-none"
              />
              <span className="text-[#8A7362] text-xs">{t("sales.summaryPage.dateSeparator")}</span>
              <input
                type="date"
                value={tanggalAkhir}
                onChange={(e) => setTanggalAkhir(e.target.value)}
                className="text-xs text-[#564334] focus:outline-none"
              />
            </div>
          )}

          <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[#DDC1AE] bg-white text-sm text-[#564334] font-semibold hover:bg-[#FFF8F6] transition-all">
            <Download className="w-4 h-4 text-[#FF8A00]" />
            <span>{t("sales.summaryPage.exportButton")}</span>
          </button>
        </div>
      </div>

      {/* Stats Cards (4 Column Grid) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="bg-white rounded-[24px] border border-[#DDC1AE] p-5 shadow-[0_8px_30px_rgba(109,76,65,0.08)]">
          <div className="flex items-center gap-2 text-[#8A7362] text-xs font-semibold uppercase tracking-wider mb-2">
            <div className="p-1.5 rounded-lg bg-[#FFE9E4] text-[#FF8A00]">
              <TrendingUp className="w-4 h-4" />
            </div>
            <span>{t("sales.summaryPage.totalPendapatan")}</span>
          </div>
          <p className="font-[var(--font-roboto-mono)] font-bold text-2xl text-[#2A1711]">
            Rp {stats.totalPendapatan.toLocaleString(dateLocale)}
          </p>
          <TrenIndicator value={tren.pendapatan} />
        </div>

        {/* Card 2 */}
        <div className="bg-white rounded-[24px] border border-[#DDC1AE] p-5 shadow-[0_8px_30px_rgba(109,76,65,0.08)]">
          <div className="flex items-center gap-2 text-[#8A7362] text-xs font-semibold uppercase tracking-wider mb-2">
            <div className="p-1.5 rounded-lg bg-[#F1E9DA] text-[#564334]">
              <Receipt className="w-4 h-4" />
            </div>
            <span>{t("sales.summaryPage.totalHpp")}</span>
          </div>
          <p className="font-[var(--font-roboto-mono)] font-bold text-2xl text-[#2A1711]">
            Rp {stats.totalHpp.toLocaleString(dateLocale)}
          </p>
          <TrenIndicator value={tren.hpp} />
        </div>

        {/* Card 3 */}
        <div className="bg-white rounded-[24px] border border-[#DDC1AE] p-5 shadow-[0_8px_30px_rgba(109,76,65,0.08)]">
          <div className="flex items-center gap-2 text-[#8A7362] text-xs font-semibold uppercase tracking-wider mb-2">
            <div className="p-1.5 rounded-lg bg-[#D0F4DE] text-[#06D6A0]">
              <Coins className="w-4 h-4" />
            </div>
            <span>{t("sales.summaryPage.totalLaba")}</span>
          </div>
          <p className="font-[var(--font-roboto-mono)] font-bold text-2xl text-[#06D6A0]">
            Rp {stats.totalLaba.toLocaleString(dateLocale)}
          </p>
          <TrenIndicator value={tren.laba} />
        </div>

        {/* Card 4 */}
        <div className="bg-white rounded-[24px] border border-[#DDC1AE] p-5 shadow-[0_8px_30px_rgba(109,76,65,0.08)]">
          <div className="flex items-center gap-2 text-[#8A7362] text-xs font-semibold uppercase tracking-wider mb-2">
            <div className="p-1.5 rounded-lg bg-[#EAF2D7] text-[#606C38]">
              <Percent className="w-4 h-4" />
            </div>
            <span>{t("sales.summaryPage.marginKeuntungan")}</span>
          </div>
          <p className="font-[var(--font-roboto-mono)] font-bold text-2xl text-[#2A1711]">
            {stats.margin}%
          </p>
          <TrenIndicator value={tren.margin} />
        </div>
      </div>

      {/* Grid Chart & Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Column (Span 2) */}
        <div className="lg:col-span-2 bg-white rounded-[24px] border border-[#DDC1AE] p-6 shadow-[0_8px_30px_rgba(109,76,65,0.08)] flex flex-col justify-between">
          <div className="mb-4">
            <h3 className="font-[var(--font-playfair)] font-bold text-lg text-[#2A1711]">
              {t("sales.summaryPage.chartTitle")}
            </h3>
            <p className="text-xs text-[#8A7362]">{t("sales.summaryPage.chartSubtitle")}</p>
          </div>

          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorPendapatan" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF8A00" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#FF8A00" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorLaba" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06D6A0" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#06D6A0" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#EFE3D7" />
                <XAxis dataKey="name" stroke="#8A7362" fontSize={11} tickLine={false} />
                <YAxis stroke="#8A7362" fontSize={11} tickLine={false} />
                <Tooltip />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                <Area type="monotone" dataKey="Pendapatan" stroke="#FF8A00" strokeWidth={2} fillOpacity={1} fill="url(#colorPendapatan)" />
                <Area type="monotone" dataKey="HPP" stroke="#564334" strokeWidth={2} strokeDasharray="5 5" fill="none" />
                <Area type="monotone" dataKey="Laba" stroke="#06D6A0" strokeWidth={2} fillOpacity={1} fill="url(#colorLaba)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-[24px] border border-[#DDC1AE] p-6 shadow-[0_8px_30px_rgba(109,76,65,0.08)]">
          <div className="mb-4">
            <h3 className="font-[var(--font-playfair)] font-bold text-lg text-[#2A1711]">
              {t("sales.summaryPage.topProducts")}
            </h3>
            <p className="text-xs text-[#8A7362]">{t("sales.summaryPage.topProductsSubtitle")}</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#EFE3D7] pb-2 text-[#8A7362]">
                  <th className="py-2 font-semibold">{t("sales.summaryPage.tableNo")}</th>
                  <th className="py-2 font-semibold">{t("sales.summaryPage.tableProduct")}</th>
                  <th className="py-2 font-semibold text-center">{t("sales.summaryPage.tableSold")}</th>
                  <th className="py-2 font-semibold text-right">{t("sales.summaryPage.tableProfit")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F5E6D8]">
                {topProducts.map((prod, index) => (
                  <tr key={index} className="hover:bg-[#FFF8F6]">
                    <td className="py-3 text-[#8A7362] font-semibold">{index + 1}</td>
                    <td className="py-3 font-semibold text-[#2A1711]">{prod.nama}</td>
                    <td className="py-3 text-center font-[var(--font-roboto-mono)] text-[#564334]">{prod.terjual} pcs</td>
                    <td className="py-3 text-right font-[var(--font-roboto-mono)] font-bold text-[#06D6A0]">
                      Rp {prod.laba.toLocaleString(dateLocale)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Ringkasan Harian Table */}
      <div className="bg-white rounded-[24px] border border-[#DDC1AE] p-6 shadow-[0_8px_30px_rgba(109,76,65,0.08)]">
        <div className="mb-4">
          <h3 className="font-[var(--font-playfair)] font-bold text-lg text-[#2A1711]">
            {t("sales.summaryPage.dailySummary")}
          </h3>
          <p className="text-xs text-[#8A7362]">{t("sales.summaryPage.dailySummarySubtitle")}</p>
        </div>

        <div className="overflow-x-auto">
          {dailyReport.length === 0 ? (
            <div className="text-center py-10 text-[#8A7362] text-sm">
              Rincian per-hari belum tersedia — backend `/laporan/grafik-laba`
              baru mengembalikan total laba per hari, belum breakdown
              pendapatan &amp; HPP per hari.
            </div>
          ) : (
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-[#FFF8F6] border-b border-[#DDC1AE] text-xs font-semibold uppercase tracking-wider text-[#564334]">
                <th className="px-4 py-3">{t("sales.summaryPage.tableDate")}</th>
                <th className="px-4 py-3 text-right">{t("sales.summaryPage.tableRevenue")}</th>
                <th className="px-4 py-3 text-right">{t("sales.summaryPage.tableHpp")}</th>
                <th className="px-4 py-3 text-right">{t("sales.summaryPage.tableProfitSmall")}</th>
                <th className="px-4 py-3 text-center">{t("sales.summaryPage.tableMargin")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F5E6D8]">
              {dailyReport.map((row, index) => (
                <tr key={index} className="hover:bg-[#FFE9E4] transition-all">
                  <td className="px-4 py-3 font-medium text-[#2A1711]">{row.tanggal}</td>
                  <td className="px-4 py-3 text-right font-[var(--font-roboto-mono)] text-[#564334]">Rp {row.pendapatan.toLocaleString(dateLocale)}</td>
                  <td className="px-4 py-3 text-right font-[var(--font-roboto-mono)] text-[#8A7362]">Rp {row.hpp.toLocaleString(dateLocale)}</td>
                  <td className="px-4 py-3 text-right font-[var(--font-roboto-mono)] font-bold text-[#06D6A0]">Rp {row.laba.toLocaleString(dateLocale)}</td>
                  <td className="px-4 py-3 text-center font-[var(--font-roboto-mono)]">
                    <span className="bg-[#EAF2D7] text-[#606C38] px-2.5 py-1 rounded-full text-xs font-bold">
                      {row.margin}%
                    </span>
                  </td>
                </tr>
              ))}
              {/* Grand Total Row */}
              <tr className="bg-[#FFF8F6] font-bold border-t border-[#DDC1AE]">
                <td className="px-4 py-4 text-[#2A1711]">{tCommon("labels.total")}</td>
                <td className="px-4 py-4 text-right font-[var(--font-roboto-mono)]">Rp {stats.totalPendapatan.toLocaleString(dateLocale)}</td>
                <td className="px-4 py-4 text-right font-[var(--font-roboto-mono)]">Rp {stats.totalHpp.toLocaleString(dateLocale)}</td>
                <td className="px-4 py-4 text-right font-[var(--font-roboto-mono)] text-[#06D6A0]">Rp {stats.totalLaba.toLocaleString(dateLocale)}</td>
                <td className="px-4 py-4 text-center font-[var(--font-roboto-mono)] text-[#2A1711]">{stats.margin}%</td>
              </tr>
            </tbody>
          </table>
          )}
        </div>
      </div>
    </div>
  );
}