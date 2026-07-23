"use client";

import { Trash2 } from "lucide-react";
import type { NotifItem } from "@/lib/notification-store";

function timeAgo(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diff = now - then;
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (mins < 1) return "Baru saja";
  if (mins < 60) return `${mins} menit lalu`;
  if (hours < 24) return `${hours} jam lalu`;
  if (days === 1) return "Kemarin";
  return `${days} hari lalu`;
}

interface Props {
  item: NotifItem;
  onMarkRead: (id: number) => void;
  onDelete: (id: number) => void;
}

export default function NotificationItem({ item, onMarkRead, onDelete }: Props) {
  return (
    <div
      className={`flex gap-3 p-3 rounded-xl transition-all duration-150 ${
        item.isRead
          ? "bg-white"
          : "bg-[#FFF8F6] border border-[#FFE2DA]"
      } hover:bg-[#FFF8F6] cursor-pointer group relative`}
      onClick={() => !item.isRead && onMarkRead(item.id)}
    >
      <span className="text-lg shrink-0 mt-0.5">{item.icon}</span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-[#2A1711] truncate">
          {item.judul}
        </p>
        {item.deskripsi && (
          <p className="text-xs text-[#8A7362] mt-0.5 line-clamp-2">
            {item.deskripsi}
          </p>
        )}
        <p className="text-[10px] text-[#B8A08E] mt-1">
          {timeAgo(item.createdAt)}
        </p>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete(item.id);
        }}
        className="opacity-0 group-hover:opacity-100 transition-opacity duration-150 shrink-0 p-1 rounded-md hover:bg-[#FFE2DA] text-[#8A7362] hover:text-red-500 self-start mt-1"
        aria-label="Hapus notifikasi"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
      {!item.isRead && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[#FF8A00]" />
      )}
    </div>
  );
}
