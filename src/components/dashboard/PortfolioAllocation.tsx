
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { ResponsiveContainer, PieChart, Pie, Cell, Legend, Tooltip } from "recharts";
import { useQuery } from "@tanstack/react-query";
import { fetchPortfolioAllocation } from "@/services/portfolioService";
import { Skeleton } from "@/components/ui/skeleton";

const COLORS = ['#36B37E', '#00B8D9', '#6554C0', '#FF5630', '#FFAB00', '#5243AA', '#0052CC'];

export function PortfolioAllocation({ isLoading = false }: { isLoading?: boolean }) {
  const { t } = useLanguage();

  const { data: allocation } = useQuery({
    queryKey: ['portfolioAllocation'],
    queryFn: fetchPortfolioAllocation,
    enabled: !isLoading,
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle><Skeleton className="h-6 w-48" /></CardTitle>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          <Skeleton className="h-full w-full rounded-lg opacity-50" />
        </CardContent>
      </Card>
    );
  }

  // If we have only one location, display text instead of pie chart
  if (allocation && allocation.length === 1) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t('portfolioAllocation')}</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          <div className="text-center">
            <p className="text-lg font-medium">{t('singleLocationAllocation')}</p>
            <p className="text-3xl font-bold mt-2">{allocation[0].location}</p>
            <p className="text-muted-foreground mt-2">100%</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('portfolioAllocation')}</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px]">
        {allocation && allocation.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={allocation}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="percentage"
                nameKey="location"
                label={({ location, percentage }) => `${location}: ${percentage}%`}
              >
                {allocation.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${value}%`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center">
            <p className="text-muted-foreground">{t('noData')}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
