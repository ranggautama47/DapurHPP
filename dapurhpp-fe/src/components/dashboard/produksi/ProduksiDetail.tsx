"use client";

import { Printer } from "lucide-react";
import {
  Produksi,
  ProduksiDetail as ProduksiDetailType,
} from "@/types/produksi";

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
      {/* Header Actions */}
      <div className="flex flex-wrap gap-3 mb-6">
        {produksi.status === "DRAFT" && (
          <>
            {onSelesaikan && (
              <button
                onClick={onSelesaikan}
                disabled={isActionLoading}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#FF8A00] text-white font-semibold hover:bg-[#E67E00] transition-all disabled:opacity-50"
              >
                Selesaikan
              </button>
            )}
            {onBatal && (
              <button
                onClick={onBatal}
                disabled={isActionLoading}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#FCA5A5] bg-[#FEE2E2] text-[#EF4444] font-semibold hover:bg-[#FECACA] transition-all disabled:opacity-50"
              >
                Batalkan
              </button>
            )}
          </>
        )}
        <button
          onClick={handlePrint}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#DDC1AE] text-[#564334] font-semibold hover:bg-[#FFF8F6] transition-all"
        >
          <Printer className="w-4 h-4" /> Cetak
        </button>
      </div>

      {/* 3-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* LEFT PANEL — Info Resep */}
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
              label="Tanggal Produksi"
              value={new Date(produksi.tanggal).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            />
            <DetailRow
              label="Estimasi Hasil"
              value={`${produksi.estimasiHasil} pcs`}
            />
            <DetailRow
              label="Hasil Nyata"
              value={
                produksi.hasilNyata != null ? `${produksi.hasilNyata} pcs` : "-"
              }
            />
            <DetailRow
              label="HPP / pcs (snapshot)"
              value={`Rp ${Math.round(produksi.hppPerPcs).toLocaleString("id-ID")}`}
            />
            <DetailRow
              label="Total Modal (Snapshot)"
              value={`Rp ${Math.round(produksi.totalModal).toLocaleString("id-ID")}`}
              highlight
            />
            <hr className="border-t border-[#F5E6D8]" />
            <DetailRow
              label="Dibuat Pada"
              value={`${new Date(produksi.createdAt).toLocaleDateString(
                "id-ID",
                {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                },
              )}, ${new Date(produksi.createdAt).toLocaleTimeString("id-ID", {
                hour: "2-digit",
                minute: "2-digit",
              })}`}
            />
            <DetailRow
              label="Diupdate Pada"
              value={`${new Date(produksi.updatedAt).toLocaleDateString(
                "id-ID",
                {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                },
              )}, ${new Date(produksi.updatedAt).toLocaleTimeString("id-ID", {
                hour: "2-digit",
                minute: "2-digit",
              })}`}
            />
          </div>
        </div>

        {/* CENTER PANEL — Breakdown HPP */}
        <div className="lg:col-span-2 bg-white rounded-[24px] border border-[#DDC1AE] p-6 shadow-[0_8px_30px_rgba(109,76,65,0.08)]">
          <h3 className="font-[var(--font-playfair)] font-semibold text-lg text-[#2A1711] mb-4">
            Breakdown HPP (Snapshot)
          </h3>

          {details.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#F5E6D8] text-xs text-[#8A7362] uppercase tracking-[0.1em]">
                    <th className="py-2 text-left font-semibold w-8">No</th>
                    <th className="py-2 text-left font-semibold">Bahan</th>
                    <th className="py-2 text-center font-semibold">Jumlah</th>
                    <th className="py-2 text-center font-semibold">Satuan</th>
                    <th className="py-2 text-right font-semibold">
                      Harga Terakhir
                    </th>
                    <th className="py-2 text-right font-semibold">Total</th>
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
                        Rp {Math.round(d.hargaTerakhir).toLocaleString("id-ID")}
                      </td>
                      <td className="py-3 text-right font-[var(--font-roboto-mono)] font-semibold">
                        Rp {Math.round(d.total).toLocaleString("id-ID")}
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
                      Total Modal (Snapshot)
                    </td>
                    <td className="py-3 text-right font-bold text-[#FF8A00] font-[var(--font-roboto-mono)]">
                      Rp{" "}
                      {Math.round(produksi.totalModal).toLocaleString("id-ID")}
                    </td>
                  </tr>
                  <tr>
                    <td
                      colSpan={5}
                      className="py-2 text-right font-bold text-[#2A1711]"
                    >
                      HPP / pcs (snapshot)
                    </td>
                    <td className="py-2 text-right font-bold text-[#FF8A00] font-[var(--font-roboto-mono)]">
                      Rp{" "}
                      {Math.round(produksi.hppPerPcs).toLocaleString("id-ID")}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          ) : (
            <div className="text-center py-12 text-[#8A7362]">
              <p>Detail bahan tidak tersedia</p>
            </div>
          )}
        </div>

        {/* RIGHT PANEL — Ringkasan */}
        <div className="bg-white rounded-[24px] border border-[#DDC1AE] p-6 shadow-[0_8px_30px_rgba(109,76,65,0.08)]">
          <h3 className="font-[var(--font-playfair)] font-semibold text-lg text-[#2A1711] mb-4">
            Ringkasan
          </h3>

          <div className="space-y-4 text-sm">
            <SummaryItem
              label="Estimasi Hasil"
              value={`${produksi.estimasiHasil} pcs`}
            />
            <SummaryItem
              label="Hasil Nyata"
              value={
                produksi.hasilNyata != null ? `${produksi.hasilNyata} pcs` : "-"
              }
            />

            {produksi.hasilNyata != null && (
              <SummaryItem
                label="Selisih"
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
                    {produksi.hasilNyata - produksi.estimasiHasil} pcs (
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
              label="HPP / pcs (snapshot)"
              value={`Rp ${Math.round(produksi.hppPerPcs).toLocaleString("id-ID")}`}
            />
            <SummaryItem
              label="Total Modal (Snapshot)"
              value={
                <span className="text-[#FF8A00] font-bold text-base">
                  Rp {Math.round(produksi.totalModal).toLocaleString("id-ID")}
                </span>
              }
            />
          </div>

          <hr className="my-4 border-t border-[#F5E6D8]" />

          <div className="text-xs text-[#8A7362] space-y-1">
            <p className="font-semibold">ℹ️ Tentang Snapshot HPP</p>
            <p>
              HPP dan total modal di atas adalah snapshot pada saat produksi
              dibuat. Nilai ini tidak akan berubah meskipun harga bahan sudah
              berubah.
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
