
import React from "react";
import { DashboardStats } from "./DashboardStats";
import { InvestmentGrowthChart } from "./InvestmentGrowthChart";
import { PortfolioAllocationChart } from "./PortfolioAllocationChart";
import { PropertiesTable } from "./PropertiesTable";
import { DashboardData } from "@/services/dashboard/dashboardService";

interface DashboardContentProps {
  dashboardData: DashboardData;
}

export const DashboardContent = ({ dashboardData }: DashboardContentProps) => {
  const { stats, investmentGrowth, portfolioAllocation, properties } = dashboardData;

  return (
    <div className="grid gap-4 md:gap-8 mb-8">
      <DashboardStats stats={stats} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8">
        <InvestmentGrowthChart data={investmentGrowth} className="lg:col-span-2" />
        <PortfolioAllocationChart data={portfolioAllocation} />
      </div>
      
      <PropertiesTable properties={properties} />
    </div>
  );
};
