"use client";

export default function ResepLoading() {
  const SkeletonCard = () => (
    <div className="bg-white rounded-[24px] border border-[#DDC1AE] overflow-hidden animate-pulse">
      {/* Gambar */}
      <div className="aspect-[4/3] bg-[#F5E6D8]" />
      
      {/* Content */}
      <div className="p-5 space-y-3">
        {/* Judul */}
        <div className="h-5 bg-[#F5E6D8] rounded-lg w-[80%]" />
        {/* Deskripsi */}
        <div className="h-3 bg-[#F5E6D8] rounded-lg w-[60%]" />
        {/* HPP */}
        <div className="h-4 bg-[#F5E6D8] rounded-lg w-[40%]" />
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-pulse">
        <div>
          <div className="h-8 bg-[#F5E6D8] rounded-xl w-[160px] mb-2" />
          <div className="h-4 bg-[#F5E6D8] rounded-lg w-[280px]" />
        </div>
        <div className="h-10 bg-[#F5E6D8] rounded-full w-[160px] flex-shrink-0" />
      </div>

      {/* Search Skeleton */}
      <div className="relative max-w-md animate-pulse">
        <div className="h-12 bg-white border-2 border-[#F5E6D8] rounded-full w-full" />
      </div>

      {/* Card Grid Skeleton - 6 cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>

      {/* Pagination Skeleton */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#F5E6D8] animate-pulse">
        <div className="h-4 bg-[#F5E6D8] rounded-lg w-[180px]" />
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-[#F5E6D8]" />
          <div className="h-4 bg-[#F5E6D8] rounded-lg w-[120px]" />
          <div className="w-9 h-9 rounded-full bg-[#F5E6D8]" />
        </div>
      </div>
    </div>
  );
}