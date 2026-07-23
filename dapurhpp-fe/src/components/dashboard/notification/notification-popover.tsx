"use client";

import { useEffect, useRef, useCallback } from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { useNotifications } from "@/hooks/use-notifications";
import NotificationItem from "./notification-item";
import NotificationEmpty from "./notification-empty";
import { useNotifStore } from "@/lib/notification-store";
import { X } from "lucide-react";

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

  // Generate notifications when opened (once per session)
  useEffect(() => {
    if (!hasGenerated.current) {
      generate().then(() => {
        fetchAll();
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
        sideOffset={8}
        className="w-[340px] sm:w-[380px] p-0 rounded-[20px] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.16)] border border-[#E8D5C4] data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95"
      >
        <div className="flex flex-col max-h-[min(520px,calc(100vh-120px))]">
          {/* Header */}
          <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-[#E8D5C4] shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#FFE9E4] flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-[#FF8A00]"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
                </svg>
              </div>
              <h3 className="font-[var(--font-playfair)] font-bold text-base text-[#2A1711]">
                Notifikasi
              </h3>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 bg-[#FF8A00] text-white text-[10px] font-bold rounded-full">
                  {unreadCount}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              {unreadCount > 0 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    markAllRead();
                  }}
                  className="text-xs text-[#FF8A00] hover:text-[#E67A00] font-medium transition-colors px-2 py-1 rounded-lg hover:bg-[#FFF8F6]"
                >
                  Tandai Semua
                </button>
              )}
              <button
                onClick={() => setOpen(false)}
                className="p-1.5 rounded-full hover:bg-[#FFF8F6] text-[#8A7362] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Body — Scrollable */}
          <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1 min-h-0 scrollbar-hide overscroll-contain ">
            {isLoading && notifications.length === 0 ? (
              <div className="flex items-center justify-center py-16">
                <div className="w-6 h-6 border-2 border-[#FF8A00] border-t-transparent rounded-full animate-spin" />
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
          <div className="px-4 py-3 border-t border-[#E8D5C4] bg-white shrink-0">
            <button
              onClick={() => setOpen(false)}
              className="w-full py-2.5 text-sm font-semibold text-center text-[#2A1711] bg-[#FFF8F6] hover:bg-[#FFE9E4] rounded-xl transition-colors"
            >
              Tutup
            </button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}