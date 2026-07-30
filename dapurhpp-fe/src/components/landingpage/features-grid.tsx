"use client";

import { useTranslation } from "@/context/language-context";
import { Package, FileText, ShoppingCart, Factory, ShoppingBag, TrendingUp } from "lucide-react";

export function FeaturesGrid() {
  const { t } = useTranslation("landing");

  const features = [
    {
      icon: Package,
      title: t("features.items.ingredients.title"),
      description: t("features.items.ingredients.description"),
      color: "#FF8A00",
    },
    {
      icon: FileText,
      title: t("features.items.recipes.title"),
      description: t("features.items.recipes.description"),
      color: "#914c00",
    },
    {
      icon: ShoppingCart,
      title: t("features.items.purchases.title"),
      description: t("features.items.purchases.description"),
      color: "#79564B",
    },
    {
      icon: Factory,
      title: t("features.items.production.title"),
      description: t("features.items.production.description"),
      color: "#635E51",
    },
    {
      icon: ShoppingBag,
      title: t("features.items.sales.title"),
      description: t("features.items.sales.description"),
      color: "#FF8A00",
    },
    {
      icon: TrendingUp,
      title: t("features.items.profit.title"),
      description: t("features.items.profit.description"),
      color: "#22C55E",
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="mx-auto max-w-[1500px] px-6">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="font-[var(--font-playfair)] text-3xl md:text-4xl font-bold text-[#2A1711] mb-4">
            {t("features.headingPrefix")}{" "}
            <span className="text-[#FF8A00]">{t("features.headingHighlight")}</span>
          </h2>
        </div>

        {/* Features Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="group bg-[#FFF8F6] rounded-2xl p-6 border border-[#DDC1AE]/30 hover:border-[#FF8A00]/30 hover:shadow-[0_8px_30px_rgba(255,138,0,0.08)] transition-all duration-300"
            >
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
                style={{ backgroundColor: `${feature.color}15` }}
              >
                <feature.icon
                  className="w-7 h-7"
                  style={{ color: feature.color }}
                />
              </div>
              <h3 className="font-[var(--font-playfair)] text-xl font-bold text-[#2A1711] mb-2">
                {feature.title}
              </h3>
              <p className="text-[#564334] text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}