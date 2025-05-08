
import React, { useMemo } from "react";
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
  totalInvestment?: number;
}

export const InvestmentGrowthChart = ({ 
  data, 
  className,
  totalInvestment = 0
}: InvestmentGrowthChartProps) => {
  const { t } = useLanguage();

  // Prepare custom data with specific values for Jan, Mar, Apr
  const customData = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    return months.map(month => {
      // Default value from original data or 0
      let defaultValue = data.find(item => item.name === month)?.value || 0;
      
      // Special values for Jan, Mar, Apr
      if (month === 'Jan') {
        return { name: month, value: totalInvestment * 0.45 }; // 55% reduction = 45% of total
      } else if (month === 'Mar') {
        return { name: month, value: totalInvestment * 0.7 }; // 30% reduction = 70% of total
      } else if (month === 'Apr') {
        return { name: month, value: totalInvestment }; // Full investment
      } else {
        return { name: month, value: defaultValue };
      }
    });
  }, [data, totalInvestment]);
  
  // Calculate Y-axis domain for proper scaling
  const maxValue = Math.max(...customData.map(item => item.value || 0)) * 1.1; // 10% buffer

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{t('investmentGrowth')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={customData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis 
                axisLine={false} 
                tickLine={false}
                domain={[0, maxValue]}
                tickFormatter={(value) => {
                  if (value >= 1000000) {
                    return `AED${(value / 1000000).toFixed(1)}M`;
                  } else if (value >= 1000) {
                    return `AED${(value / 1000).toFixed(0)}k`;
                  }
                  return `AED${value}`;
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
