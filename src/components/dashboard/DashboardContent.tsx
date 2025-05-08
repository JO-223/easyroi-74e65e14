
import React from "react";
import { DashboardStats } from "./DashboardStats";
import { InvestmentGrowthChart } from "./InvestmentGrowthChart";
import { PortfolioAllocationChart } from "./PortfolioAllocationChart";
import { PropertiesTable } from "./PropertiesTable";
import { UserLevelCard } from "./UserLevelCard";
import { DashboardData, formatCurrency } from "@/services/dashboard/dashboardService";

interface DashboardContentProps {
  dashboardData: DashboardData;
}

export const DashboardContent = ({ dashboardData }: DashboardContentProps) => {
  const { stats, investmentGrowth, portfolioAllocation, properties } = dashboardData;
  
  // Format the stats before passing to DashboardStats
  const formattedStats = {
    ...stats,
    formattedInvestment: formatCurrency(stats.totalInvestment)
  };

  return (
    <div className="grid gap-4 md:gap-8 mb-8">
      <DashboardStats stats={formattedStats} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8">
        <div className="lg:col-span-2">
          <InvestmentGrowthChart 
            data={investmentGrowth} 
            totalInvestment={stats.totalInvestment} 
          />
        </div>
        <div className="space-y-4 md:space-y-8">
          <UserLevelCard />
          <PortfolioAllocationChart data={portfolioAllocation} />
        </div>
      </div>
      
      <PropertiesTable properties={properties} />
    </div>
  );
};
