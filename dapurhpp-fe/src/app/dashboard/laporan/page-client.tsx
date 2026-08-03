"use client";

import { useTranslation } from "@/context/language-context";
import { useEffect, useState, useCallback } from "react";
import { FileText, FileSpreadsheet, Download } from "lucide-react";
import { api } from "@/lib/axios";
import { formatLocalDate } from "@/lib/utils";
import {
  RingkasanLaporan,
  GrafikLabaItem,
  DistribusiHppItem,
  FilterState,
  FilterPeriod,
} from "@/types/laporan";
import {
  LaporanFilter,
  RingkasanCards,
  GrafikPerforma,
  DistribusiHpp,
  DetailPerforma,
  RingkasanOperasional,
} from "@/components/dashboard/laporan";

function formatDateRange(mulai: string, akhir: string): string {
  if (!mulai && !akhir) return "";
  const d1 = new Date(mulai + "T00:00:00");
  const d2 = new Date(akhir + "T00:00:00");
  const opt: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "long",
    year: "numeric",
  };
  return `${d1.toLocaleDateString("id-ID", opt)} - ${d2.toLocaleDateString("id-ID", opt)}`;
}

function getDefaultDates(period: FilterPeriod): {
  tanggalMulai: string;
  tanggalAkhir: string;
} {
  const today = new Date();
  const akhir = formatLocalDate(today);
  if (period === "custom") return { tanggalMulai: "", tanggalAkhir: "" };
  const mulai = new Date(today);
  mulai.setDate(mulai.getDate() - (period === 1 ? 0 : period));
  return {
    tanggalMulai: formatLocalDate(period === 1 ? today : mulai),
    tanggalAkhir: akhir,
  };
}

