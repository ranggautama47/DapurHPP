import { useEffect, useState, useMemo } from "react";
import { TrendingUp, ShoppingBag, ShoppingCart, PieChart } from "lucide-react";
import { api } from "@/lib/axios";
import { buildLaporanQuery, type LaporanDateParams } from "@/lib/laporan-query";
import { useTranslation } from "@/context/language-context";

interface StatsResponse {
  totalPendapatan: number;
  totalHpp: number;
  totalLaba: number;
  margin: number;
  penjualan: number;
  tren: {
    pendapatan: number;
    hpp: number;
    laba: number;
    margin: number;
  };
}

interface StatCard {
  labelKey: string;
  value: string;
  change: string;
  positive: boolean;
  icon: typeof TrendingUp;
  iconBg: string;
  iconColor: string;
  bgCard: string;
  borderColor: string;
  textColor: string;
  labelColor: string;
}

export function StatsCards({ dateParams }: { dateParams?: LaporanDateParams }) {
  const { t } = useTranslation("dashboard");
  const [cards, setCards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);

  const defaultCards = useMemo(() => [
    {
      labelKey: "stats.revenue",
      value: "Rp 0",
      change: t("stats.fromYesterday", { change: "0%" }),
      positive: true,
      icon: TrendingUp,
      iconBg: "#D0F4DE",
      iconColor: "#06D6A0",
      bgCard: "#F4FAF6",
      borderColor: "#E1F5EA",
      textColor: "#0B6623",
      labelColor: "#1E4620",
    },
    {
      labelKey: "stats.cogs",
      value: "Rp 0",
      change: t("stats.fromYesterday", { change: "0%" }),
      positive: false,
      icon: ShoppingBag,
      iconBg: "#FFE9E4",
      iconColor: "#FF8A00",
      bgCard: "#FFF6F4",
      borderColor: "#FEE8E2",
      textColor: "#BC4E00",
      labelColor: "#5C2600",
    },
    {
      labelKey: "stats.sales",
      value: `0 ${t("stats.unitsPcs")}`,
      change: t("stats.fromYesterday", { change: "0%" }),
      positive: true,
      icon: ShoppingCart,
      iconBg: "#FFF3E0",
      iconColor: "#FFB020",
      bgCard: "#FFFBF5",
      borderColor: "#FFF0D6",
      textColor: "#2A1711",
      labelColor: "#564334",
    },
    {
      labelKey: "stats.profitMargin",
      value: "0%",
      change: t("stats.fromYesterday", { change: "0%" }),
      positive: true,
      icon: PieChart,
      iconBg: "#F3E8FF",
      iconColor: "#6B21A8",
      bgCard: "#F9F5FF",
      borderColor: "#EADBFB",
      textColor: "#5B149C",
      labelColor: "#370963",
    },
  ], [t]);

  const [statCards, setStatCards] = useState(defaultCards);

  useEffect(() => {
    setStatCards(defaultCards);
  }, [t]); // Menambahkan dependency array

  const fetchStats = async () => {
    setLoading(true);
    setFetchError(false);
    try {
      const res = await api.get<StatsResponse>(
        `/laporan/ringkasan${buildLaporanQuery(dateParams ?? {})}`,
      );
      const d = res.data;

      setStatCards([
        {
          labelKey: "stats.revenue",
          value: `Rp ${Number(d.totalPendapatan ?? 0).toLocaleString("id-ID")}`,
          change: t("stats.fromYesterday", {
            change: `${Math.abs(d.tren?.pendapatan ?? 0)}%`,
          }),
          positive: (d.tren?.pendapatan ?? 0) >= 0,
          icon: TrendingUp,
          iconBg: "#D0F4DE",
          iconColor: "#06D6A0",
          bgCard: "#F4FAF6",
          borderColor: "#E1F5EA",
          textColor: "#0B6623",
          labelColor: "#1E4620",
        },
        {
          labelKey: "stats.cogs",
          value: `Rp ${Number(d.totalHpp ?? 0).toLocaleString("id-ID")}`,
          change: t("stats.fromYesterday", {
            change: `${Math.abs(d.tren?.hpp ?? 0)}%`,
          }),
          positive: (d.tren?.hpp ?? 0) <= 0,
          icon: ShoppingBag,
          iconBg: "#FFE9E4",
          iconColor: "#FF8A00",
          bgCard: "#FFF6F4",
          borderColor: "#FEE8E2",
          textColor: "#BC4E00",
          labelColor: "#5C2600",
        },
        {
          labelKey: "stats.sales",
          value: `${Number(d.penjualan ?? 0).toLocaleString("id-ID")} ${t("stats.unitsPcs")}`,
          change: t("stats.fromYesterday", {
            change: `${Math.abs(d.tren?.laba ?? 0)}%`,
          }),
          positive: true,
          icon: ShoppingCart,
          iconBg: "#FFF3E0",
          iconColor: "#FFB020",
          bgCard: "#FFFBF5",
          borderColor: "#FFF0D6",
          textColor: "#2A1711",
          labelColor: "#564334",
        },
        {
          labelKey: "stats.profitMargin",
          value: `${Number(d.margin ?? 0).toLocaleString("id-ID", { minimumFractionDigits: 2 })}%`,
          change: t("stats.fromYesterday", {
            change: `${Math.abs(d.tren?.margin ?? 0)}%`,
          }),
          positive: (d.tren?.margin ?? 0) >= 0,
          icon: PieChart,
          iconBg: "#F3E8FF",
          iconColor: "#6B21A8",
          bgCard: "#F9F5FF",
          borderColor: "#EADBFB",
          textColor: "#5B149C",
          labelColor: "#370963",
        },
      ]);
    } catch (err) {
      console.error("Gagal fetch stats:", err);
      setFetchError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [dateParams]);

  if (fetchError) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-[#8A7362]">
        <svg
          className="w-12 h-12 mb-3 opacity-30"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <p className="text-base mb-4">{t("stats.fetchError")}</p>
        <button
          onClick={fetchStats}
          className="px-5 py-2 rounded-full bg-[#FF8A00] text-white text-sm font-medium hover:bg-[#E67E00] transition-colors"
        >
          {t("stats.retry")}
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statCards.map((s, i) => (
        <div
          key={i}
          className="rounded-[24px] border p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:-translate-y-1 transition-transform duration-300"
          style={{
            backgroundColor: s.bgCard,
            borderColor: s.borderColor,
          }}
        >
          <div className="flex items-start justify-between mb-4">
            {loading ? (
              <>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-[#E8D5C4] rounded-lg w-[60%] animate-pulse" />
                  <div className="h-3 bg-[#E8D5C4] rounded-lg w-[40%] animate-pulse" />
                </div>
                <div className="w-10 h-10 rounded-xl bg-[#F5E6D8] animate-pulse flex-shrink-0" />
              </>
            ) : (
              <>
                <div>
                  <p
                    className="text-sm font-[var(--font-be-vietnam)] mb-1 font-medium"
                    style={{ color: s.labelColor }}
                  >
                    {t(s.labelKey)}
                  </p>
                  <p
                    className={`text-xs flex items-center gap-1 font-medium ${s.positive ? "text-[#06D6A0]" : "text-[#EF4444]"}`}
                  >
                    {s.positive ? "↑" : "↓"} {s.change}
                  </p>
                </div>
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: s.iconBg }}
                >
                  <s.icon size={18} strokeWidth={2} color={s.iconColor} />
                </div>
              </>
            )}
          </div>
          {loading ? (
            <div className="h-8 bg-[#E8D5C4] rounded-lg w-[70%] animate-pulse" />
          ) : (
            <p
              className="text-2xl font-bold font-[var(--font-roboto-mono)]"
              style={{ color: s.textColor }}
            >
              {s.value}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
