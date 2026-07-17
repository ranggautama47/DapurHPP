export default function LaporanLoading() {
  return (
    <div className="mx-auto max-w-[1500px] animate-pulse">
      <div className="mb-8">
        <div className="h-9 w-32 bg-[#F5E6D8] rounded mb-2" />
        <div className="h-5 w-64 bg-[#F5E6D8] rounded" />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="bg-white rounded-[24px] border border-[#DDC1AE] p-5">
            <div className="h-3 w-20 bg-[#F5E6D8] rounded mb-3" />
            <div className="h-7 w-24 bg-[#F5E6D8] rounded" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-white rounded-[24px] border border-[#DDC1AE] p-6">
          <div className="h-[300px] bg-[#F5E6D8] rounded-2xl" />
        </div>
        <div className="bg-white rounded-[24px] border border-[#DDC1AE] p-6">
          <div className="h-[300px] bg-[#F5E6D8] rounded-2xl" />
        </div>
      </div>
    </div>
  );
}