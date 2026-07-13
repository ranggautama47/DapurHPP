"use client";

import { StatsCards } from "@/components/dashboard/stats-cards";
import { ProfitChart } from "@/components/dashboard/profit-chart";
import { ExpenseChart } from "@/components/dashboard/expense-chart";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { TopProducts } from "@/components/dashboard/top-products";

export default function DashboardPage() {
  return (
    <>
      <StatsCards />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <ProfitChart />
          <ExpenseChart />
        </div>
        <div className="space-y-6">
          <RecentActivity />
          <TopProducts />
        </div>
      </div>
    </>
  );
}