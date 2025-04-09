
import { useLanguage } from "@/contexts/LanguageContext";
import { AnalyticsData } from "@/services/analytics/analyticsService";
import { MetricsSection } from "./MetricsSection";
import { ROIPerformanceChart } from "./ROIPerformanceChart";
import { PortfolioBreakdown } from "./PortfolioBreakdown";
import { EventsAttendedCard } from "./EventsAttendedCard";

interface AnalyticsContentProps {
  analyticsData: AnalyticsData | null;
}

export const AnalyticsContent = ({ analyticsData }: AnalyticsContentProps) => {
  const { t } = useLanguage();
  
  // Even with null/empty data, we still render the UI structure
  return (
    <div className="grid gap-6">
      {/* Key Metrics */}
      <MetricsSection analyticsData={analyticsData || {
        portfolioROI: { value: 0, change: null },
        annualGrowth: { value: 0, change: null },
        marketComparison: { value: 0, status: 'below' },
      } as AnalyticsData} />

      {/* Performance Chart */}
      <ROIPerformanceChart data={analyticsData?.roiPerformance || []} />

      {/* Portfolio Breakdown */}
      <PortfolioBreakdown 
        assetAllocation={analyticsData?.assetAllocation || []}
        geographicDistribution={analyticsData?.geographicDistribution || []}
      />

      {/* Events Attended */}
      <EventsAttendedCard count={analyticsData?.eventsAttended || 0} />
    </div>
  );
};