export default function LaporanPageClient() {
  const { t } = useTranslation("master");
  const [filter, setFilter] = useState<FilterState>({
    period: 7,
    ...getDefaultDates(7),
  });
  const [ringkasan, setRingkasan] = useState<RingkasanLaporan | null>(null);
  const [grafik, setGrafik] = useState<GrafikLabaItem[]>([]);
  const [distribusi, setDistribusi] = useState<DistribusiHppItem[]>([]);
  const [operasionalCounts, setOperasionalCounts] = useState({
    totalProduksi: 0,
    totalPenjualan: 0,
    totalBelanja: 0,
    totalPengeluaranLain: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = useCallback(async (days: number) => {
    setLoading(true);
    setError(null);
    try {
      const [ringkasanRes, grafikRes, distribusiRes] = await Promise.all([
        api.get<RingkasanLaporan>(`/laporan/ringkasan?days=${days}`),
        api.get<GrafikLabaItem[]>(`/laporan/grafik-laba?days=${days}`),
        api.get<DistribusiHppItem[]>(`/laporan/distribusi-hpp?days=${days}`),
      ]);
      setRingkasan(ringkasanRes.data);
      setGrafik(grafikRes.data);
      setDistribusi(distribusiRes.data);

      // Fetch counts for operasional
      try {
        const [produksiRes, penjualanRes, belanjaRes, pengeluaranRes] =
          await Promise.all([
            api.get<any[]>("/produksi"),
            api.get<any[]>("/penjualan"),
            api.get<any[]>("/belanja"),
            api.get<any[]>("/pengeluaran-lain"),
          ]);
        setOperasionalCounts({
          totalProduksi: produksiRes.data.length,
          totalPenjualan: penjualanRes.data.length,
          totalBelanja: belanjaRes.data.length,
          totalPengeluaranLain: pengeluaranRes.data.length,
        });
      } catch {
        setOperasionalCounts({
          totalProduksi: 0,
          totalPenjualan: 0,
          totalBelanja: 0,
          totalPengeluaranLain: 0,
        });
      }
    } catch (err) {
      setError(t("dashboard.summary.fetchError"));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (filter.period !== "custom") {
      fetchAll(filter.period as number);
    }
  }, [filter.period, fetchAll]);

  const handleFilterChange = useCallback((period: FilterPeriod) => {
    const dates = getDefaultDates(period);
    setFilter({ period, ...dates });
  }, []);

  const handleDateChange = useCallback(
    (field: "tanggalMulai" | "tanggalAkhir", value: string) => {
      setFilter((prev) => ({ ...prev, [field]: value }));
    },
    [],
  );

  const handleApplyCustom = useCallback(() => {
    if (!filter.tanggalMulai || !filter.tanggalAkhir) return;
    const d1 = new Date(filter.tanggalMulai + "T00:00:00");
    const d2 = new Date(filter.tanggalAkhir + "T00:00:00");
    const diffDays = Math.ceil(
      (d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24),
    );
    const days = Math.max(1, diffDays);
    fetchAll(days);
  }, [filter.tanggalMulai, filter.tanggalAkhir, fetchAll]);

  const handleExportExcel = useCallback(async () => {
    if (!grafik || grafik.length === 0) return;

    // Safe Dynamic Import untuk ExcelJS (menghindari error .default pada Turbopack/Next.js 15+)
    const excelJsModule = await import("exceljs");
    const ExcelJS = excelJsModule.default || excelJsModule;

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Laporan Performa");

    // 1. Setup Kolom
    sheet.columns = [
      { header: "Periode", key: "periode", width: 18 },
      { header: "Pendapatan", key: "pendapatan", width: 22 },
      { header: "HPP", key: "hpp", width: 22 },
      { header: "Laba", key: "laba", width: 22 },
      { header: "Margin", key: "margin", width: 14 },
    ];

    // 2. Styling Header Row
    const headerRow = sheet.getRow(1);
    headerRow.height = 26;
    headerRow.eachCell((cell) => {
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF2A1711" }, // Coklat Gelap DapurHPP
      };
      cell.font = { color: { argb: "FFFFFFFF" }, bold: true, size: 11 };
      cell.alignment = { vertical: "middle", horizontal: "center" };
      cell.border = {
        top: { style: "thin", color: { argb: "FF2A1711" } },
        left: { style: "thin", color: { argb: "FF2A1711" } },
        bottom: { style: "thin", color: { argb: "FF2A1711" } },
        right: { style: "thin", color: { argb: "FF2A1711" } },
      };
    });

    // 3. Populate Data Rows
    let totalPendapatan = 0;
    let totalHpp = 0;
    let totalLaba = 0;

    grafik.forEach((item) => {
      totalPendapatan += item.pendapatan;
      totalHpp += item.hpp;
      totalLaba += item.laba;

      const marginDecimal = item.pendapatan > 0 ? item.laba / item.pendapatan : 0;

      const row = sheet.addRow({
        periode: item.label,
        pendapatan: item.pendapatan,
        hpp: item.hpp,
        laba: item.laba,
        margin: marginDecimal,
      });

      row.height = 20;

      // Formatting Angka
      row.getCell("pendapatan").numFmt = '"Rp"#,##0';
      row.getCell("hpp").numFmt = '"Rp"#,##0';
      row.getCell("laba").numFmt = '"Rp"#,##0';
      row.getCell("margin").numFmt = "0.00%";

      // Warna Laba: Hijau jika positif, Merah jika negatif
      const labaCell = row.getCell("laba");
      labaCell.font = {
        color: { argb: item.laba >= 0 ? "FF06D6A0" : "FFEF4444" },
        bold: true,
      };

      // Alignment
      row.getCell("periode").alignment = { horizontal: "center", vertical: "middle" };
      row.getCell("pendapatan").alignment = { horizontal: "right", vertical: "middle" };
      row.getCell("hpp").alignment = { horizontal: "right", vertical: "middle" };
      row.getCell("laba").alignment = { horizontal: "right", vertical: "middle" };
      row.getCell("margin").alignment = { horizontal: "right", vertical: "middle" };

      // Border Data Cell
      row.eachCell((cell) => {
        cell.border = {
          top: { style: "thin", color: { argb: "FFE8D5C4" } },
          left: { style: "thin", color: { argb: "FFE8D5C4" } },
          bottom: { style: "thin", color: { argb: "FFE8D5C4" } },
          right: { style: "thin", color: { argb: "FFE8D5C4" } },
        };
      });
    });

    // 4. Baris TOTAL Ringkasan
    const totalMarginDecimal = totalPendapatan > 0 ? totalLaba / totalPendapatan : 0;
    const totalRow = sheet.addRow({
      periode: "TOTAL",
      pendapatan: totalPendapatan,
      hpp: totalHpp,
      laba: totalLaba,
      margin: totalMarginDecimal,
    });

    totalRow.height = 24;
    totalRow.getCell("pendapatan").numFmt = '"Rp"#,##0';
    totalRow.getCell("hpp").numFmt = '"Rp"#,##0';
    totalRow.getCell("laba").numFmt = '"Rp"#,##0';
    totalRow.getCell("margin").numFmt = "0.00%";

    totalRow.eachCell((cell, colNumber) => {
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFF5E6D8" }, // Warna Krem Muda
      };
      cell.font = { bold: true, color: { argb: "FF2A1711" } };
      cell.alignment = {
        vertical: "middle",
        horizontal: colNumber === 1 ? "center" : "right",
      };
      cell.border = {
        top: { style: "medium", color: { argb: "FF2A1711" } },
        left: { style: "thin", color: { argb: "FFE8D5C4" } },
        bottom: { style: "medium", color: { argb: "FF2A1711" } },
        right: { style: "thin", color: { argb: "FFE8D5C4" } },
      };
    });

    // Warna khusus untuk Laba Total
    totalRow.getCell("laba").font = {
      bold: true,
      color: { argb: totalLaba >= 0 ? "FF06D6A0" : "FFEF4444" },
    };

    // 5. Write to Buffer & Trigger Download
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `laporan-performa-${filter.tanggalMulai || "all"}.xlsx`;
    a.click();
    URL.revokeObjectURL(url);
  }, [grafik, filter.tanggalMulai]);

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  const dateRangeText = formatDateRange(
    filter.tanggalMulai,
    filter.tanggalAkhir,
  );

  return (
    <div className="mx-auto max-w-[1500px]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="font-[var(--font-playfair)] font-bold text-3xl md:text-4xl text-[#2A1711] mb-2">
            {t("reports.title")}
          </h1>
          <p className="text-[#564334] text-lg">{t("reports.subtitle")}</p>
        </div>
        <div className="flex items-center gap-3">
          {dateRangeText && (
            <span className="text-xs text-[#8A7362] font-[var(--font-be-vietnam)] bg-[#FFF8F6] px-4 py-2 rounded-full border border-[#DDC1AE]">
              {dateRangeText}
            </span>
          )}
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#DDC1AE] text-[#564334] text-sm hover:bg-[#FFF8F6] transition-all bg-white"
          >
            <FileText size={16} strokeWidth={1.75} className="text-[#EF4444]" />
            {t("common.buttons.export")} PDF
          </button>
          <button
            onClick={handleExportExcel}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#DDC1AE] text-[#564334] text-sm hover:bg-[#FFF8F6] transition-all bg-white"
          >
            <FileSpreadsheet
              size={16}
              strokeWidth={1.75}
              className="text-[#06D6A0]"
            />
            {t("common.buttons.export")} Excel
          </button>
        </div>
      </div>

      {/* Filter */}
      <LaporanFilter
        filter={filter}
        onFilterChange={handleFilterChange}
        onDateChange={handleDateChange}
        onApplyCustom={handleApplyCustom}
        isCustomApplied={
          filter.period !== "custom" ||
          !filter.tanggalMulai ||
          !filter.tanggalAkhir
        }
      />

      {/* Error */}
      {error && (
        <div className="mb-6 p-4 rounded-2xl bg-[#FEE2E2] border border-[#FCA5A5] text-[#EF4444] text-sm flex items-center gap-2">
          <Download size={16} />
          {error}
        </div>
      )}

      {/* Ringkasan Cards */}
      <RingkasanCards data={ringkasan} loading={loading} />

      {/* Grafik + Distribusi HPP */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <GrafikPerforma data={grafik} loading={loading} />
        </div>
        <div>
          <DistribusiHpp
            data={distribusi}
            totalHpp={ringkasan?.totalHpp ?? 0}
            loading={loading}
          />
        </div>
      </div>

      {/* Detail + Ringkasan Operasional */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <DetailPerforma data={grafik} loading={loading} />
        </div>
        <div>
          <RingkasanOperasional counts={operasionalCounts} loading={loading} />
        </div>
      </div>
    </div>
  );
}
