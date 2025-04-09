
import React from "react";
import { Percent, TrendingUp, LineChart } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { MetricsCard } from "./MetricsCard";
import { AnalyticsData } from "@/services/analytics/analyticsService";

interface MetricsSectionProps {
  analyticsData: AnalyticsData;
}

export const MetricsSection = ({ analyticsData }: MetricsSectionProps) => {
  const { t } = useLanguage();
  
  const metrics = [
    {
      title: t('portfolioROI'),
      value: analyticsData?.portfolioROI?.value !== undefined ? 
        `${analyticsData.portfolioROI.value}%` : 
        '–',
      change: analyticsData?.portfolioROI?.change !== null && analyticsData?.portfolioROI?.change !== undefined ? 
        `${analyticsData.portfolioROI.change > 0 ? '+' : ''}${analyticsData.portfolioROI.change}%` : 
        t('noHistoricalData'),
      isPositive: analyticsData?.portfolioROI?.change !== null ? analyticsData?.portfolioROI?.change >= 0 : true,
      icon: Percent,
      description: t('vsPreviousYear'),
    },
    {
      title: t('annualGrowth'),
      value: analyticsData?.annualGrowth?.value !== undefined ? 
        `${analyticsData.annualGrowth.value}%` : 
        '–',
      change: analyticsData?.annualGrowth?.change !== null && analyticsData?.annualGrowth?.change !== undefined ? 
        `${analyticsData.annualGrowth.change > 0 ? '+' : ''}${analyticsData.annualGrowth.change}%` : 
        t('noHistoricalData'),
      isPositive: analyticsData?.annualGrowth?.change !== null ? analyticsData?.annualGrowth?.change >= 0 : true,
      icon: TrendingUp,
      description: t('vsPreviousYear'),
    },
    {
      title: t('marketComparison'),
      value: analyticsData?.marketComparison?.value !== undefined ? 
        `${analyticsData.marketComparison.status === 'above' ? '+' : '-'}${analyticsData.marketComparison.value}%` : 
        '–',
      change: analyticsData?.marketComparison?.status === 'above' ? 
        t('aboveIndex') : 
        t('marketVolatility'),
      isPositive: analyticsData?.marketComparison?.status === 'above',
      icon: LineChart,
      description: t('vsMarketAverage'),
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {metrics.map((metric) => (
        <MetricsCard
          key={metric.title}
          title={metric.title}
          value={metric.value}
          change={metric.change}
          isPositive={metric.isPositive}
          icon={metric.icon}
          description={metric.description}
        />
      ))}
    </div>
  );
};
