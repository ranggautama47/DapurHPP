export default function NotificationEmpty() {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="w-14 h-14 rounded-full bg-[#FFF8F6] flex items-center justify-center mb-4 text-2xl">
        🔔
      </div>
      <p className="text-sm font-medium text-[#2A1711]">
        Belum ada notifikasi
      </p>
      <p className="text-xs text-[#8A7362] mt-1 max-w-[200px]">
        Semua aktivitas terbaru akan muncul di sini.
      </p>
    </div>
  );
}
