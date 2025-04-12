
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  Sector,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LabelList
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

export const AllocationPieChart = ({ 
  title, 
  data, 
  emptyMessage = "No data available" 
}: AllocationPieChartProps) => {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [activeIndex, setActiveIndex] = useState<number | undefined>();
  const [chartType, setChartType] = useState<'pie' | 'bar'>(data && data.length > 1 ? 'pie' : 'bar');
  
  const isEmpty = !data || data.length === 0;
  // Format data to ensure values have at most 2 decimal places
  const formattedData = data ? data.map(item => ({
    name: item.name,
    value: parseFloat(Number(item.value).toFixed(2))
  })) : [];

  // If we only have a single location with allocation close to or equal to 100%
  const hasSingleLocation = data && data.length === 1;

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

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border p-3 rounded-lg shadow-md">
          <p className="font-medium">{payload[0].name}</p>
          <p className="text-sm">
            {t('allocation')}: <span className="font-medium">{formatTooltipValue(payload[0].value)}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  const SingleLocationCard = () => {
    if (!hasSingleLocation || isEmpty) return null;
    
    return (
      <div className="flex flex-col items-center justify-center h-48 text-center">
        <div className="w-16 h-16 rounded-full bg-easyroi-navy flex items-center justify-center mb-3">
          <span className="text-white font-bold text-xl">100%</span>
        </div>
        <p className="text-lg font-medium">{formattedData[0].name}</p>
        <p className="text-sm text-muted-foreground mt-1">
          {t('singleLocationAllocation', { 
            location: formattedData[0].name,
            percentage: formattedData[0].value.toFixed(2)
          })}
        </p>
      </div>
    );
  };
  
  const ChartControls = () => {
    // Only show controls if we have multiple locations
    if (isEmpty || data.length <= 1) return null;
    
    return (
      <div className="flex justify-end mb-4">
        <div className="bg-background border border-border rounded-lg overflow-hidden flex">
          <button
            onClick={() => setChartType('pie')}
            className={`px-3 py-1 text-xs transition ${chartType === 'pie' ? 'bg-muted font-medium' : 'hover:bg-muted/50'}`}
          >
            Pie
          </button>
          <button
            onClick={() => setChartType('bar')}
            className={`px-3 py-1 text-xs transition ${chartType === 'bar' ? 'bg-muted font-medium' : 'hover:bg-muted/50'}`}
          >
            Bar
          </button>
        </div>
      </div>
    );
  };

  return (
    <Card className="shadow-md">
      <CardHeader className="pb-0">
        <CardTitle className="text-lg font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartControls />
        <div className="h-64">
          {isEmpty ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground">{emptyMessage}</p>
            </div>
          ) : hasSingleLocation ? (
            <SingleLocationCard />
          ) : chartType === 'pie' ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={formattedData}
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
                >
                  {formattedData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={COLORS[index % COLORS.length]} 
                      stroke={isDark ? '#222' : '#fff'}
                      strokeWidth={1}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  layout="horizontal" 
                  verticalAlign="bottom" 
                  align="center"
                  iconType="circle"
                  iconSize={8}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={formattedData}
                margin={{ top: 5, right: 30, left: 50, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                <XAxis 
                  type="number" 
                  domain={[0, 100]} 
                  tickFormatter={(value) => `${value}%`}
                />
                <YAxis 
                  type="category" 
                  dataKey="name"
                  width={100}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" fill="#0C2340" radius={[0, 4, 4, 0]}>
                  {formattedData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                  <LabelList dataKey="value" position="right" formatter={(value: number) => `${value.toFixed(2)}%`} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
