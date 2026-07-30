"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/axios";
import Link from "next/link";
import { buildLaporanQuery, type LaporanDateParams } from "@/lib/laporan-query";
import { useTranslation } from "@/context/language-context";

const BACKEND_URL = "http://localhost:3001";

interface ProductItem {
  name: string;
  sold: string;
  revenue: string;
  change: string;
  fotoUrl?: string | null;
}

export function TopProducts({
  dateParams,
}: {
  dateParams?: LaporanDateParams;
}) {
  const { t } = useTranslation("dashboard");
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    setFetchError(false);
    try {
      const res = await api.get<ProductItem[]>(
        `/laporan/produk-terlaris${buildLaporanQuery(dateParams ?? {})}`,
      );
      setProducts(res.data);
    } catch (err) {
      console.error("Gagal fetch produk terlaris:", err);
      setFetchError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [dateParams]);

  return (
    <div className="bg-white rounded-[24px] border border-[#E8D5C4] p-6 shadow-[0_8px_30px_rgba(109,76,65,0.08)]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-[var(--font-playfair)] font-bold text-lg text-[#2A1711]">
          {t("topProducts.title")}
        </h3>
        <Link
          href="/dashboard/laporan"
          className="text-sm text-[#FF8A00] font-medium hover:underline transition-colors hover:text-[#E67E00]"
        >
          {t("topProducts.viewAll")}
        </Link>
      </div>
      <div className="space-y-3">
        {loading ? (
          [...Array(5)].map((_, i) => (
            <div
              key={i}
              className="flex items-start gap-3 py-2 border-b border-[#F5E6D8] last:border-b-0"
            >
              <div className="w-10 h-10 bg-[#FFE2DA] rounded-xl animate-pulse" />
              <div className="flex-1 space-y-1">
                <div className="h-4 bg-[#F5E6D8] rounded w-3/4 animate-pulse" />
                <div className="h-3 bg-[#F5E6D8] rounded w-1/2 animate-pulse" />
              </div>
            </div>
          ))
        ) : fetchError ? (
          <div className="flex flex-col items-center justify-center py-8 text-[#8A7362]">
            <svg className="w-10 h-10 mb-2 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm mb-3">{t("topProducts.fetchError")}</p>
            <button
              onClick={fetchProducts}
              className="px-4 py-1.5 rounded-full bg-[#FF8A00] text-white text-xs font-medium hover:bg-[#E67E00] transition-colors"
            >
              {t("topProducts.retry")}
            </button>
          </div>
        ) : products.length === 0 ? (
          <p className="text-center text-[#8A7362] py-4">
            {t("topProducts.emptyData")}
          </p>
        ) : (
          products.map((product, index) => (
            <div
              key={index}
              className="flex items-start gap-3 py-2 border-b border-[#F5E6D8] last:border-b-0"
            >
              <div className="flex-shrink-0 w-10 h-10 bg-[#FFE2DA] rounded-xl flex items-center justify-center overflow-hidden border border-[#E8D5C4]">
                {product.fotoUrl ? (
                  <img
                    src={
                      product.fotoUrl.startsWith("http")
                        ? product.fotoUrl
                        : `${BACKEND_URL}${product.fotoUrl}`
                    }
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-xs font-semibold text-[#2A1711]">
                    {product.name.charAt(0)}
                  </span>
                )}
              </div>

              <div className="flex-1 space-y-0.5">
                <p className="text-sm font-medium text-[#2A1711]">
                  {product.name}
                </p>
                <div className="flex items-center gap-2 text-xs text-[#6B7280]">
                  <span>{product.sold}</span>
                  <span className="mx-1">•</span>
                  <span className="font-mono text-[var(--font-roboto-mono)]">
                    {product.revenue}
                  </span>
                </div>
              </div>
              <div className="text-xs font-medium">
                {product.change == null ? (
                  <span className="text-[#9CA3AF]">—</span>
                ) : String(product.change).startsWith("-") ? (
                  <span className="text-[#EF4444]">{product.change}</span>
                ) : (
                  <span className="text-[#10B981]">+{product.change}</span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}