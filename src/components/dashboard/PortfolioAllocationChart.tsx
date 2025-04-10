
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import { PortfolioAllocation } from "@/services/dashboard/dashboardService";

interface PortfolioAllocationChartProps {
  data: PortfolioAllocation[];
}

export const PortfolioAllocationChart = ({ data }: PortfolioAllocationChartProps) => {
  const { t } = useLanguage();
  
  // Define chart colors with better contrast
  const COLORS = ["#0C2340", "#D4AF37", "#4CAF50", "#E57373", "#5C6BC0", "#FFB74D"];

  // Check if we have data to display
  const hasData = data && data.length > 0;

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded shadow">
          <p className="text-sm font-medium">{payload[0].name}</p>
          <p className="text-sm text-gray-800 font-bold">
            {`${payload[0].value}%`}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('portfolioAllocation')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64 flex items-center justify-center">
          {hasData ? (
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
                <Tooltip content={<CustomTooltip />} />
                <Legend formatter={(value) => <span className="text-sm">{value}</span>} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-muted-foreground">{t('noAllocationData')}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
