
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  TooltipProps
} from "recharts";
import { useTheme } from "next-themes";

interface ROIPerformanceProps {
  data: Array<{
    month: string;
    roi: number;
    benchmark: number;
  }>;
}

export const ROIPerformanceChart = ({ data }: ROIPerformanceProps) => {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  // Generate default data if none exists
  const isEmpty = !data || data.length === 0;
  const displayData = isEmpty 
    ? generateDefaultRoiPerformance() 
    : data;

  const formatTooltipValue = (value: number) => {
    return `${value.toFixed(2)}%`;
  };

  return (
    <Card className="col-span-1 shadow-md">
      <CardHeader className="pb-0">
        <CardTitle className="text-lg font-medium">{t('roiPerformance')} (2024)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          {isEmpty ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground">{t('noInvestmentDataAvailable')}</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={displayData}
                margin={{ top: 20, right: 25, left: 15, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? "#333" : "#f0f0f0"} />
                <XAxis 
                  dataKey="month" 
                  axisLine={false} 
                  tickLine={false}
                  tick={{ fill: isDark ? '#ccc' : '#666' }}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  domain={[0, 'auto']}
                  tickFormatter={(value) => `${value}%`}
                  tick={{ fill: isDark ? '#ccc' : '#666' }}
                />
                <Tooltip 
                  formatter={(value: number) => [formatTooltipValue(value), ""]}
                  contentStyle={{
                    backgroundColor: isDark ? '#333' : '#fff',
                    border: `1px solid ${isDark ? '#555' : '#ddd'}`,
                    borderRadius: '6px',
                    padding: '8px 12px'
                  }}
                  labelStyle={{ color: isDark ? '#ccc' : '#333', fontWeight: 'bold', marginBottom: '5px' }}
                />
                <Legend 
                  wrapperStyle={{ paddingTop: '15px' }}
                  iconType="circle"
                />
                <Line
                  type="monotone"
                  dataKey="roi"
                  name={t('yourPortfolio')}
                  stroke="#0C2340"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: "#0C2340" }}
                  activeDot={{ r: 6 }}
                  isAnimationActive={true}
                />
                <Line
                  type="monotone"
                  dataKey="benchmark"
                  name={t('marketAverage')}
                  stroke="#D4AF37"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={{ r: 3, fill: "#D4AF37" }}
                  isAnimationActive={true}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// Generate default ROI performance data if none exists
function generateDefaultRoiPerformance() {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return months.map(month => ({
    month,
    roi: 0,
    benchmark: 3.2
  }));
}
