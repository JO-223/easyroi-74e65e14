
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
                // Improved label styling for better readability
                label={({ name, percent }) => {
                  return `${name}: ${(percent * 100).toFixed(0)}%`;
                }}
                labelLine={{ stroke: "#666", strokeWidth: 1 }}
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[index % COLORS.length]} 
                    stroke="#fff"
                    strokeWidth={1}
                  />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number) => [`${value.toFixed(2)}%`, t('allocation')]}
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #ccc",
                  padding: "10px",
                  borderRadius: "4px",
                  boxShadow: "0px 0px 10px rgba(0,0,0,0.1)"
                }}
                labelStyle={{
                  fontWeight: "bold",
                  marginBottom: "5px"
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
