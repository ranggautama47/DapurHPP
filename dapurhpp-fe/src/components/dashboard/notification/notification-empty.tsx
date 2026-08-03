import { useTranslation } from "@/context/language-context";

export default function NotificationEmpty() {
  const { t } = useTranslation("master");
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-16 h-16 rounded-full bg-[#FFF8F6] flex items-center justify-center mb-4 text-3xl">
        🔔
      </div>
      <p className="text-base font-semibold text-[#2A1711]">
        {t("notification.emptyTitle")}
      </p>
      <p className="text-sm text-[#8A7362] mt-2 max-w-[240px] leading-relaxed">
        {t("notification.emptyState")}
      </p>
    </div>
  );
}
