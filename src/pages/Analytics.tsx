
import { useQuery } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { useLanguage } from "@/contexts/LanguageContext";
import { fetchAnalyticsData } from "@/services/analytics/analyticsService";
import { AnalyticsContent } from "@/components/analytics/AnalyticsContent";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

const Analytics = () => {
  const { t } = useLanguage();
  
  // Fetch analytics data with React Query
  const { data: analyticsData, isLoading, error, refetch } = useQuery({
    queryKey: ['analyticsData'],
    queryFn: fetchAnalyticsData,
    staleTime: 30000, // Consider data fresh for 30 seconds
    refetchOnWindowFocus: true, // Refresh when window regains focus
  });
  
  // Set up a subscription to property changes to refresh analytics
  useEffect(() => {
    const channel = supabase
      .channel('public:properties')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'properties' },
        () => {
          // Refetch analytics data when properties change
          refetch();
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [refetch]);

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
