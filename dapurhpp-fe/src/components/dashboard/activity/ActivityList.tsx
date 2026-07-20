"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/axios";
import { buildAktivitasQuery, type AktivitasQueryParams } from "@/lib/aktivitas-query";
import { ActivityCard } from "./ActivityCard";
import { Pagination } from "@/components/ui/pagination";
import type { AktivitasItem, AktivitasResponse } from "@/types/aktivitas";

interface ActivityListProps {
  params: AktivitasQueryParams;
  onPageChange: (page: number) => void;
}

export function ActivityList({ params, onPageChange }: ActivityListProps) {
  const [activities, setActivities] = useState<AktivitasItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  useEffect(() => {
    async function fetchActivities() {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get<AktivitasResponse>(
          `/aktivitas${buildAktivitasQuery(params)}`
        );
        setActivities(res.data.data);
        setPagination({
          page: res.data.page,
          limit: res.data.limit,
          total: res.data.total,
          totalPages: res.data.totalPages,
        });
      } catch (err) {
        console.error("Gagal fetch aktivitas:", err);
        setError("Gagal memuat aktivitas");
      } finally {
        setLoading(false);
      }
    }
    fetchActivities();
  }, [params]);

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-white rounded-[24px] border border-[#E8D5C4] p-5 shadow-[0_8px_30px_rgba(109,76,65,0.08)] animate-pulse">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#F5E6D8]" />
              <div className="flex-1 space-y-3">
                <div className="h-5 bg-[#F5E6D8] rounded w-3/4" />
                <div className="h-4 bg-[#F5E6D8] rounded w-1/2" />
                <div className="flex items-center gap-4">
                  <div className="h-3 bg-[#F5E6D8] rounded w-24" />
                  <div className="h-3 bg-[#F5E6D8] rounded w-24" />
                </div>
              </div>
              <div className="h-6 bg-[#F5E6D8] rounded w-24" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-[#8A7362]">{error}</p>
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 rounded-full bg-[#F5E6D8] flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-[#DDC1AE]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <p className="text-[#564334] font-medium font-[var(--font-be-vietnam)] mb-1">
          Belum ada aktivitas
        </p>
        <p className="text-[#8A7362] text-sm">
          Coba ubah filter atau cari dengan kata kunci lain
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {activities.map((activity, index) => (
        <ActivityCard key={`${activity.id}-${index}`} item={activity} />
      ))}
      {pagination.totalPages > 1 && (
        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          onPageChange={onPageChange}
          className="justify-center mt-4"
        />
      )}
    </div>
  );
}