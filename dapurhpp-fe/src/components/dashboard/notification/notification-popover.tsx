"use client";

import { useEffect, useRef } from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { useNotifications } from "@/hooks/use-notifications";
import NotificationItem from "./notification-item";
import NotificationEmpty from "./notification-empty";
import { useNotifStore } from "@/lib/notification-store";

export default function NotificationPopover() {
  const {
    notifications,
    unreadCount,
    isLoading,
    generate,
    fetchAll,
    markRead,
    markAllRead,
    remove,
  } = useNotifications();
  const hasGenerated = useRef(false);
  const open = useNotifStore((s) => s.isOpen);
  const setOpen = useNotifStore((s) => s.setOpen);

  // Fetch on mount
  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  // Generate notifications when popover opens (once per session)
  useEffect(() => {
    if (!hasGenerated.current) {
      generate().then(() => {
        fetchAll(); // ← Fetch ulang setelah generate selesai
      });
      hasGenerated.current = true;
    }
  }, [generate, fetchAll]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button className="relative p-2 rounded-full hover:bg-[#FFF8F6] transition-colors text-[#2A1711]">
          <svg
            className="w-5 h-5"
            viewBox="0 0 24 24"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
          </svg>
          {unreadCount > 0 && (
            <div className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-[#FF8A00] rounded-full flex items-center justify-center text-[10px] font-bold text-white px-1 shadow-sm">
              {unreadCount > 99 ? "99+" : unreadCount}
            </div>
          )}
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        sideOffset={12}
        className="w-[380px] sm:w-[420px] p-0 rounded-2xl overflow-hidden"
      >
        <div className="flex flex-col max-h-[480px]">
          {/* Header */}
          <div className="flex items-center justify-between px-4 pt-4 pb-2 border-b border-[#E8D5C4]">
            <div className="flex items-center gap-2">
              <span className="text-base">🔔</span>
              <h3 className="font-semibold text-sm text-[#2A1711]">
                Notifikasi
              </h3>
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="text-xs text-[#FF8A00] hover:text-[#E67A00] font-medium transition-colors"
              >
                Tandai Semua
              </button>
            )}
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto px-2 py-2 space-y-1">
            {isLoading && notifications.length === 0 ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-5 h-5 border-2 border-[#FF8A00] border-t-transparent rounded-full animate-spin" />
              </div>
            ) : notifications.length === 0 ? (
              <NotificationEmpty />
            ) : (
              notifications.map((item) => (
                <NotificationItem
                  key={item.id}
                  item={item}
                  onMarkRead={markRead}
                  onDelete={remove}
                />
              ))
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-2 border-t border-[#E8D5C4]">
            <button
              onClick={() => setOpen(false)}
              className="w-full py-2 text-xs text-center text-[#8A7362] hover:text-[#2A1711] transition-colors"
            >
              Tutup
            </button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
