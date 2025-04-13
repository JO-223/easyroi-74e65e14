
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { Skeleton } from '@/components/ui/skeleton';
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

interface PortfolioAllocationProps {
  isLoading?: boolean;
}

export function PortfolioAllocation({ isLoading = false }: PortfolioAllocationProps) {
  const { t } = useLanguage();
  
  // Demo data for display
  const data = [
    { location: "Dubai", percentage: 40 },
    { location: "London", percentage: 30 },
    { location: "New York", percentage: 20 },
    { location: "Other", percentage: 10 }
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];
  
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
        {data.length === 1 ? (
          <div className="flex flex-col items-center justify-center h-40">
            <p className="text-lg font-semibold">{t("singleLocationAllocation")}</p>
            <p>{data[0].location}: 100%</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                outerRadius={60}
                fill="#8884d8"
                dataKey="percentage"
                nameKey="location"
                labelLine={false}
              >
                {data.map((entry, index) => (
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
