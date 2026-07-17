"use client";

export default function PenjualanLoading() {
  return (
    <div className="mx-auto max-w-[1500px] space-y-8 animate-pulse">
      <div className="h-8 bg-[#FFF8F6] rounded-xl w-1/3" />
      <div className="h-20 bg-[#FFF8F6] rounded-2xl" />
      <div className="grid grid-cols-2 gap-4">
        <div className="h-24 bg-[#FFF8F6] rounded-[24px]" />
        <div className="h-24 bg-[#FFF8F6] rounded-[24px]" />
      </div>
      <div className="bg-white rounded-[24px] border border-[#DDC1AE] p-6">
        <div className="h-8 bg-[#FFF8F6] rounded-lg w-1/4 mb-4" />
        <div className="space-y-3">
          <div className="h-12 bg-[#FFF8F6] rounded-lg" />
          <div className="h-12 bg-[#FFF8F6] rounded-lg" />
          <div className="h-12 bg-[#FFF8F6] rounded-lg" />
        </div>
      </div>
    </div>
  );
}