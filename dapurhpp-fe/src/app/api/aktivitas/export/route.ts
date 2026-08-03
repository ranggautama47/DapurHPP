import { NextResponse } from "next/server";
import { buildAktivitasQuery, type AktivitasQueryParams } from "@/lib/aktivitas-query";

const TYPE_COLOR_MAP: Record<string, { color: string; bg: string; isPositive: boolean }> = {
  penjualan: { color: "#06D6A0", bg: "#D0F4DE", isPositive: true },
  pembayaran: { color: "#06D6A0", bg: "#D0F4DE", isPositive: true },
  belanja: { color: "#FF8A00", bg: "#FFE9E4", isPositive: false },
  pengeluaran: { color: "#EF4444", bg: "#FEE2E2", isPositive: false },
  produksi: { color: "#606C38", bg: "#EAF2D7", isPositive: false },
};

export async function GET(request: Request) {
  const url = new URL(request.url);
  const searchParams = url.searchParams;
  const search = searchParams.get("search") || "";
  const startDate = searchParams.get("startDate") || "";
  const endDate = searchParams.get("endDate") || "";
  const type = (searchParams.get("type") || "") as AktivitasQueryParams["type"];
  const token =
    searchParams.get("token") ||
    request.headers.get("authorization")?.replace("Bearer ", "") ||
    undefined;

  const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

  let allActivities: any[] = [];
  let currentPage = 1;
  const pageLimit = 100;
  const maxPages = 20;
  let totalPages = 1;

  try {
    do {
      const params: AktivitasQueryParams = {
        page: currentPage,
        limit: pageLimit,
        search: search || undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        type: type && type !== "all" ? type : undefined,
      };

      const queryString = buildAktivitasQuery(params);

      const res = await fetch(backendUrl + "/aktivitas" + queryString, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: "Bearer " + token } : {}),
        },
        cache: "no-store",
      });

      if (!res.ok) {
        console.error(
          "[EXPORT DEBUG] Fetch failed at page",
          currentPage,
          "with status",
          res.status
        );
        break;
      }

      const textData = await res.text();

      let responseData: any = {};
      try {
        responseData = JSON.parse(textData);
      } catch (e) {}

      if (responseData && Array.isArray(responseData.data)) {
        allActivities = allActivities.concat(responseData.data);
      }

      totalPages =
        responseData.totalPages ||
        Math.ceil((responseData.total || 0) / pageLimit);

      if (totalPages < 1) totalPages = 1;
      currentPage++;
    } while (currentPage <= totalPages && currentPage <= maxPages);
  } catch (error) {
    console.error("Failed to fetch export data from backend:", error);
  }

  const activities = allActivities;

  const tableRowsHtml = activities.length === 0
    ? '<tr><td colspan="5" style="text-align:center; padding: 20px; color: #8A7362;">Tidak ada data aktivitas yang ditemukan.</td></tr>'
    : activities.map((item: any, idx: number) => {
        const dateObj = item.time ? new Date(item.time) : null;
        const tanggal = dateObj && !isNaN(dateObj.getTime())
          ? dateObj.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" }) +
            ", " +
            dateObj.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) + " WIB"
          : (item.tanggal || item.time || "-");

        const tipeKey = (item.tipe || item.type || "").toLowerCase();
        const styleConfig = TYPE_COLOR_MAP[tipeKey] || { color: "#8A7362", bg: "#F5E6D8", isPositive: false };
        const nominalVal = item.nominal ?? item.amount;
        const prefix = nominalVal !== undefined && nominalVal !== null && nominalVal !== 0
          ? (styleConfig.isPositive ? "+" : "-")
          : "";
        const nominalFormatted = typeof nominalVal === "number"
          ? new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(Math.abs(nominalVal))
          : (nominalVal || "-");

        return `
          <tr>
            <td style="text-align: center;">${idx + 1}</td>
            <td style="white-space: nowrap;">${tanggal}</td>
            <td>
              <span style="display: inline-block; padding: 3px 10px; border-radius: 12px; font-size: 11px; font-weight: 700; text-transform: capitalize; background-color: ${styleConfig.bg}; color: ${styleConfig.color};">
                ${tipeKey}
              </span>
            </td>
            <td>${item.deskripsi || item.description || item.title || "-"}</td>
            <td style="text-align: right; font-weight: 700; color: ${styleConfig.color};">
              ${nominalVal ? `${prefix}${nominalFormatted}` : "-"}
            </td>
          </tr>
        `;
      }).join("");

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="id">
    <head>
      <meta charset="UTF-8" />
      <title>Laporan-Aktivitas-DapurHPP-${startDate || "semua"}-sd-${endDate || "semua"}</title>
      <style>
        @page { size: A4 portrait; margin: 12mm; }
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #2A1711; margin: 0; padding: 10px; background: #fff; }
        .header { text-align: center; border-bottom: 2px solid #FF8A00; padding-bottom: 10px; margin-bottom: 16px; }
        .header h1 { color: #FF8A00; margin: 0; font-size: 22px; font-weight: bold; }
        .header p { color: #8A7362; margin: 4px 0 0 0; font-size: 13px; }
        .meta-box { font-size: 12px; color: #564334; background: #FFF8F6; border: 1px solid #E8D5C4; padding: 10px 14px; border-radius: 8px; margin-bottom: 16px; }
        table { width: 100%; border-collapse: collapse; margin-top: 8px; }
        th { background-color: #2A1711; color: #ffffff; text-align: left; padding: 10px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; }
        td { padding: 9px 10px; border-bottom: 1px solid #E8D5C4; font-size: 12px; }
        tr:nth-child(even) { background-color: #FAF5F0; }
        .footer { margin-top: 24px; text-align: right; font-size: 11px; color: #8A7362; }
        @media print {
          body { padding: 0; }
          tr { page-break-inside: avoid; }
          thead { display: table-header-group; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>DapurHPP</h1>
        <p>Laporan Riwayat Aktivitas Usaha</p>
      </div>

      <div class="meta-box">
        <strong>Periode:</strong> ${startDate || "Semua"} s/d ${endDate || "Semua"} | 
        <strong>Kategori:</strong> ${type && type !== "all" ? type : "Semua"} | 
        <strong>Pencarian:</strong> ${search || "-"}
      </div>

      <table>
        <thead>
          <tr>
            <th style="width: 40px; text-align: center;">No</th>
            <th style="width: 170px;">Tanggal</th>
            <th style="width: 110px;">Tipe</th>
            <th>Deskripsi</th>
            <th style="width: 140px; text-align: right;">Nominal</th>
          </tr>
        </thead>
        <tbody>
          ${tableRowsHtml}
        </tbody>
      </table>

      <div class="footer">
        Dicetak otomatis dari DapurHPP pada: ${new Date().toLocaleString("id-ID")}
      </div>

      <script>
        window.onload = function() {
          setTimeout(function() {
            window.print();
          }, 300);
        };
      </script>
    </body>
    </html>
  `;

  return new NextResponse(htmlContent, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
    },
  });
}