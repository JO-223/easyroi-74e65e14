
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { useTheme } from "next-themes";
import { CHART_COLORS } from "@/utils/chartConstants";

interface AllocationPieChartProps {
  title: string;
  data: Array<{
    name: string;
    value: number;
  }>;
  emptyMessage?: string;
  hasData?: boolean;
}

export const AllocationPieChart = ({ 
  title, 
  data, 
  emptyMessage,
  hasData = true
}: AllocationPieChartProps) => {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  
  // Check if we have valid data to display
  const isEmpty = !hasData || !data || data.length === 0 || data.every(item => item.value === 0);
  
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[250px]">
          {isEmpty ? (
            <div className="flex flex-col items-center justify-center h-full">
              <p className="text-muted-foreground font-medium">{emptyMessage || t('noDataAvailable')}</p>
              <p className="text-sm text-muted-foreground mt-1">{t('dataWillAppearSoon')}</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {data.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={CHART_COLORS[index % CHART_COLORS.length]} 
                    />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => `${value.toFixed(1)}%`}
                  contentStyle={{
                    backgroundColor: isDark ? "#1f2937" : "#fff",
                    border: `1px solid ${isDark ? "#374151" : "#e5e7eb"}`,
                    borderRadius: "0.375rem",
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
