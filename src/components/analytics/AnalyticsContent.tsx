
import React from 'react';
import { AnalyticsData } from '@/types/analytics';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PropertyPerformance } from "./PropertyPerformance";
import { MarketComparison } from "./MarketComparison";
import { PortfolioAllocation } from "./PortfolioAllocation";
import { EmptyState } from "@/components/ui/empty-state";
import { AreaChart, PieChart, BarChart } from "lucide-react";

interface AnalyticsContentProps {
  analyticsData: AnalyticsData;
}

export const AnalyticsContent = ({ analyticsData }: AnalyticsContentProps) => {
  const hasData = true; // In a real app, this would be based on data availability
  
  if (!hasData) {
    return (
      <EmptyState 
        icon={<AreaChart size={40} />}
        title="No Analytics Data"
        description="You don't have any properties in your portfolio to analyze. Add properties to see analytics."
        variant="analytics" // Use the "analytics" variant that we'll add to EmptyState
      />
    );
  }
  
  return (
    <Tabs defaultValue="performance" className="space-y-6">
      <TabsList>
        <TabsTrigger value="performance">Performance</TabsTrigger>
        <TabsTrigger value="allocation">Portfolio Allocation</TabsTrigger>
        <TabsTrigger value="comparison">Market Comparison</TabsTrigger>
      </TabsList>
      
      <TabsContent value="performance" className="space-y-6">
        <PropertyPerformance data={analyticsData.roiPerformance} />
      </TabsContent>
      
      <TabsContent value="allocation" className="space-y-6">
        {analyticsData.assetAllocation?.length ? (
          <PortfolioAllocation data={analyticsData.assetAllocation} />
        ) : (
          <EmptyState 
            icon={<PieChart size={40} />}
            title="Portfolio Allocation Data Unavailable"
            description="We don't have enough data to show your portfolio allocation. Add more properties or check back later."
            variant="analytics"
          />
        )}
      </TabsContent>
      
      <TabsContent value="comparison" className="space-y-6">
        {analyticsData.marketComparison ? (
          <MarketComparison data={analyticsData.marketComparison} />
        ) : (
          <EmptyState 
            icon={<BarChart size={40} />}
            title="Market Comparison Data Unavailable"
            description="We don't have enough data to compare your portfolio with the market. Add more properties or check back later."
            variant="analytics"
          />
        )}
      </TabsContent>
    </Tabs>
  );
};
