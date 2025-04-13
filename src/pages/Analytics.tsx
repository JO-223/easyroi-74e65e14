
import { useQuery } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { useLanguage } from "@/contexts/LanguageContext";
import { fetchAnalyticsData } from "@/services/analytics/analyticsService";
import { AnalyticsContent } from "@/components/analytics/AnalyticsContent";
import { Skeleton } from "@/components/ui/skeleton";

const Analytics = () => {
  const { t } = useLanguage();
  
  // Fetch analytics data with React Query
  const { data: analyticsData, isLoading, error } = useQuery({
    queryKey: ['analyticsData'],
    queryFn: fetchAnalyticsData,
  });

  // Show loading state with skeleton loaders
  if (isLoading) {
    return (
      <DashboardLayout title={t('analytics')} subtitle={t('comprehensiveAnalysis')}>
        <div className="grid gap-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-card rounded-lg shadow p-6">
                <Skeleton className="h-4 w-24 mb-4" />
                <Skeleton className="h-8 w-32 mb-4" />
                <Skeleton className="h-3 w-40" />
              </div>
            ))}
          </div>
          <div className="bg-card rounded-lg shadow p-6 h-96">
            <Skeleton className="h-5 w-40 mb-6" />
            <Skeleton className="h-full w-full" />
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Show a more user-friendly error state
  if (error) {
    return (
      <DashboardLayout title={t('analytics')} subtitle={t('comprehensiveAnalysis')}>
        <div className="flex flex-col items-center justify-center h-96 text-center">
          <h3 className="text-xl font-semibold text-easyroi-danger mb-2">{t('unableToLoadData')}</h3>
          <p className="text-muted-foreground">{t('pleaseTryRefreshingThePage')}</p>
        </div>
      </DashboardLayout>
    );
  }

  // Even with null data, render the content with appropriate empty states
  return (
    <DashboardLayout title={t('analytics')} subtitle={t('comprehensiveAnalysis')}>
      <AnalyticsContent analyticsData={analyticsData} />
    </DashboardLayout>
  );
};

export default Analytics;
