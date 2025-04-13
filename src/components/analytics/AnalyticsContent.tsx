
import { useLanguage } from "@/contexts/LanguageContext";
import { AnalyticsData } from "@/services/analytics/analyticsService";
import { MetricsSection } from "./MetricsSection";
import { ROIPerformanceChart } from "./ROIPerformanceChart";
import { PortfolioBreakdown } from "./PortfolioBreakdown";
import { EventsAttendedCard } from "./EventsAttendedCard";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorBoundary } from "@/components/ui/error-boundary";

interface AnalyticsContentProps {
  analyticsData: AnalyticsData | null;
}

export const AnalyticsContent = ({ analyticsData }: AnalyticsContentProps) => {
  const { t } = useLanguage();
  
  // If there's no data at all, show an empty state
  if (!analyticsData) {
    return (
      <EmptyState 
        variant="analytics"
        title={t('noInvestmentDataAvailable')} 
        description={t('dataWillAppearSoon')}
      />
    );
  }
  
  return (
    <ErrorBoundary>
      <div className="grid gap-6">
        {/* Key Metrics */}
        <MetricsSection analyticsData={analyticsData} />

        {/* Performance Chart */}
        <ErrorBoundary>
          <ROIPerformanceChart data={analyticsData?.roiPerformance || []} />
        </ErrorBoundary>

        {/* Portfolio Breakdown */}
        <ErrorBoundary>
          <PortfolioBreakdown 
            assetAllocation={analyticsData?.assetAllocation || []}
            geographicDistribution={analyticsData?.geographicDistribution || []}
          />
        </ErrorBoundary>

        {/* Events Attended */}
        <ErrorBoundary>
          <EventsAttendedCard count={analyticsData?.eventsAttended || 0} />
        </ErrorBoundary>
      </div>
    </ErrorBoundary>
  );
};
