
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { Skeleton } from '@/components/ui/skeleton';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { InvestmentGrowth } from '@/types/portfolio';

interface InvestmentChartProps {
  growthData: InvestmentGrowth[];
  isLoading?: boolean;
}

export function InvestmentChart({ growthData, isLoading = false }: InvestmentChartProps) {
  const { t } = useLanguage();
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-4 w-24" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-60 w-full" />
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("investmentGrowth")}</CardTitle>
        <CardDescription>{t("lastYear")}</CardDescription>
      </CardHeader>
      <CardContent>
        {growthData.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-60">
            <p className="text-lg font-semibold">{t("noData")}</p>
            <p className="text-sm text-muted-foreground">{t("noDataFound")}</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart
              data={growthData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="month" 
                tick={{ fontSize: 12 }} 
                tickMargin={10}
              />
              <YAxis 
                tick={{ fontSize: 12 }} 
                tickFormatter={(value) => {
                  if (value >= 1000000) return `${value / 1000000}M`;
                  if (value >= 1000) return `${value / 1000}K`;
                  return value;
                }}
              />
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <Tooltip 
                formatter={(value: any) => [`€${Number(value).toLocaleString()}`, t("value")]}
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  padding: "8px"
                }}
              />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="#8884d8" 
                fillOpacity={1} 
                fill="url(#colorValue)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
