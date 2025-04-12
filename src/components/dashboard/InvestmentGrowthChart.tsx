
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
import { formatCurrency } from "@/services/dashboard/dashboardService";

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
                // Improved formatter to show M for millions
                tickFormatter={(value) => {
                  if (value >= 1000000) {
                    return `€${(value / 1000000).toFixed(1)}M`;
                  } else if (value >= 1000) {
                    return `€${(value / 1000).toFixed(0)}k`;
                  }
                  return `€${value}`;
                }}
              />
              <Tooltip 
                formatter={(value: number) => [formatCurrency(value), "Value"]}
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #ccc",
                  padding: "10px",
                  borderRadius: "4px"
                }}
              />
              <Bar dataKey="value" fill="#D4AF37" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
