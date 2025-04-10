
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import { InvestmentGrowth } from "@/services/dashboard/dashboardService";
import { cn } from "@/lib/utils";

interface InvestmentGrowthChartProps {
  data: InvestmentGrowth[];
  className?: string;
}

export const InvestmentGrowthChart = ({ data, className }: InvestmentGrowthChartProps) => {
  const { t } = useLanguage();

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{t('investmentGrowth')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tickFormatter={(value) => `€${Math.floor(value / 1000)}k`} 
              />
              <Tooltip 
                formatter={(value: number) => [`€${value.toLocaleString()}`, "Value"]} 
              />
              <Bar dataKey="value" fill="#D4AF37" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
