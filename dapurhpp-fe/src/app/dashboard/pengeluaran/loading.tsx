"use client";

export default function PengeluaranLoading() {
  const SkeletonRow = () => (
    <div className="flex items-center gap-4 py-4 px-6 animate-pulse">
      <div className="w-8 h-4 bg-[#F5E6D8] rounded-lg flex-shrink-0" />
      <div className="flex-1 min-w-[120px]">
        <div className="h-4 bg-[#F5E6D8] rounded-lg w-[80%]" />
      </div>
      <div className="w-[100px]">
        <div className="h-4 bg-[#F5E6D8] rounded-lg w-[70%]" />
      </div>
      <div className="w-[120px]">
        <div className="h-4 bg-[#F5E6D8] rounded-lg w-[65%]" />
      </div>
      <div className="w-[100px]">
        <div className="h-4 bg-[#F5E6D8] rounded-lg w-[60%]" />
      </div>
      <div className="flex items-center gap-2 w-[80px] justify-end">
        <div className="w-7 h-7 rounded-lg bg-[#F5E6D8]" />
        <div className="w-7 h-7 rounded-lg bg-[#F5E6D8]" />
      </div>
    </div>
  );

  return (
    <div className="mx-auto max-w-[1500px] space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-pulse">
        <div>
          <div className="h-10 bg-[#F5E6D8] rounded-xl w-[250px] mb-2" />
          <div className="h-5 bg-[#F5E6D8] rounded-lg w-[380px]" />
        </div>
        <div className="flex items-center gap-3">
          <div className="h-12 bg-[#F5E6D8] rounded-full w-[130px]" />
          <div className="h-12 bg-[#F5E6D8] rounded-full w-[160px]" />
        </div>
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
              <div className="h-3 bg-[#F5E6D8] rounded-lg w-[100px]" />
            </div>
            <div className="h-8 bg-[#F5E6D8] rounded-lg w-[60%]" />
          </div>
        ))}
      </div>

      {/* Filter Bar */}
      <div className="flex items-center gap-3 animate-pulse">
        <div className="h-10 bg-[#F5E6D8] rounded-full w-[180px]" />
        <div className="h-10 bg-[#F5E6D8] rounded-full w-[140px]" />
        <div className="h-10 bg-[#F5E6D8] rounded-full w-[120px]" />
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-[24px] border border-[#DDC1AE] shadow-[0_8px_30px_rgba(109,76,65,0.08)] overflow-hidden">
        {/* Table Header */}
        <div className="flex items-center gap-4 py-4 px-6 border-b border-[#E8D5C4] bg-[#FFF8F6]">
          <div className="w-8 h-3 bg-[#E8D5C4] rounded-lg flex-shrink-0" />
          <div className="flex-1 min-w-[120px]">
            <div className="h-3 bg-[#E8D5C4] rounded-lg w-[60px]" />
          </div>
          <div className="w-[100px]">
            <div className="h-3 bg-[#E8D5C4] rounded-lg w-[50px]" />
          </div>
          <div className="w-[120px]">
            <div className="h-3 bg-[#E8D5C4] rounded-lg w-[80px]" />
          </div>
          <div className="w-[100px]">
            <div className="h-3 bg-[#E8D5C4] rounded-lg w-[50px]" />
          </div>
          <div className="w-[80px] flex justify-end">
            <div className="h-3 bg-[#E8D5C4] rounded-lg w-[40px]" />
          </div>
        </div>

        {/* Table Body */}
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
