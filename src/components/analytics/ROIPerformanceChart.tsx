
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  TooltipProps,
  BarChart,
  Bar
} from "recharts";
import { useTheme } from "next-themes";
import { useState } from "react";

interface ROIPerformanceProps {
  data: Array<{
    month: string;
    roi: number;
    benchmark: number;
  }>;
  hasData?: boolean;
}

export const ROIPerformanceChart = ({ data, hasData = true }: ROIPerformanceProps) => {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [activeType, setActiveType] = useState<'line' | 'bar'>('line');
  
  // Generate default data if none exists
  const isEmpty = !hasData || !data || data.length === 0;
  const displayData = isEmpty 
    ? generateDefaultRoiPerformance() 
    : data;
  
  // Format data to ensure values are numbers and properly formatted
  const formattedData = displayData.map(item => ({
    month: item.month,
    roi: parseFloat(Number(item.roi).toFixed(2)),
    benchmark: parseFloat(Number(item.benchmark).toFixed(2))
  }));

  const formatTooltipValue = (value: number) => {
    return `${value.toFixed(2)}%`;
  };
  
  const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      const portfolioROI = payload[0].value;
      const marketROI = payload[1].value;
      
      return (
        <div className="bg-card border border-border p-3 rounded-lg shadow-md">
          <p className="font-medium text-foreground">{label}</p>
          <div className="mt-2 space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-easyroi-navy"></div>
              <p className="text-sm">
                {t('yourPortfolio')}: <span className="font-medium">{formatTooltipValue(portfolioROI)}</span>
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-easyroi-gold"></div>
              <p className="text-sm">
                {t('marketAverage')}: <span className="font-medium">{formatTooltipValue(marketROI)}</span>
              </p>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  const ChartControls = () => (
    <div className="flex justify-end mb-4">
      <div className="bg-background border border-border rounded-lg overflow-hidden flex">
        <button
          onClick={() => setActiveType('line')}
          className={`px-3 py-1 text-xs transition ${activeType === 'line' ? 'bg-muted font-medium' : 'hover:bg-muted/50'}`}
        >
          Line
        </button>
        <button
          onClick={() => setActiveType('bar')}
          className={`px-3 py-1 text-xs transition ${activeType === 'bar' ? 'bg-muted font-medium' : 'hover:bg-muted/50'}`}
        >
          Bar
        </button>
      </div>
    </div>
  );

  return (
    <Card className="shadow-md">
      <CardHeader className="pb-0">
        <CardTitle className="text-lg font-medium">{t('roiPerformance')} (2024)</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartControls />
        <div className="h-80">
          {isEmpty ? (
            <div className="flex flex-col items-center justify-center h-full">
              <p className="text-muted-foreground mb-2">{t('noInvestmentDataAvailable')}</p>
              <p className="text-sm text-muted-foreground">Dati disponibili nel Q2 2024</p>
            </div>
          ) : activeType === 'line' ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={formattedData}
                margin={{ top: 10, right: 10, left: 10, bottom: 5 }}
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
                <Tooltip content={<CustomTooltip />} />
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
                />
                <Line
                  type="monotone"
                  dataKey="benchmark"
                  name={t('marketAverage')}
                  stroke="#D4AF37"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={{ r: 3, fill: "#D4AF37" }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={formattedData}
                margin={{ top: 10, right: 10, left: 10, bottom: 5 }}
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
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  wrapperStyle={{ paddingTop: '15px' }}
                  iconType="circle"
                />
                <Bar
                  dataKey="roi"
                  name={t('yourPortfolio')}
                  fill="#0C2340"
                  radius={[4, 4, 0, 0]}
                  barSize={10}
                />
                <Bar
                  dataKey="benchmark"
                  name={t('marketAverage')}
                  fill="#D4AF37"
                  radius={[4, 4, 0, 0]}
                  barSize={10}
                />
              </BarChart>
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
