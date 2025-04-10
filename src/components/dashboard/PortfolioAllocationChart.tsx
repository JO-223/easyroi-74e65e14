
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import { PortfolioAllocation } from "@/services/dashboard/dashboardService";

interface PortfolioAllocationChartProps {
  data: PortfolioAllocation[];
}

export const PortfolioAllocationChart = ({ data }: PortfolioAllocationChartProps) => {
  const { t } = useLanguage();
  
  // Define chart colors
  const COLORS = ["#0C2340", "#D4AF37", "#4CAF50", "#E57373"];

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('portfolioAllocation')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64 flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value}%`, t('allocation')]} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
