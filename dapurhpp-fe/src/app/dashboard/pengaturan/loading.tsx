"use client";

export default function PengaturanLoading() {
  return (
    <div className="mx-auto max-w-[1500px] animate-pulse">
      <div className="h-4 w-40 bg-[#E8D5C4] rounded mb-2" />
      <div className="h-10 w-48 bg-[#E8D5C4] rounded mb-8" />

      <div className="bg-white rounded-[24px] border border-[#DDC1AE] p-6 mb-6 shadow-[0_8px_30px_rgba(109,76,65,0.08)]">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-20 h-20 rounded-full bg-[#E8D5C4]" />
          <div className="space-y-2">
            <div className="h-5 w-32 bg-[#E8D5C4] rounded" />
            <div className="h-4 w-48 bg-[#E8D5C4] rounded" />
          </div>
        </div>
        <div className="space-y-4 max-w-2xl">
          <div className="h-12 bg-[#E8D5C4] rounded-[16px]" />
          <div className="h-12 bg-[#E8D5C4] rounded-[16px]" />
          <div className="h-12 bg-[#E8D5C4] rounded-[16px]" />
          <div className="h-12 w-48 bg-[#E8D5C4] rounded-full" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-[24px] border border-[#DDC1AE] p-6 shadow-[0_8px_30px_rgba(109,76,65,0.08)]">
          <div className="h-6 w-24 bg-[#E8D5C4] rounded mb-6" />
          <div className="space-y-4">
            <div className="h-12 bg-[#E8D5C4] rounded-[16px]" />
            <div className="h-[1px] bg-[#EFE3D7]" />
            <div className="h-12 bg-[#E8D5C4] rounded-[16px]" />
            <div className="h-12 bg-[#E8D5C4] rounded-[16px]" />
            <div className="h-12 bg-[#E8D5C4] rounded-[16px]" />
            <div className="h-12 bg-[#E8D5C4] rounded-full" />
          </div>
        </div>
        <div className="bg-white rounded-[24px] border border-[#DDC1AE] p-6 shadow-[0_8px_30px_rgba(109,76,65,0.08)]">
          <div className="h-6 w-24 bg-[#E8D5C4] rounded mb-6" />
          <div className="space-y-6">
            <div className="h-10 bg-[#E8D5C4] rounded-full w-64" />
            <div className="space-y-2">
              <div className="h-5 w-24 bg-[#E8D5C4] rounded" />
              <div className="h-10 bg-[#E8D5C4] rounded-full" />
            </div>
            <div className="space-y-2">
              <div className="h-5 w-16 bg-[#E8D5C4] rounded" />
              <div className="h-12 bg-[#E8D5C4] rounded-[16px]" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[24px] border border-[#DDC1AE] p-6 mb-6 shadow-[0_8px_30px_rgba(109,76,65,0.08)]">
        <div className="h-6 w-24 bg-[#E8D5C4] rounded mb-6" />
        <div className="space-y-4 max-w-xl">
          <div className="h-12 bg-[#E8D5C4] rounded-full" />
          <div className="h-[1px] bg-[#EFE3D7]" />
          <div className="h-12 bg-[#E8D5C4] rounded-full" />
          <div className="h-[1px] bg-[#EFE3D7]" />
          <div className="h-12 bg-[#E8D5C4] rounded-full" />
        </div>
      </div>

      <div className="bg-white rounded-[24px] border border-[#DDC1AE] p-6 shadow-[0_8px_30px_rgba(109,76,65,0.08)]">
        <div className="h-6 w-20 bg-[#E8D5C4] rounded mb-6" />
        <div className="space-y-3 max-w-xl">
          <div className="flex justify-between">
            <div className="h-5 w-28 bg-[#E8D5C4] rounded" />
            <div className="h-5 w-16 bg-[#E8D5C4] rounded" />
          </div>
          <div className="h-[1px] bg-[#EFE3D7]" />
          <div className="flex justify-between">
            <div className="h-5 w-20 bg-[#E8D5C4] rounded" />
            <div className="h-5 w-24 bg-[#E8D5C4] rounded" />
          </div>
          <div className="h-[1px] bg-[#EFE3D7]" />
          <div className="h-10 w-32 bg-[#E8D5C4] rounded-full" />
        </div>
      </div>
    </div>
  );
}
