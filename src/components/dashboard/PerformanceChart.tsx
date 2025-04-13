
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { useQuery } from "@tanstack/react-query";
import { fetchInvestmentGrowth } from "@/services/portfolioService";
import { Skeleton } from "@/components/ui/skeleton";

export function PerformanceChart({ isLoading = false }: { isLoading?: boolean }) {
  const { t } = useLanguage();
  
  const { data: growthData } = useQuery({
    queryKey: ['investmentGrowth'],
    queryFn: fetchInvestmentGrowth,
    enabled: !isLoading,
  });
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle><Skeleton className="h-6 w-48" /></CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <Skeleton className="h-full w-full rounded-lg opacity-50" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('portfolioPerformance')}</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px]">
        {growthData && growthData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={growthData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="month" 
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                tickFormatter={(value) => `€${value / 1000}k`}
                tick={{ fontSize: 12 }}
              />
              <Tooltip 
                formatter={(value) => [`€${value.toLocaleString()}`, t('value')]} 
                labelFormatter={(label) => label}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#36B37E"
                activeDot={{ r: 8 }}
                name={t('investment')}
              />
            </LineChart>
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
