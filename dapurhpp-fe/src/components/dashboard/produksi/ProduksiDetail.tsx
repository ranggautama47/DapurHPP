"use client";

import { Printer } from "lucide-react";
import {
  Produksi,
  ProduksiDetail as ProduksiDetailType,
} from "@/types/produksi";
import { useTranslation } from "@/context/language-context";

interface ProduksiDetailProps {
  produksi: Produksi;
  onSelesaikan?: () => void;
  onBatal?: () => void;
  isActionLoading?: boolean;
}

export function ProduksiDetail({
  produksi,
  onSelesaikan,
  onBatal,
  isActionLoading,
}: ProduksiDetailProps) {
  const { t, language } = useTranslation("master");
  const localeStr = language === "id" ? "id-ID" : "en-US";
  const details = produksi.detailProduksi || [];

  const statusColor = () => {
    switch (produksi.status) {
      case "DRAFT":
        return "bg-[#FF8A00] text-white";
      case "SELESAI":
        return "bg-[#06D6A0] text-white";
      case "BATAL":
        return "bg-[#EF4444] text-white";
    }
  };

  const handlePrint = () => window.print();

  return (
    <>
      <div className="flex flex-wrap gap-3 mb-6">
        {produksi.status === "DRAFT" && (
          <>
            {onSelesaikan && (
              <button
                onClick={onSelesaikan}
                disabled={isActionLoading}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#FF8A00] text-white font-semibold hover:bg-[#E67E00] transition-all disabled:opacity-50"
              >
                {t("production.detail.completeButton")}
              </button>
            )}
            {onBatal && (
              <button
                onClick={onBatal}
                disabled={isActionLoading}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#FCA5A5] bg-[#FEE2E2] text-[#EF4444] font-semibold hover:bg-[#FECACA] transition-all disabled:opacity-50"
              >
                {t("production.detail.cancelButton")}
              </button>
            )}
          </>
        )}
        <button
          onClick={handlePrint}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#DDC1AE] text-[#564334] font-semibold hover:bg-[#FFF8F6] transition-all"
        >
          <Printer className="w-4 h-4" /> {t("production.detail.printButton")}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-[24px] border border-[#DDC1AE] p-6 shadow-[0_8px_30px_rgba(109,76,65,0.08)]">
          <div className="flex justify-center mb-4">
            {produksi.resep.fotoUrl ? (
              <img
                src={produksi.resep.fotoUrl}
                alt={produksi.resep.nama}
                className="w-28 h-28 rounded-2xl object-cover"
              />
            ) : (
              <div className="w-28 h-28 bg-[#F5E6D8] rounded-2xl flex items-center justify-center">
                <svg
                  width="56"
                  height="56"
                  viewBox="0 0 64 64"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-14 h-14 text-[#DDC1AE] opacity-60"
                >
                  <path
                    d="M32 8C28 8 25 11 25 15C25 17 26 18 28 18C30 18 31 17 31 15C31 11 28 8 32 8Z"
                    fill="currentColor"
                  />
                  <path
                    d="M24 20C20 20 17 23 17 27V56C17 58 19 60 21 60H43C45 60 47 58 47 56V27C47 23 44 20 40 20H24Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M17 27L13 31"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M47 27L51 31"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            )}
          </div>

          <h2 className="text-center font-[var(--font-playfair)] font-bold text-xl text-[#2A1711] mb-1">
            {produksi.resep.nama}
          </h2>

          <div className="flex justify-center mb-4">
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${statusColor()}`}
            >
              {produksi.status}
            </span>
          </div>

          <div className="space-y-3 text-sm">
            <DetailRow
              label={t("production.detail.productionDate")}
              value={new Date(produksi.tanggal).toLocaleDateString(localeStr, {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            />
            <DetailRow
              label={t("production.detail.estimatedYieldLabel")}
              value={`${produksi.estimasiHasil}`}
            />
            <DetailRow
              label={t("production.detail.actualYieldLabel")}
              value={
                produksi.hasilNyata != null ? `${produksi.hasilNyata}` : "-"
              }
            />
            <DetailRow
              label={t("production.detail.hppPerPcsLabel")}
              value={`Rp ${Math.round(produksi.hppPerPcs).toLocaleString(localeStr)}`}
            />
            <DetailRow
              label={t("production.detail.totalCostSnapshotLabel")}
              value={`Rp ${Math.round(produksi.totalModal).toLocaleString(localeStr)}`}
              highlight
            />
            <hr className="border-t border-[#F5E6D8]" />
            <DetailRow
              label={t("production.detail.createdAtLabel")}
              value={`${new Date(produksi.createdAt).toLocaleDateString(
                localeStr,
                {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                },
              )}, ${new Date(produksi.createdAt).toLocaleTimeString(localeStr, {
                hour: "2-digit",
                minute: "2-digit",
              })}`}
            />
            <DetailRow
              label={t("production.detail.updatedAtLabel")}
              value={`${new Date(produksi.updatedAt).toLocaleDateString(
                localeStr,
                {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                },
              )}, ${new Date(produksi.updatedAt).toLocaleTimeString(localeStr, {
                hour: "2-digit",
                minute: "2-digit",
              })}`}
            />
          </div>
        </div>

        <div className="lg:col-span-2 bg-white rounded-[24px] border border-[#DDC1AE] p-6 shadow-[0_8px_30px_rgba(109,76,65,0.08)]">
          <h3 className="font-[var(--font-playfair)] font-semibold text-lg text-[#2A1711] mb-4">
            {t("production.detail.breakdownTitle")}
          </h3>

          {details.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#F5E6D8] text-xs text-[#8A7362] uppercase tracking-[0.1em]">
                    <th className="py-2 text-left font-semibold w-8">{t("production.detail.tableNo")}</th>
                    <th className="py-2 text-left font-semibold">{t("production.detail.tableIngredient")}</th>
                    <th className="py-2 text-center font-semibold">{t("production.detail.tableQty")}</th>
                    <th className="py-2 text-center font-semibold">{t("production.detail.tableUnit")}</th>
                    <th className="py-2 text-right font-semibold">{t("production.detail.tablePrice")}</th>
                    <th className="py-2 text-right font-semibold">{t("production.detail.tableTotal")}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F5E6D8]">
                  {details.map((d: ProduksiDetailType, idx: number) => (
                    <tr key={d.bahanBakuId} className="hover:bg-[#FFF8F6]">
                      <td className="py-3 font-[var(--font-roboto-mono)] text-[#564334]">
                        {idx + 1}
                      </td>
                      <td className="py-3 font-semibold text-[#2A1711]">
                        {d.nama}
                      </td>
                      <td className="py-3 text-center font-[var(--font-roboto-mono)]">
                        {d.jumlah}
                      </td>
                      <td className="py-3 text-center text-[#564334]">
                        {d.satuan}
                      </td>
                      <td className="py-3 text-right font-[var(--font-roboto-mono)]">
                        Rp {Math.round(d.hargaTerakhir).toLocaleString(localeStr)}
                      </td>
                      <td className="py-3 text-right font-[var(--font-roboto-mono)] font-semibold">
                        Rp {Math.round(d.total).toLocaleString(localeStr)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t border-[#DDC1AE]">
                    <td
                      colSpan={5}
                      className="py-3 text-right font-bold text-[#2A1711]"
                    >
                      {t("production.detail.totalCostLabel")}
                    </td>
                    <td className="py-3 text-right font-bold text-[#FF8A00] font-[var(--font-roboto-mono)]">
                      Rp{" "}
                      {Math.round(produksi.totalModal).toLocaleString(localeStr)}
                    </td>
                  </tr>
                  <tr>
                    <td
                      colSpan={5}
                      className="py-2 text-right font-bold text-[#2A1711]"
                    >
                      {t("production.detail.hppPerPcsLabel")}
                    </td>
                    <td className="py-2 text-right font-bold text-[#FF8A00] font-[var(--font-roboto-mono)]">
                      Rp{" "}
                      {Math.round(produksi.hppPerPcs).toLocaleString(localeStr)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          ) : (
            <div className="text-center py-12 text-[#8A7362]">
              <p>{t("production.detail.noBreakdownData")}</p>
            </div>
          )}
        </div>

        <div className="bg-white rounded-[24px] border border-[#DDC1AE] p-6 shadow-[0_8px_30px_rgba(109,76,65,0.08)]">
          <h3 className="font-[var(--font-playfair)] font-semibold text-lg text-[#2A1711] mb-4">
            {t("production.detail.summaryTitle")}
          </h3>

          <div className="space-y-4 text-sm">
            <SummaryItem
              label={t("production.detail.estimatedYieldSummary")}
              value={`${produksi.estimasiHasil}`}
            />
            <SummaryItem
              label={t("production.detail.actualYieldSummary")}
              value={
                produksi.hasilNyata != null ? `${produksi.hasilNyata}` : "-"
              }
            />

            {produksi.hasilNyata != null && (
              <SummaryItem
                label={t("production.detail.differenceLabel")}
                value={
                  <span
                    className={
                      produksi.hasilNyata >= produksi.estimasiHasil
                        ? "text-[#06D6A0]"
                        : "text-[#EF4444]"
                    }
                  >
                    {produksi.hasilNyata - produksi.estimasiHasil >= 0
                      ? "+"
                      : ""}
                    {produksi.hasilNyata - produksi.estimasiHasil} (
                    {Math.round(
                      Math.abs(
                        ((produksi.hasilNyata - produksi.estimasiHasil) /
                          produksi.estimasiHasil) *
                          100,
                      ),
                    )}
                    %)
                  </span>
                }
              />
            )}

            <hr className="border-t border-[#F5E6D8]" />

            <SummaryItem
              label={t("production.detail.hppPerPcsSummary")}
              value={`Rp ${Math.round(produksi.hppPerPcs).toLocaleString(localeStr)}`}
            />
            <SummaryItem
              label={t("production.detail.totalCostSummary")}
              value={
                <span className="text-[#FF8A00] font-bold text-base">
                  Rp {Math.round(produksi.totalModal).toLocaleString(localeStr)}
                </span>
              }
            />
          </div>

          <hr className="my-4 border-t border-[#F5E6D8]" />

          <div className="text-xs text-[#8A7362] space-y-1">
            <p className="font-semibold">{t("production.detail.snapshotInfoTitle")}</p>
            <p>
              {t("production.detail.snapshotInfoDesc")}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

function DetailRow({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex justify-between items-start">
      <span className="text-[#564334] text-xs">{label}</span>
      <span
        className={`text-right font-medium ${
          highlight ? "text-[#FF8A00]" : "text-[#2A1711]"
        }`}
      >
        {value}
      </span>
    </div>
  );
}

function SummaryItem({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[#564334]">{label}</span>
      <div className="font-medium">{value}</div>
    </div>
  );
}
