"use client";

export default function SupplierLoading() {
  const SkeletonRow = () => (
    <div className="flex items-center gap-4 py-4 px-6 animate-pulse">
      {/* Avatar/Icon */}
      <div className="w-10 h-10 rounded-full bg-[#F5E6D8] flex-shrink-0" />

      {/* Nama + Kontak (stacked) */}
      <div className="flex-1 min-w-[200px] space-y-2">
        <div className="h-4 bg-[#F5E6D8] rounded-lg w-[70%]" />
        <div className="h-3 bg-[#F5E6D8] rounded-lg w-[50%]" />
      </div>

      {/* Alamat */}
      <div className="w-[200px] hidden md:block">
        <div className="h-4 bg-[#F5E6D8] rounded-lg w-[80%]" />
      </div>

      {/* Status Badge */}
      <div className="w-[100px] hidden sm:block">
        <div className="h-6 bg-[#F5E6D8] rounded-full w-[70%]" />
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 w-[100px] justify-end">
        <div className="w-8 h-8 rounded-lg bg-[#F5E6D8]" />
        <div className="w-8 h-8 rounded-lg bg-[#F5E6D8]" />
      </div>
    </div>
  );

  return (
    <div className="mx-auto max-w-[1500px] space-y-6">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 animate-pulse">
        <div>
          <div className="h-8 bg-[#F5E6D8] rounded-xl w-[180px] mb-2" />
          <div className="h-4 bg-[#F5E6D8] rounded-lg w-[320px]" />
        </div>
        <div className="h-12 bg-[#F5E6D8] rounded-full w-[180px] flex-shrink-0" />
      </div>

      {/* Table Card Skeleton */}
      <div className="bg-white rounded-[24px] border border-[#DDC1AE] shadow-[0_8px_30px_rgba(109,76,65,0.08)] overflow-hidden">
        {/* Search Bar */}
        <div className="p-6 border-b border-[#F5E6D8] animate-pulse">
          <div className="h-12 bg-[#FFF8F6] border-2 border-[#F5E6D8] rounded-full max-w-md w-full" />
        </div>

        {/* Table Header */}
        <div className="flex items-center gap-4 py-4 px-6 border-b border-[#E8D5C4] bg-[#FFF8F6] animate-pulse">
          <div className="w-10 h-10 rounded-full bg-[#E8D5C4] flex-shrink-0" />
          <div className="flex-1 min-w-[200px]">
            <div className="h-3 bg-[#E8D5C4] rounded-lg w-[80px]" />
          </div>
          <div className="w-[200px] hidden md:block">
            <div className="h-3 bg-[#E8D5C4] rounded-lg w-[60px]" />
          </div>
          <div className="w-[100px] hidden sm:block">
            <div className="h-3 bg-[#E8D5C4] rounded-lg w-[50px]" />
          </div>
          <div className="w-[100px] flex justify-end">
            <div className="h-3 bg-[#E8D5C4] rounded-lg w-[50px]" />
          </div>
        </div>

        {/* Table Body - 5 Rows */}
        <div className="divide-y divide-[#F5E6D8]">
          <SkeletonRow />
          <SkeletonRow />
          <SkeletonRow />
          <SkeletonRow />
          <SkeletonRow />
        </div>
      </div>

      {/* Pagination Skeleton */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 animate-pulse">
        <div className="h-4 bg-[#F5E6D8] rounded-lg w-[200px]" />
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-[#F5E6D8]" />
          <div className="h-4 bg-[#F5E6D8] rounded-lg w-[120px]" />
          <div className="w-9 h-9 rounded-full bg-[#F5E6D8]" />
        </div>
      </div>
    </div>
  );
}
