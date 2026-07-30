"use client";

import { useState } from "react";
import { X, TrendingUp, Info } from "lucide-react";
import { Resep } from "@/types/resep";
import { useTranslation } from "@/context/language-context";

interface SimulasiHargaProps {
  isOpen: boolean;
  onClose: () => void;
  resep: Resep;
}

const presetMargins = [10, 20, 30, 40];

export function SimulasiHarga({ isOpen, onClose, resep }: SimulasiHargaProps) {
  const { t, language } = useTranslation("master");
  const [targetMargin, setTargetMargin] = useState<number | "custom">(20);
  const [customMargin, setCustomMargin] = useState(25);

  const hppPerPcs = Number(resep.hppPerPcs) || 0;
  const margin = targetMargin === "custom" ? customMargin : targetMargin;
  const hargaJualPerPcs = hppPerPcs * (1 + margin / 100);
  const untungPerPcs = hargaJualPerPcs - hppPerPcs;
  const untungPerBatch = untungPerPcs * resep.estimasiHasil;

  const locale = language === "id" ? "id-ID" : "en-US";

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2A1711]/60 backdrop-blur-sm">
      <div className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-[0_24px_64px_-12px_rgba(42,23,17,0.4)] overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-500">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#06D6A0] via-[#FF8A00] to-[#06D6A0] z-10" />

        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="p-1 rounded-full hover:bg-[#FFF8F6] text-[#564334] transition-colors"
                aria-label={t("recipes.simulation.closeAria")}
              >
                <X className="w-5 h-5" strokeWidth={1.75} />
              </button>
              <h2 className="font-[var(--font-playfair)] font-bold text-xl text-[#2A1711]">
                {t("recipes.simulation.title")}
              </h2>
            </div>
          </div>

          <p className="text-sm text-[#8A7362] mb-5">
            {t("recipes.simulation.description")}
          </p>

          {/* Info Resep */}
          <div className="bg-[#FFF8F6] rounded-[16px] border border-[#F5E6D8] p-4 mb-5">
            <div className="grid grid-cols-3 gap-3">
              <div>
                <p className="text-xs text-[#8A7362] font-[var(--font-be-vietnam)] mb-0.5">{t("recipes.simulation.recipeInfo")}</p>
                <p className="font-semibold text-sm text-[#2A1711] truncate">{resep.nama}</p>
              </div>
              <div>
                <p className="text-xs text-[#8A7362] font-[var(--font-be-vietnam)] mb-0.5">{t("recipes.simulation.hppPerPcs")}</p>
                <p className="font-[var(--font-roboto-mono)] font-bold text-sm text-[#FF8A00]">
                  Rp {hppPerPcs.toLocaleString(locale)}
                </p>
              </div>
              <div>
                <p className="text-xs text-[#8A7362] font-[var(--font-be-vietnam)] mb-0.5">{t("recipes.simulation.yieldPerBatch")}</p>
                <p className="font-[var(--font-roboto-mono)] font-semibold text-sm text-[#2A1711]">
                  {resep.estimasiHasil} pcs
                </p>
              </div>
            </div>
          </div>

          {/* Target Margin */}
          <div className="mb-5">
            <p className="text-xs font-bold uppercase tracking-[0.1em] text-[#5D4037] mb-3 ml-1">
              {t("recipes.simulation.targetMargin")}
            </p>
            <div className="flex flex-wrap gap-2">
              {presetMargins.map((m) => (
                <button
                  key={m}
                  onClick={() => setTargetMargin(m)}
                  className={`px-5 py-2.5 rounded-full text-sm font-semibold font-[var(--font-be-vietnam)] transition-all ${
                    targetMargin === m
                      ? "bg-[#FF8A00] text-white shadow-[0_2px_8px_rgba(255,138,0,0.3)]"
                      : "bg-white border border-[#DDC1AE] text-[#564334] hover:bg-[#FFF8F6]"
                  }`}
                >
                  {m}%
                </button>
              ))}
              <button
                onClick={() => setTargetMargin("custom")}
                className={`px-5 py-2.5 rounded-full text-sm font-semibold font-[var(--font-be-vietnam)] transition-all ${
                  targetMargin === "custom"
                    ? "bg-[#FF8A00] text-white shadow-[0_2px_8px_rgba(255,138,0,0.3)]"
                    : "bg-white border border-[#DDC1AE] text-[#564334] hover:bg-[#FFF8F6]"
                }`}
              >
                {t("recipes.simulation.customMargin")}
              </button>
            </div>
            {targetMargin === "custom" && (
              <div className="mt-3 flex items-center gap-2">
                <input
                  type="number"
                  value={customMargin}
                  onChange={(e) => setCustomMargin(Number(e.target.value))}
                  className="w-24 px-3 py-2 bg-white border-2 border-[#DDC1AE] rounded-full text-sm text-[#2A1711] focus:outline-none focus:border-[#FF8A00]"
                  min="0"
                  max="1000"
                  placeholder={t("recipes.simulation.customPlaceholder")}
                />
                <span className="text-sm text-[#564334] font-semibold">%</span>
              </div>
            )}
          </div>

          {/* Hasil Perhitungan */}
          <div className="bg-white rounded-[16px] border-2 border-[#06D6A0]/30 shadow-[0_4px_16px_rgba(6,214,160,0.1)] p-5 mb-5">
            <p className="text-xs font-bold uppercase tracking-[0.1em] text-[#06D6A0] mb-4">
              {t("recipes.simulation.resultsTitle")}
            </p>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#564334] font-[var(--font-be-vietnam)]">
                  {t("recipes.simulation.sellingPricePerPcs")}
                </span>
                <span className="font-[var(--font-roboto-mono)] font-bold text-xl text-[#2A1711]">
                  Rp {Math.round(hargaJualPerPcs).toLocaleString(locale)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#564334] font-[var(--font-be-vietnam)]">
                  {t("recipes.simulation.profitPerPcs")}
                </span>
                <span className="font-[var(--font-roboto-mono)] font-semibold text-[#06D6A0]">
                  Rp {Math.round(untungPerPcs).toLocaleString(locale)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#564334] font-[var(--font-be-vietnam)]">
                  {t("recipes.simulation.profitPerBatch")}
                </span>
                <span className="font-[var(--font-roboto-mono)] font-semibold text-[#06D6A0]">
                  Rp {Math.round(untungPerBatch).toLocaleString(locale)}
                </span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-[#F5E6D8]">
                <span className="text-sm text-[#564334] font-[var(--font-be-vietnam)]">
                  {t("recipes.simulation.marginLabel")}
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#D0F4DE] text-[#06D6A0]">
                  {margin.toFixed(1)}%
                </span>
              </div>
            </div>
          </div>

          {/* Rumus */}
          <div className="bg-[#FFF8F6] rounded-[16px] border border-[#F5E6D8] p-4 mb-5">
            <p className="text-xs font-bold uppercase tracking-[0.1em] text-[#8A7362] mb-2">
              {t("recipes.simulation.formulaTitle")}
            </p>
            <div className="flex items-center justify-center gap-2 text-sm font-[var(--font-roboto-mono)]">
              <span className="px-3 py-1.5 bg-white rounded-lg border border-[#DDC1AE] text-[#564334]">
                {t("recipes.simulation.formulaHpp")} Rp {Math.round(hppPerPcs).toLocaleString(locale)}
              </span>
              <span className="text-[#8A7362]">{t("recipes.simulation.formulaPlus")}</span>
              <span className="px-3 py-1.5 bg-white rounded-lg border border-[#DDC1AE] text-[#06D6A0]">
                {t("recipes.simulation.formulaProfit")} Rp {Math.round(untungPerPcs).toLocaleString(locale)}
              </span>
              <span className="text-[#8A7362]">{t("recipes.simulation.formulaEquals")}</span>
              <span className="px-3 py-1.5 bg-[#2A1711] rounded-lg text-white font-bold">
                Rp {Math.round(hargaJualPerPcs).toLocaleString(locale)}
              </span>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="flex items-start gap-2 text-xs text-[#8A7362]">
            <Info className="w-4 h-4 flex-shrink-0 mt-0.5" strokeWidth={1.75} />
            <p className="font-[var(--font-be-vietnam)]">
              {t("recipes.simulation.disclaimer")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
