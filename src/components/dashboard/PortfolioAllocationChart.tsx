
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { Skeleton } from '@/components/ui/skeleton';
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { PortfolioAllocation } from '@/types/portfolio';

interface PortfolioAllocationChartProps {
  allocationData: PortfolioAllocation[];
  isLoading?: boolean;
}

export function PortfolioAllocationChart({ allocationData, isLoading = false }: PortfolioAllocationChartProps) {
  const { t } = useLanguage();
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];
  
  // Transform data format for chart - convert from PortfolioAllocation to the format expected by the chart
  const chartData = allocationData.map(item => ({
    name: item.location,
    value: item.percentage
  }));
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-4 w-32" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-40 w-full" />
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("portfolioAllocation")}</CardTitle>
        <CardDescription>{t("investmentByCountry")}</CardDescription>
      </CardHeader>
      <CardContent>
        {chartData.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40">
            <p className="text-lg font-semibold">{t("noDataAvailable")}</p>
            <p className="text-sm text-muted-foreground">{t("dataWillAppearSoon")}</p>
          </div>
        ) : chartData.length === 1 ? (
          <div className="flex flex-col items-center justify-center h-40">
            <p className="text-lg font-semibold">{t("singleLocationAllocation")}</p>
            <p>{chartData[0].name}: 100%</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                outerRadius={60}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                labelLine={false}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend layout="horizontal" verticalAlign="bottom" align="center" />
              <Tooltip formatter={(value) => `${value}%`} />
            </PieChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
