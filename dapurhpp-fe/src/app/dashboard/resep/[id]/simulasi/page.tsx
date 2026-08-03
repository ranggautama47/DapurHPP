"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Resep } from "@/types/resep";
import { api } from "@/lib/axios";

const presetMargins = [10, 20, 30, 40];

export default function SimulasiHargaPage() {
  const router = useRouter();
  const params = useParams();
  const [resep, setResep] = useState<Resep | null>(null);
  const [loading, setLoading] = useState(true);
  const [targetMargin, setTargetMargin] = useState<number | "custom">(20);
  const [customMargin, setCustomMargin] = useState(25);

  useEffect(() => {
    api.get<Resep>(`/resep/${params.id}`)
      .then((res) => setResep(res.data))
      .catch(() => router.push("/dashboard/resep"))
      .finally(() => setLoading(false));
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-[#FFE9E4] border-t-[#FF8A00] rounded-full animate-spin" />
      </div>
    );
  }

  if (!resep) return null;

  const hppPerPcs = Number(resep.hppPerPcs) || 0;
  const margin = targetMargin === "custom" ? customMargin : targetMargin;
  const hargaJualPerPcs = hppPerPcs * (1 + margin / 100);
  const untungPerPcs = hargaJualPerPcs - hppPerPcs;
  const untungPerBatch = untungPerPcs * resep.estimasiHasil;

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <Link
        href={`/dashboard/resep/${params.id}`}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#DDC1AE] text-[#564334] font-medium font-[var(--font-be-vietnam)] hover:bg-[#FFF8F6] hover:border-[#FF8A00] hover:text-[#FF8A00] transition-all mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        Kembali
      </Link>
      <div>
        <h1 className="font-[var(--font-playfair)] font-bold text-xl text-[#2A1711]">
            Simulasi Harga Jual
          </h1>
          <p className="text-xs text-[#8A7362]">
            {resep.nama}
          </p>
        </div>

      <p className="text-sm text-[#8A7362]">
        Hitung harga jual berdasarkan target margin keuntungan yang diinginkan.
      </p>

      <div className="bg-[#FFF8F6] rounded-[16px] border border-[#F5E6D8] p-4">
        <div className="grid grid-cols-3 gap-3">
          <div>
            <p className="text-xs text-[#8A7362]">Resep</p>
            <p className="font-semibold text-sm text-[#2A1711] truncate">{resep.nama}</p>
          </div>
          <div>
            <p className="text-xs text-[#8A7362]">HPP / pcs</p>
            <p className="font-[var(--font-roboto-mono)] font-bold text-sm text-[#FF8A00]">Rp {hppPerPcs.toLocaleString("id-ID")}</p>
          </div>
          <div>
            <p className="text-xs text-[#8A7362]">Hasil / Batch</p>
            <p className="font-[var(--font-roboto-mono)] font-semibold text-sm text-[#2A1711]">{resep.estimasiHasil} pcs</p>
          </div>
        </div>
      </div>

      <div>
        <p className="text-xs font-bold uppercase tracking-[0.1em] text-[#5D4037] mb-3">Target Margin</p>
        <div className="flex flex-wrap gap-2">
          {presetMargins.map((m) => (
            <button
              key={m}
              onClick={() => setTargetMargin(m)}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
                targetMargin === m ? "bg-[#FF8A00] text-white shadow-[0_2px_8px_rgba(255,138,0,0.3)]" : "bg-white border border-[#DDC1AE] text-[#564334] hover:bg-[#FFF8F6]"
              }`}
            >
              {m}%
            </button>
          ))}
          <button
            onClick={() => setTargetMargin("custom")}
            className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
              targetMargin === "custom" ? "bg-[#FF8A00] text-white shadow-[0_2px_8px_rgba(255,138,0,0.3)]" : "bg-white border border-[#DDC1AE] text-[#564334] hover:bg-[#FFF8F6]"
            }`}
          >
            Custom
          </button>
        </div>
        {targetMargin === "custom" && (
          <div className="mt-3 flex items-center gap-2">
            <input
              type="number"
              value={customMargin}
              onChange={(e) => setCustomMargin(Number(e.target.value))}
              className="w-24 px-3 py-2 bg-white border-2 border-[#DDC1AE] rounded-full text-sm text-[#2A1711] focus:outline-none focus:border-[#FF8A00]"
              min="0" max="1000"
            />
            <span className="text-sm text-[#564334] font-semibold">%</span>
          </div>
        )}
      </div>

      <div className="bg-white rounded-[16px] border-2 border-[#06D6A0]/30 p-5">
        <p className="text-xs font-bold uppercase tracking-[0.1em] text-[#06D6A0] mb-4">Hasil Perhitungan</p>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-sm text-[#564334]">Harga Jual / pcs</span>
            <span className="font-[var(--font-roboto-mono)] font-bold text-xl text-[#2A1711]">Rp {Math.round(hargaJualPerPcs).toLocaleString("id-ID")}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-[#564334]">Untung / pcs</span>
            <span className="font-[var(--font-roboto-mono)] font-semibold text-[#06D6A0]">Rp {Math.round(untungPerPcs).toLocaleString("id-ID")}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-[#564334]">Untung / Batch</span>
            <span className="font-[var(--font-roboto-mono)] font-semibold text-[#06D6A0]">Rp {Math.round(untungPerBatch).toLocaleString("id-ID")}</span>
          </div>
          <div className="flex justify-between pt-2 border-t border-[#F5E6D8]">
            <span className="text-sm text-[#564334]">Margin</span>
            <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#D0F4DE] text-[#06D6A0]">{margin.toFixed(1)}%</span>
          </div>
        </div>
      </div>

      <div className="bg-[#FFF8F6] rounded-[16px] border border-[#F5E6D8] p-4">
        <p className="text-xs font-bold uppercase tracking-[0.1em] text-[#8A7362] mb-2">Rumus</p>
        <div className="flex items-center justify-center gap-2 text-sm font-[var(--font-roboto-mono)] flex-wrap">
          <span className="px-3 py-1.5 bg-white rounded-lg border border-[#DDC1AE]">HPP Rp {Math.round(hppPerPcs).toLocaleString("id-ID")}</span>
          <span className="text-[#8A7362]">+</span>
          <span className="px-3 py-1.5 bg-white rounded-lg border border-[#DDC1AE] text-[#06D6A0]">Untung Rp {Math.round(untungPerPcs).toLocaleString("id-ID")}</span>
          <span className="text-[#8A7362]">=</span>
          <span className="px-3 py-1.5 bg-[#2A1711] rounded-lg text-white font-bold">Rp {Math.round(hargaJualPerPcs).toLocaleString("id-ID")}</span>
        </div>
      </div>

      <p className="text-xs text-[#8A7362] text-center">
        Simulasi ini hanya perkiraan berdasarkan HPP dari harga bahan baku terakhir.
      </p>
    </div>
  );
}
