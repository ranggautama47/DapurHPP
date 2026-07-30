"use client";

import { Trash2 } from "lucide-react";
import type { NotifItem } from "@/lib/notification-store";
import { useTranslation } from "@/context/language-context";

function timeAgo(dateStr: string, t: (key: string, params?: Record<string, string>) => string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diff = now - then;
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (mins < 1) return t("notification.timeAgo.justNow");
  if (mins < 60) return t("notification.timeAgo.minutesAgo", { minutes: String(mins) });
  if (hours < 24) return t("notification.timeAgo.hoursAgo", { hours: String(hours) });
  if (days === 1) return t("notification.timeAgo.yesterday");
  return t("notification.timeAgo.daysAgo", { days: String(days) });
}

function getIconBg(tipe: string): string {
  if (tipe.includes("stok_habis")) return "bg-[#FEE2E2] text-[#EF4444]";
  if (tipe.includes("stok_hampir")) return "bg-[#FFF1D6] text-[#FF8A00]";
  if (tipe.includes("produksi")) return "bg-[#EAF2D7] text-[#606C38]";
  if (tipe.includes("penjualan")) return "bg-[#D0F4DE] text-[#06D6A0]";
  if (tipe.includes("omzet")) return "bg-[#D0F4DE] text-[#06D6A0]";
  if (tipe.includes("reminder")) return "bg-[#F1E9DA] text-[#8A7362]";
  return "bg-[#FFF8F6] text-[#8A7362]";
}

interface Props {
  item: NotifItem;
  onMarkRead: (id: number) => void;
  onDelete: (id: number) => void;
}

export default function NotificationItem({ item, onMarkRead, onDelete }: Props) {
  const { t } = useTranslation("master");
  const iconBg = getIconBg(item.tipe);

  return (
    <div
      className={`flex gap-3 p-3 rounded-xl transition-all duration-150 ${
        item.isRead
          ? "bg-white"
          : "bg-[#FFF8F6] border border-[#FFE2DA]"
      } hover:bg-[#FFF8F6] cursor-pointer group relative active:scale-[0.98]`}
      onClick={() => !item.isRead && onMarkRead(item.id)}
    >
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-base ${iconBg}`}
      >
        {item.icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-[#2A1711] truncate">
          {item.judul}
        </p>
        {item.deskripsi && (
          <p className="text-xs text-[#8A7362] mt-0.5 line-clamp-2 leading-relaxed">
            {item.deskripsi}
          </p>
        )}
        <p className="text-[10px] text-[#B8A08E] mt-1 font-medium">
          {timeAgo(item.createdAt, t)}
        </p>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete(item.id);
        }}
        className="opacity-0 group-hover:opacity-100 transition-opacity duration-150 shrink-0 p-2 rounded-lg hover:bg-[#FEE2E2] text-[#8A7362] hover:text-[#EF4444] self-center"
        aria-label={t("notification.deleteLabel")}
      >
        <Trash2 className="w-4 h-4" />
      </button>
      {!item.isRead && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[#FF8A00]" />
      )}
    </div>
  );
}