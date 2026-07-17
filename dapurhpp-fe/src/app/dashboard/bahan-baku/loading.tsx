"use client";

export default function BahanBakuLoading() {
  const SkeletonRow = () => (
    <div className="flex items-center gap-4 py-4 px-6 animate-pulse">
      {/* Checkbox */}
      <div className="w-5 h-5 rounded-md bg-[#F5E6D8] flex-shrink-0" />
      
      {/* Nama Bahan */}
      <div className="flex-1 min-w-[140px]">
        <div className="h-4 bg-[#F5E6D8] rounded-lg w-[75%]" />
      </div>
      
      {/* Satuan */}
      <div className="w-[100px]">
        <div className="h-4 bg-[#F5E6D8] rounded-lg w-[60%]" />
      </div>
      
      {/* Stok */}
      <div className="w-[100px]">
        <div className="h-4 bg-[#F5E6D8] rounded-lg w-[50%]" />
      </div>
      
      {/* Harga */}
      <div className="w-[140px]">
        <div className="h-4 bg-[#F5E6D8] rounded-lg w-[70%]" />
      </div>
      
      {/* Aksi */}
      <div className="flex items-center gap-2 w-[100px] justify-end">
        <div className="w-8 h-8 rounded-lg bg-[#F5E6D8]" />
        <div className="w-8 h-8 rounded-lg bg-[#F5E6D8]" />
      </div>
    </div>
  );

  return (
    <div className="mx-auto max-w-[1500px] space-y-6">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-pulse">
        <div>
          <div className="h-10 bg-[#F5E6D8] rounded-xl w-[280px] mb-2" />
          <div className="h-5 bg-[#F5E6D8] rounded-lg w-[380px]" />
        </div>
        <div className="h-12 bg-[#F5E6D8] rounded-full w-[160px] flex-shrink-0" />
      </div>

      {/* Search Bar Skeleton */}
      <div className="animate-pulse">
        <div className="h-12 bg-[#F5E6D8] rounded-full max-w-md" />
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-[24px] border border-[#DDC1AE] shadow-[0_8px_30px_rgba(109,76,65,0.08)] overflow-hidden">
        {/* Table Header */}
        <div className="flex items-center gap-4 py-4 px-6 border-b border-[#E8D5C4] bg-[#FFF8F6]">
          <div className="w-5 h-5 rounded-md bg-[#E8D5C4] flex-shrink-0" />
          <div className="flex-1 min-w-[140px]">
            <div className="h-3 bg-[#E8D5C4] rounded-lg w-[80px]" />
          </div>
          <div className="w-[100px]">
            <div className="h-3 bg-[#E8D5C4] rounded-lg w-[50px]" />
          </div>
          <div className="w-[100px]">
            <div className="h-3 bg-[#E8D5C4] rounded-lg w-[40px]" />
          </div>
          <div className="w-[140px]">
            <div className="h-3 bg-[#E8D5C4] rounded-lg w-[60px]" />
          </div>
          <div className="w-[100px] flex justify-end">
            <div className="h-3 bg-[#E8D5C4] rounded-lg w-[50px]" />
          </div>
        </div>

        {/* Table Body - 5 Skeleton Rows */}
        <div className="divide-y divide-[#F5E6D8]">
          <SkeletonRow />
          <SkeletonRow />
          <SkeletonRow />
          <SkeletonRow />
          <SkeletonRow />
        </div>
      </div>

      {/* Pagination Skeleton */}
      <div className="flex items-center justify-between animate-pulse">
        <div className="h-4 bg-[#F5E6D8] rounded-lg w-[140px]" />
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-[#F5E6D8]" />
          <div className="w-9 h-9 rounded-full bg-[#FF8A00]" />
          <div className="w-9 h-9 rounded-full bg-[#F5E6D8]" />
          <div className="w-9 h-9 rounded-full bg-[#F5E6D8]" />
          <div className="w-9 h-9 rounded-full bg-[#F5E6D8]" />
        </div>
      </div>
    </div>
  );
}