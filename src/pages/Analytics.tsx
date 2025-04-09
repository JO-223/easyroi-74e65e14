
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowDown, ArrowUp, LineChart, Percent, TrendingUp } from "lucide-react";
import {
  LineChart as RechartsLineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";
import { useLanguage } from "@/contexts/LanguageContext";
import { fetchAnalyticsData, AnalyticsData } from "@/services/analytics/analyticsService";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";

const Analytics = () => {
  const { t } = useLanguage();
  
  // Fetch analytics data with React Query
  const { data: analyticsData, isLoading, error } = useQuery({
    queryKey: ['analyticsData'],
    queryFn: fetchAnalyticsData,
  });

  const COLORS = ["#0C2340", "#D4AF37", "#4CAF50", "#6E59A5"];
  
  // Generate metrics based on real data
  const metrics = analyticsData ? [
    {
      title: t('portfolioROI'),
      value: `${analyticsData.portfolioROI.value}%`,
      change: analyticsData.portfolioROI.change !== null ? 
        `${analyticsData.portfolioROI.change > 0 ? '+' : ''}${analyticsData.portfolioROI.change}%` : 
        t('noHistoricalData'),
      isPositive: analyticsData.portfolioROI.change !== null ? analyticsData.portfolioROI.change >= 0 : true,
      icon: Percent,
      description: t('vsPreviousYear'),
    },
    {
      title: t('annualGrowth'),
      value: `${analyticsData.annualGrowth.value}%`,
      change: analyticsData.annualGrowth.change !== null ? 
        `${analyticsData.annualGrowth.change > 0 ? '+' : ''}${analyticsData.annualGrowth.change}%` : 
        t('noHistoricalData'),
      isPositive: analyticsData.annualGrowth.change !== null ? analyticsData.annualGrowth.change >= 0 : true,
      icon: TrendingUp,
      description: t('vsPreviousYear'),
    },
    {
      title: t('marketComparison'),
      value: `${analyticsData.marketComparison.status === 'above' ? '+' : '-'}${analyticsData.marketComparison.value}%`,
      change: analyticsData.marketComparison.status === 'above' ? 
        t('aboveIndex') : 
        t('marketVolatility'),
      isPositive: analyticsData.marketComparison.status === 'above',
      icon: LineChart,
      description: t('vsMarketAverage'),
    },
  ] : [];

  // Show loading state or error state while data is being fetched
  if (isLoading) {
    return (
      <DashboardLayout title={t('analytics')} subtitle={t('comprehensiveAnalysis')}>
        <div className="flex items-center justify-center h-96">
          <p className="text-lg text-muted-foreground">{t('loading')}...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !analyticsData) {
    return (
      <DashboardLayout title={t('analytics')} subtitle={t('comprehensiveAnalysis')}>
        <div className="flex items-center justify-center h-96">
          <p className="text-lg text-easyroi-danger">{t('errorLoadingData')}</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title={t('analytics')} subtitle={t('comprehensiveAnalysis')}>
      <div className="grid gap-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {metrics.map((metric) => (
            <Card key={metric.title}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{metric.title}</p>
                    <p className="text-2xl font-bold">{metric.value}</p>
                    <p className={`text-xs ${metric.isPositive ? "text-easyroi-success" : "text-easyroi-danger"} flex items-center mt-1`}>
                      {metric.change} <span className="text-gray-500 ml-1">{metric.description}</span>
                    </p>
                  </div>
                  <div className="bg-easyroi-navy/10 p-3 rounded-full">
                    <metric.icon className="h-5 w-5 text-easyroi-navy" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Performance Chart */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>{t('roiPerformance')} (2024)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsLineChart
                  data={analyticsData.roiPerformance}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    domain={[0, 'auto']}
                    tickFormatter={(value) => `${value}%`}
                  />
                  <Tooltip formatter={(value) => [`${value}%`, "ROI"]} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="roi"
                    name={t('yourPortfolio')}
                    stroke="#0C2340"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="benchmark"
                    name={t('marketAverage')}
                    stroke="#D4AF37"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={{ r: 4 }}
                  />
                </RechartsLineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Portfolio Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Asset Allocation */}
          <Card>
            <CardHeader>
              <CardTitle>{t('assetAllocation')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={analyticsData.assetAllocation}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {analyticsData.assetAllocation.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value}%`, t('allocation')]} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Geographic Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>{t('geographicDistribution')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={analyticsData.geographicDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {analyticsData.geographicDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value}%`, t('allocation')]} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Historical Performance / Events Attended */}
        <Card>
          <CardHeader>
            <CardTitle>{t('eventsAttended')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <p className="text-5xl font-bold">{analyticsData.eventsAttended}</p>
                <p className="text-muted-foreground mt-2">{t('totalEvents')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Analytics;
