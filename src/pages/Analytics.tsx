
import { useQuery } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { useLanguage } from "@/contexts/LanguageContext";
import { fetchAnalyticsData } from "@/services/analytics/analyticsService";
import { AnalyticsContent } from "@/components/analytics/AnalyticsContent";

const Analytics = () => {
  const { t } = useLanguage();
  
  // Fetch analytics data with React Query
  const { data: analyticsData, isLoading, error } = useQuery({
    queryKey: ['analyticsData'],
    queryFn: fetchAnalyticsData,
  });

  // Show loading state while data is being fetched
  if (isLoading) {
    return (
      <DashboardLayout title={t('analytics')} subtitle={t('comprehensiveAnalysis')}>
        <div className="flex items-center justify-center h-96">
          <p className="text-lg text-muted-foreground">{t('loading')}...</p>
        </div>
      </DashboardLayout>
    );
  }

  // Only show error if we have an actual error fetching data
  if (error) {
    return (
      <DashboardLayout title={t('analytics')} subtitle={t('comprehensiveAnalysis')}>
        <div className="flex items-center justify-center h-96">
          <p className="text-lg text-easyroi-danger">{t('errorLoadingData')}</p>
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
