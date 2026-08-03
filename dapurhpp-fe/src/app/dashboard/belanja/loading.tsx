// app/dashboard/belanja/loading.tsx
"use client";

export default function BelanjaLoading() {
  const SkeletonRow = () => (
    <div className="flex items-center gap-4 py-4 px-6 animate-pulse">
      {/* NO */}
      <div className="w-8 h-4 bg-[#F5E6D8] rounded-lg flex-shrink-0" />
      
      {/* BAHAN */}
      <div className="flex-1 min-w-[120px]">
        <div className="h-4 bg-[#F5E6D8] rounded-lg w-[80%]" />
      </div>
      
      {/* SUPPLIER */}
      <div className="w-[120px]">
        <div className="h-4 bg-[#F5E6D8] rounded-lg w-[70%]" />
      </div>
      
      {/* SATUAN */}
      <div className="w-[80px]">
        <div className="h-4 bg-[#F5E6D8] rounded-lg w-[60%]" />
      </div>
      
      {/* JUMLAH */}
      <div className="w-[80px]">
        <div className="h-4 bg-[#F5E6D8] rounded-lg w-[50%]" />
      </div>
      
      {/* HARGA SATUAN */}
      <div className="w-[120px]">
        <div className="h-4 bg-[#F5E6D8] rounded-lg w-[65%]" />
      </div>
      
      {/* TOTAL */}
      <div className="w-[120px]">
        <div className="h-4 bg-[#F5E6D8] rounded-lg w-[70%]" />
      </div>
      
      {/* AKSI */}
      <div className="flex items-center gap-2 w-[60px] justify-end">
        <div className="w-7 h-7 rounded-lg bg-[#F5E6D8]" />
      </div>
    </div>
  );

  return (
    <div className="mx-auto max-w-[1500px] space-y-6">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-pulse">
        <div>
          <div className="h-10 bg-[#F5E6D8] rounded-xl w-[200px] mb-2" />
          <div className="h-5 bg-[#F5E6D8] rounded-lg w-[360px]" />
        </div>
        <div className="flex items-center gap-3">
          <div className="h-12 bg-[#F5E6D8] rounded-full w-[130px]" />
          <div className="h-12 bg-[#F5E6D8] rounded-full w-[160px]" />
        </div>
      </div>

      {/* Date Navigation Skeleton */}
      <div className="flex items-center justify-between bg-[#FFF8F6] px-4 py-3 rounded-2xl border border-[#DDC1AE] animate-pulse">
        <div className="w-9 h-9 rounded-full bg-[#F5E6D8]" />
        <div className="h-10 bg-[#F5E6D8] rounded-full w-[200px]" />
        <div className="w-9 h-9 rounded-full bg-[#F5E6D8]" />
      </div>

      {/* Stats Grid Skeleton */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-[24px] border border-[#DDC1AE] p-5 shadow-[0_8px_30px_rgba(109,76,65,0.08)] animate-pulse"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-xl bg-[#F5E6D8]" />
              <div className="h-3 bg-[#F5E6D8] rounded-lg w-[80px]" />
            </div>
            <div className="h-8 bg-[#F5E6D8] rounded-lg w-[60%]" />
          </div>
        ))}
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-[24px] border border-[#DDC1AE] shadow-[0_8px_30px_rgba(109,76,65,0.08)] overflow-hidden">
        {/* Table Header */}
        <div className="flex items-center gap-4 py-4 px-6 border-b border-[#E8D5C4] bg-[#FFF8F6]">
          <div className="w-8 h-3 bg-[#E8D5C4] rounded-lg flex-shrink-0" />
          <div className="flex-1 min-w-[120px]">
            <div className="h-3 bg-[#E8D5C4] rounded-lg w-[60px]" />
          </div>
          <div className="w-[120px]">
            <div className="h-3 bg-[#E8D5C4] rounded-lg w-[60px]" />
          </div>
          <div className="w-[80px]">
            <div className="h-3 bg-[#E8D5C4] rounded-lg w-[50px]" />
          </div>
          <div className="w-[80px]">
            <div className="h-3 bg-[#E8D5C4] rounded-lg w-[50px]" />
          </div>
          <div className="w-[120px]">
            <div className="h-3 bg-[#E8D5C4] rounded-lg w-[80px]" />
          </div>
          <div className="w-[120px]">
            <div className="h-3 bg-[#E8D5C4] rounded-lg w-[50px]" />
          </div>
          <div className="w-[60px] flex justify-end">
            <div className="h-3 bg-[#E8D5C4] rounded-lg w-[40px]" />
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
    </div>
  );
}