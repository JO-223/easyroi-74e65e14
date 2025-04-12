
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  Sector
} from "recharts";
import { useState } from "react";
import { useTheme } from "next-themes";

interface AllocationPieChartProps {
  title: string;
  data: Array<{
    name: string;
    value: number;
  }>;
  emptyMessage?: string;
}

const COLORS = ["#0C2340", "#D4AF37", "#4CAF50", "#6E59A5", "#E57373", "#64B5F6", "#FFB74D"];

// Default data for empty state
const DEFAULT_DATA = [{ name: "No Data", value: 100 }];

export const AllocationPieChart = ({ 
  title, 
  data, 
  emptyMessage = "No data available" 
}: AllocationPieChartProps) => {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const isEmpty = !data || data.length === 0;
  const [activeIndex, setActiveIndex] = useState<number | undefined>();

  const formatTooltipValue = (value: number) => {
    return `${value.toFixed(2)}%`;
  };

  const renderActiveShape = (props: any) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;
  
    return (
      <g>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius + 6}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
      </g>
    );
  };

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  const onPieLeave = () => {
    setActiveIndex(undefined);
  };

  return (
    <Card className="shadow-md">
      <CardHeader className="pb-0">
        <CardTitle className="text-lg font-medium">{title}</CardTitle>
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
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                  activeIndex={activeIndex}
                  activeShape={renderActiveShape}
                  onMouseEnter={onPieEnter}
                  onMouseLeave={onPieLeave}
                  isAnimationActive={true}
                >
                  {data.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={COLORS[index % COLORS.length]} 
                      stroke={isDark ? '#222' : '#fff'}
                      strokeWidth={1}
                    />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => [formatTooltipValue(value), t('allocation')]}
                  contentStyle={{
                    backgroundColor: isDark ? '#333' : '#fff',
                    border: `1px solid ${isDark ? '#555' : '#ddd'}`,
                    borderRadius: '6px',
                    padding: '8px 12px'
                  }}
                  labelStyle={{ color: isDark ? '#ccc' : '#333', fontWeight: 'bold', marginBottom: '5px' }}
                />
                <Legend 
                  layout="horizontal" 
                  verticalAlign="bottom" 
                  align="center"
                  iconType="circle"
                  iconSize={8}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
