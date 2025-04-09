
import { useLanguage } from "@/contexts/LanguageContext";
import { AnalyticsData } from "@/services/analytics/analyticsService";
import { MetricsSection } from "./MetricsSection";
import { ROIPerformanceChart } from "./ROIPerformanceChart";
import { PortfolioBreakdown } from "./PortfolioBreakdown";
import { EventsAttendedCard } from "./EventsAttendedCard";

interface AnalyticsContentProps {
  analyticsData: AnalyticsData;
}

export const AnalyticsContent = ({ analyticsData }: AnalyticsContentProps) => {
  return (
    <div className="grid gap-6">
      {/* Key Metrics */}
      <MetricsSection analyticsData={analyticsData} />

      {/* Performance Chart */}
      <ROIPerformanceChart data={analyticsData.roiPerformance} />

      {/* Portfolio Breakdown */}
      <PortfolioBreakdown 
        assetAllocation={analyticsData.assetAllocation}
        geographicDistribution={analyticsData.geographicDistribution}
      />

      {/* Events Attended */}
      <EventsAttendedCard count={analyticsData.eventsAttended} />
    </div>
  );
};
