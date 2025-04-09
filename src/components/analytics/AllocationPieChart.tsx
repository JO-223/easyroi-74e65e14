
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend
} from "recharts";

interface AllocationPieChartProps {
  title: string;
  data: Array<{
    name: string;
    value: number;
  }>;
  emptyMessage?: string;
}

const COLORS = ["#0C2340", "#D4AF37", "#4CAF50", "#6E59A5"];

// Default data for empty state
const DEFAULT_DATA = [{ name: "No Data", value: 100 }];

export const AllocationPieChart = ({ 
  title, 
  data, 
  emptyMessage = "No data available" 
}: AllocationPieChartProps) => {
  const { t } = useLanguage();
  const isEmpty = !data || data.length === 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          {isEmpty ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground">{emptyMessage}</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, t('allocation')]} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
