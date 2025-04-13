import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchAnalyticsData } from '@/services/analyticsService';
import { useLanguage } from '@/contexts/LanguageContext';
import { AnalyticsData } from '@/types/analytics';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertTriangle } from 'lucide-react';

interface AnalyticsContentProps {
  analyticsData: AnalyticsData;
}

export const AnalyticsContent: React.FC<AnalyticsContentProps> = ({ analyticsData }) => {
  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle>Total Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{analyticsData.totalUsers}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Total Properties</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{analyticsData.totalProperties}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Average Investment per User</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${analyticsData.averageInvestmentPerUser.toFixed(2)}</div>
        </CardContent>
      </Card>
    </div>
  );
};

const AnalyticsLoading = () => {
  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <Card key={i}>
          <CardHeader>
            <Skeleton className="h-5 w-40" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-32" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

const AnalyticsError = () => {
  return (
    <div className="flex items-center justify-center h-48">
      <AlertTriangle className="h-10 w-10 text-red-500 mr-2" />
      <p className="text-red-500">Failed to load analytics data.</p>
    </div>
  );
};

const Analytics = () => {
  const { t } = useLanguage();

  const { data, isLoading, error } = useQuery({
    queryKey: ['analyticsData'],
    queryFn: fetchAnalyticsData,
    retry: false,
  });

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">{t('analytics')}</h1>
      {isLoading ? (
        <AnalyticsLoading />
      ) : error ? (
        <AnalyticsError />
      ) : (
        <AnalyticsContent analyticsData={data} />
      )}
    </div>
  );
};

export default Analytics;
