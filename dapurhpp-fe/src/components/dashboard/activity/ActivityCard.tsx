"use client";

import { ShoppingCart, ChefHat, TrendingUp, DollarSign, Package } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale/id";
import { enUS } from "date-fns/locale/en-US";
import type { AktivitasItem } from "@/types/aktivitas";
import { useTranslation } from "@/context/language-context";

const ICON_MAP: Record<
  string,
  {
    icon: typeof ShoppingCart;
    iconBg: string;
    iconColor: string;
    badgeColor: string;
    badgeBg: string;
  }
> = {
  penjualan: {
    icon: TrendingUp,
    iconBg: "#D0F4DE",
    iconColor: "#06D6A0",
    badgeColor: "#06D6A0",
    badgeBg: "#D0F4DE",
  },
  pembayaran: {
    icon: DollarSign,
    iconBg: "#D0F4DE",
    iconColor: "#06D6A0",
    badgeColor: "#06D6A0",
    badgeBg: "#D0F4DE",
  },
  belanja: {
    icon: ShoppingCart,
    iconBg: "#FFE9E4",
    iconColor: "#FF8A00",
    badgeColor: "#FF8A00",
    badgeBg: "#FFE9E4",
  },
  produksi: {
    icon: ChefHat,
    iconBg: "#EAF2D7",
    iconColor: "#606C38",
    badgeColor: "#606C38",
    badgeBg: "#EAF2D7",
  },
  pengeluaran: {
    icon: DollarSign,
    iconBg: "#FFE9E4",
    iconColor: "#EF4444",
    badgeColor: "#EF4444",
    badgeBg: "#FEE2E2",
  },
};

interface ActivityCardProps {
  item: AktivitasItem;
}

export function ActivityCard({ item }: ActivityCardProps) {
  const { t, language } = useTranslation("master");
  const localeStr = language === "id" ? "id-ID" : "en-US";
  const dateLocale = language === "id" ? id : enUS;

  const isBatal = item.type === "produksi" && item.status === "BATAL";

  const iconConfig = isBatal
    ? {
        icon: ChefHat,
        iconBg: "#FEE2E2",
        iconColor: "#EF4444",
        badgeColor: "#EF4444",
        badgeBg: "#FEE2E2",
      }
    : (ICON_MAP[item.type] ?? ICON_MAP.pengeluaran);
  const IconComp = iconConfig.icon;

  const badgeText = isBatal
    ? t("common.status.cancelled")
    : t(`activity.types.${item.type}`);

  const dateObj = new Date(item.time);
  const dateStr = format(dateObj, "d MMM yyyy", { locale: dateLocale });
  const timeStr = format(dateObj, "HH:mm", { locale: dateLocale }) + " WIB";

  return (
    <div className="bg-white rounded-[24px] border border-[#E8D5C4] p-5 shadow-[0_8px_30px_rgba(109,76,65,0.08)] hover:-translate-y-1 transition-transform duration-300 hover:shadow-[0_12px_40px_rgba(109,76,65,0.12)]">
      <div className="flex items-start gap-4">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: iconConfig.iconBg }}
        >
          <IconComp size={20} strokeWidth={1.75} color={iconConfig.iconColor} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3 mb-2">
            <h4 className="font-[var(--font-playfair)] font-bold text-base text-[#2A1711] truncate">
              {item.title}
            </h4>
            <span
              className="px-2.5 py-0.5 rounded-full text-xs font-medium font-[var(--font-be-vietnam)] flex-shrink-0"
              style={{ backgroundColor: iconConfig.badgeBg, color: iconConfig.badgeColor }}
            >
              {badgeText}
            </span>
          </div>

          <p className="text-sm text-[#564334] mb-3 line-clamp-1 truncate font-[var(--font-be-vietnam)]">
            {item.subtitle}
          </p>

          <div className="flex items-center gap-4 text-xs text-[#8A7362]">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "#DDC1AE" }} />
              {dateStr}
            </span>
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "#DDC1AE" }} />
              {timeStr}
            </span>
          </div>
        </div>

        {item.amount !== undefined && item.amount !== null && (
          <span
            className={`text-sm font-[var(--font-roboto-mono)] font-semibold flex-shrink-0 ${
              item.amountType === "positive" ? "text-[#06D6A0]" : "text-[#EF4444]"
            }`}
          >
            {item.amountType === "positive" ? "+" : "−"}Rp{" "}
            {Math.abs(item.amount).toLocaleString(localeStr)}
          </span>
        )}
      </div>
    </div>
  );
}