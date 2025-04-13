
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';

interface PerformanceData {
  month: string;
  roi: number;
  benchmark: number;
}

interface PropertyPerformanceProps {
  data: PerformanceData[];
}

export const PropertyPerformance = ({ data }: PropertyPerformanceProps) => {
  const { t } = useLanguage();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('portfolioPerformance')}</CardTitle>
        <CardDescription>{t('comparedToMarket')}</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart
            data={data}
            margin={{
              top: 5, right: 30, left: 20, bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis 
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip 
              formatter={(value) => [`${value}%`]}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="roi" 
              stroke="#8884d8" 
              name="Your Portfolio" 
              activeDot={{ r: 8 }} 
            />
            <Line 
              type="monotone" 
              dataKey="benchmark" 
              stroke="#82ca9d" 
              name="Market Average" 
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
