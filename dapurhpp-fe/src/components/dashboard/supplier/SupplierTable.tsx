"use client";

import { Pencil, Trash2, Truck } from "lucide-react";
import { Supplier } from "@/types/supplier";
import { useTranslation } from "@/context/language-context";

interface SupplierTableProps {
  data: Supplier[];
  onEdit: (supplier: Supplier) => void;
  onDelete: (id: number) => void;
  onView: (id: number) => void;
}

export function SupplierTable({ data, onEdit, onDelete, onView }: SupplierTableProps) {
  const { t } = useTranslation("master");

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <Truck className="w-16 h-16 text-[#DDC1AE] mb-4" />
        <p className="text-[#564334] text-lg font-[var(--font-be-vietnam)] mb-4">{t("suppliers.emptyState")}</p>
        <p className="text-[#8A7362] text-sm mb-6">{t("suppliers.emptyHint")}</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-[24px] border border-[#DDC1AE] bg-white">
      <table className="w-full">
        <thead>
          <tr className="bg-[#FFF8F6] border-b border-[#DDC1AE]">
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.1em] text-[#564334] font-[var(--font-be-vietnam)]">{t("suppliers.columns.name")}</th>
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.1em] text-[#564334] font-[var(--font-be-vietnam)]">{t("suppliers.columns.phone")}</th>
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.1em] text-[#564334] font-[var(--font-be-vietnam)]">{t("suppliers.columns.address")}</th>
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.1em] text-[#564334] font-[var(--font-be-vietnam)]">{t("suppliers.columns.actions")}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#F5E6D8]">
          {data.map((supplier) => (
            <tr key={supplier.id} className="hover:bg-[#FFE9E4] transition-colors cursor-pointer" onClick={() => onView(supplier.id)}>
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#FFE9E4] flex items-center justify-center flex-shrink-0">
                    <Truck className="w-5 h-5 text-[#FF8A00]" strokeWidth={1.75} />
                  </div>
                  <span className="font-medium text-[#2A1711] font-[var(--font-be-vietnam)]">{supplier.nama}</span>
                </div>
              </td>
              <td className="px-6 py-4 text-[#564334] font-[var(--font-be-vietnam)]">
                {supplier.telepon ? (
                  <span className="font-[var(--font-roboto-mono)] text-sm">{supplier.telepon}</span>
                ) : (
                  <span className="text-[#8A7362] text-sm">—</span>
                )}
              </td>
              <td className="px-6 py-4 text-[#564334] font-[var(--font-be-vietnam)] max-w-xs truncate">
                {supplier.alamat || <span className="text-[#8A7362]">—</span>}
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => { e.stopPropagation(); onEdit(supplier); }}
                    className="p-2 rounded-full hover:bg-[#FFE9E4] text-[#FF8A00] transition-colors"
                    aria-label={t("common.edit")}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.75}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); onDelete(supplier.id); }}
                    className="p-2 rounded-full hover:bg-[#FEE2E2] text-[#EF4444] transition-colors"
                    aria-label={t("common.delete")}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.75}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}