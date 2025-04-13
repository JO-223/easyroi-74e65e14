
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface PerformanceChartProps {
  isLoading?: boolean;
}

export function PerformanceChart({ isLoading = false }: PerformanceChartProps) {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('monthly');
  
  // Demo data for display
  const monthlyData = [
    { month: 'Jan', value: 2000 },
    { month: 'Feb', value: 2100 },
    { month: 'Mar', value: 1900 },
    { month: 'Apr', value: 2400 },
    { month: 'May', value: 2200 },
    { month: 'Jun', value: 2600 },
    { month: 'Jul', value: 2800 },
    { month: 'Aug', value: 3000 },
    { month: 'Sep', value: 3200 },
    { month: 'Oct', value: 3400 },
    { month: 'Nov', value: 3600 },
    { month: 'Dec', value: 3800 }
  ];
  
  const yearlyData = [
    { year: '2018', value: 20000 },
    { year: '2019', value: 24000 },
    { year: '2020', value: 22000 },
    { year: '2021', value: 28000 },
    { year: '2022', value: 34000 },
    { year: '2023', value: 40000 },
    { year: '2024', value: 38000 }
  ];
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-4 w-32" />
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
        <CardTitle>{t("portfolioPerformance")}</CardTitle>
        <Tabs defaultValue="monthly" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 w-60">
            <TabsTrigger value="monthly">{t("monthlyReturns")}</TabsTrigger>
            <TabsTrigger value="yearly">{t("yearlyGrowth")}</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent className="pl-0">
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart
            data={activeTab === 'monthly' ? monthlyData : yearlyData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis 
              dataKey={activeTab === 'monthly' ? 'month' : 'year'} 
              tick={{ fontSize: 12 }} 
            />
            <YAxis tick={{ fontSize: 12 }} />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip formatter={(value) => `$${value}`} />
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke="#8884d8" 
              fillOpacity={1} 
              fill="url(#colorValue)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
