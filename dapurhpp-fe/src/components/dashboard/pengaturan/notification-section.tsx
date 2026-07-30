"use client";

import { Bell, Package, TrendingUp } from "lucide-react";
import { useTranslation } from "@/context/language-context";
import { Toggle } from "./toggle";

interface NotificationSectionProps {
  notifAplikasi: boolean;
  notifStok: boolean;
  notifPenjualan: boolean;
  onToggleAplikasi: (v: boolean) => void;
  onToggleStok: (v: boolean) => void;
  onTogglePenjualan: (v: boolean) => void;
}

export function NotificationSection({
  notifAplikasi,
  notifStok,
  notifPenjualan,
  onToggleAplikasi,
  onToggleStok,
  onTogglePenjualan,
}: NotificationSectionProps) {
  const { t } = useTranslation("settings");

  return (
    <section className="bg-white rounded-[24px] border border-[#DDC1AE] p-6 mb-6 shadow-[0_8px_30px_rgba(109,76,65,0.08)] hover:-translate-y-1 transition-all duration-300 ease-out">
      <h2 className="font-[var(--font-playfair)] font-bold text-2xl text-[#2A1711] mb-6">
        {t("notifications.title")}
      </h2>

      <div className="space-y-0 max-w-xl">
        <div className="flex items-center justify-between py-3">
          <div className="flex items-center gap-3">
            <Bell className="w-5 h-5 text-[#564334] shrink-0" />
            <div>
              <p className="font-medium text-[#2A1711] text-sm">
                {t("notifications.appNotifications")}
              </p>
              <p className="text-xs text-[#8A7362]">
                {t("notifications.appNotificationsDesc")}
              </p>
            </div>
          </div>
          <Toggle
            checked={notifAplikasi}
            onChange={onToggleAplikasi}
          />
        </div>

        <div className="border-t border-[#EFE3D7]" />

        <div className="flex items-center justify-between py-3">
          <div className="flex items-center gap-3">
            <Package className="w-5 h-5 text-[#564334] shrink-0" />
            <div>
              <p className="font-medium text-[#2A1711] text-sm">
                {t("notifications.stockNotifications")}
              </p>
              <p className="text-xs text-[#8A7362]">
                {t("notifications.stockNotificationsDesc")}
              </p>
            </div>
          </div>
          <Toggle
            checked={notifStok}
            onChange={onToggleStok}
          />
        </div>

        <div className="border-t border-[#EFE3D7]" />

        <div className="flex items-center justify-between py-3">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-5 h-5 text-[#564334] shrink-0" />
            <div>
              <p className="font-medium text-[#2A1711] text-sm">
                {t("notifications.salesNotifications")}
              </p>
              <p className="text-xs text-[#8A7362]">
                {t("notifications.salesNotificationsDesc")}
              </p>
            </div>
          </div>
          <Toggle
            checked={notifPenjualan}
            onChange={onTogglePenjualan}
          />
        </div>
      </div>
    </section>
  );
}