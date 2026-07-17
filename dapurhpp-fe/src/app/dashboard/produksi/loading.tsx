"use client";

export default function ProduksiLoading() {
  return (
    <div className="mx-auto max-w-[1500px] space-y-6">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-pulse">
        <div>
          <div className="h-10 bg-[#F5E6D8] rounded-xl w-[200px] mb-2" />
          <div className="h-5 bg-[#F5E6D8] rounded-lg w-[360px]" />
        </div>
        <div className="h-12 bg-[#F5E6D8] rounded-full w-[180px]" />
      </div>

      {/* Date Navigation */}
      <div className="flex items-center justify-between bg-[#FFF8F6] px-4 py-3 rounded-2xl border border-[#DDC1AE] animate-pulse">
        <div className="w-9 h-9 rounded-full bg-[#F5E6D8]" />
        <div className="h-10 bg-[#F5E6D8] rounded-full w-[200px]" />
        <div className="w-9 h-9 rounded-full bg-[#F5E6D8]" />
      </div>

      {/* Stats Grid */}
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
        <div className="bg-[#FFF8F6] border-b border-[#DDC1AE]">
          <div className="flex gap-4 px-6 py-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-3 bg-[#E8D5C4] rounded-lg" style={{ width: `${60 + Math.random() * 80}px` }} />
            ))}
          </div>
        </div>
        <div className="divide-y divide-[#F5E6D8]">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center gap-4 px-6 py-4 animate-pulse">
              <div className="w-6 h-4 bg-[#F5E6D8] rounded" />
              <div className="w-20 h-4 bg-[#F5E6D8] rounded" />
              <div className="flex-1 h-4 bg-[#F5E6D8] rounded" />
              <div className="w-16 h-4 bg-[#F5E6D8] rounded" />
              <div className="w-16 h-4 bg-[#F5E6D8] rounded" />
              <div className="w-20 h-4 bg-[#F5E6D8] rounded" />
              <div className="w-20 h-4 bg-[#F5E6D8] rounded" />
              <div className="w-16 h-6 bg-[#F5E6D8] rounded-full" />
              <div className="w-8 h-8 bg-[#F5E6D8] rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
