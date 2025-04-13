
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
  isLoading?: boolean;
  error?: Error | null;
}

export const AnalyticsContent = ({ 
  analyticsData, 
  isLoading = false,
  error = null 
}: AnalyticsContentProps) => {
  const { t } = useLanguage();
  
  // If there's an error, show the error boundary
  if (error) {
    return (
      <EmptyState 
        variant="analytics"
        title={t('error')}
        description={error.message || t('unableToLoadData')}
      />
    );
  }
  
  // If data is loading, show skeleon state
  if (isLoading) {
    return <div className="animate-pulse space-y-6">
      {/* Metrics skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-background rounded-lg p-4 shadow-sm">
            <div className="h-4 bg-muted rounded w-1/3 mb-2"></div>
            <div className="h-7 bg-muted rounded w-1/2 mb-1"></div>
            <div className="h-3 bg-muted rounded w-1/4"></div>
          </div>
        ))}
      </div>
      
      {/* Charts skeletons */}
      <div className="h-[300px] bg-muted/30 border border-dashed rounded-lg"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="h-[250px] bg-muted/30 border border-dashed rounded-lg"></div>
        <div className="h-[250px] bg-muted/30 border border-dashed rounded-lg"></div>
      </div>
    </div>;
  }
  
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
          <ROIPerformanceChart 
            data={analyticsData?.roiPerformance || []} 
            hasData={analyticsData?.roiPerformance?.length > 0}
          />
        </ErrorBoundary>

        {/* Portfolio Breakdown */}
        <ErrorBoundary>
          <PortfolioBreakdown 
            assetAllocation={analyticsData?.assetAllocation || []}
            geographicDistribution={analyticsData?.geographicDistribution || []}
            hasAssetData={analyticsData?.assetAllocation?.length > 0}
            hasGeoData={analyticsData?.geographicDistribution?.length > 0}
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
