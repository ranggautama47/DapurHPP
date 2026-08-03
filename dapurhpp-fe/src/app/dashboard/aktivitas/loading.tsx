export default function AktivitasLoading() {
  return (
    <div className="mx-auto max-w-[1500px] space-y-6 animate-pulse">
      <div className="space-y-2">
        <div className="h-10 bg-[#F5E6D8] rounded w-1/4" />
        <div className="h-6 bg-[#F5E6D8] rounded w-1/3" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-[24px] border border-[#E8D5C4] p-6 shadow-[0_8px_30px_rgba(109,76,65,0.08)]"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="h-4 bg-[#F5E6D8] rounded w-3/4" />
              <div className="w-10 h-10 rounded-xl bg-[#F5E6D8]" />
            </div>
            <div className="h-8 bg-[#F5E6D8] rounded w-1/2" />
          </div>
        ))}
      </div>

      <div className="bg-white rounded-[24px] border border-[#E8D5C4] p-5 shadow-[0_8px_30px_rgba(109,76,65,0.08)]">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-6">
          <div className="relative flex-1 max-w-md">
            <div className="h-10 bg-[#F5E6D8] rounded-full" />
          </div>
          <div className="h-10 bg-[#F5E6D8] rounded-full w-36" />
          <div className="h-10 bg-[#F5E6D8] rounded-full w-40" />
        </div>
      </div>

      <div className="bg-white rounded-[24px] border border-[#E8D5C4] shadow-[0_8px_30px_rgba(109,76,65,0.08)]">
        <div className="p-6 border-b border-[#E8D5C4]">
          <div className="h-6 bg-[#F5E6D8] rounded w-1/4" />
          <div className="h-4 bg-[#F5E6D8] rounded w-1/3 mt-2" />
        </div>
        <div className="p-6 space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-white rounded-[24px] border border-[#E8D5C4] p-5 shadow-[0_8px_30px_rgba(109,76,65,0.08)]">
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
      </div>

      <nav className="flex items-center justify-center gap-1" aria-label="Pagination">
        <button className="p-2 rounded-xl text-[#564334] hover:bg-[#FFF8F6] disabled:opacity-50" disabled>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        {[...Array(5)].map((_, i) => (
          <button
            key={i}
            className={`w-10 h-10 rounded-xl text-sm font-medium font-[var(--font-be-vietnam)] transition-all ${
              i === 0
                ? "bg-[#FF8A00] text-white shadow-[0_4px_15px_rgba(255,138,0,0.3)]"
                : "text-[#564334] hover:bg-[#FFF8F6]"
            }`}
          >
            {i + 1}
          </button>
        ))}
        <span className="px-2 text-[#8A7362]">...</span>
        <button className="w-10 h-10 rounded-xl text-sm font-medium font-[var(--font-be-vietnam)] text-[#564334] hover:bg-[#FFF8F6]">10</button>
        <button className="p-2 rounded-xl text-[#564334] hover:bg-[#FFF8F6]">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </nav>
    </div>
  );
}