"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/axios";

interface ProductItem {
  name: string;
  sold: string;
  revenue: string;
  change: string;
}

export function TopProducts() {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await api.get<{ name: string; sold: string; revenue: string; change: string }[]>(
          "/laporan/produk-terlaris"
        );
        setProducts(res.data);
      } catch (err) {
        console.error("Gagal fetch produk terlaris:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  return (
    <div className="bg-white rounded-[24px] border border-[#E8D5C4] p-6 shadow-[0_8px_30px_rgba(109,76,65,0.08)]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-[var(--font-playfair)] font-bold text-lg text-[#2A1711]">Produk Terlaris</h3>
        <a href="#" className="text-sm text-[#FF8A00] font-medium hover:underline">Lihat Semua</a>
      </div>
      <div className="space-y-3">
        {loading ? (
          [...Array(5)].map((_, i) => (
            <div key={i} className="flex items-start gap-3 py-2 border-b border-[#F5E6D8] last:border-b-0">
              <div className="w-10 h-10 bg-[#FFE2DA] rounded-full animate-pulse" />
              <div className="flex-1 space-y-1">
                <div className="h-4 bg-[#F5E6D8] rounded w-3/4 animate-pulse" />
                <div className="h-3 bg-[#F5E6D8] rounded w-1/2 animate-pulse" />
              </div>
            </div>
          ))
        ) : products.length === 0 ? (
          <p className="text-center text-[#8A7362] py-4">Belum ada data produk</p>
        ) : (
          products.map((product, index) => (
            <div key={index} className="flex items-start gap-3 py-2 border-b border-[#F5E6D8] last:border-b-0">
              <div className="flex-shrink-0 w-10 h-10 bg-[#FFE2DA] rounded-full flex items-center justify-center">
                <span className="text-xs font-medium text-[#2A1711]">{product.name.charAt(0)}</span>
              </div>
              <div className="flex-1 space-y-0.5">
                <p className="text-sm font-medium text-[#2A1711]">{product.name}</p>
                <div className="flex items-center gap-2 text-xs text-[#6B7280]">
                  <span>{product.sold}</span>
                  <span className="mx-1">•</span>
                  <span className="font-mono text-[var(--font-roboto-mono)]">{product.revenue}</span>
                </div>
              </div>
              <div className="text-xs font-medium">
                {product.change.startsWith("-") ? (
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