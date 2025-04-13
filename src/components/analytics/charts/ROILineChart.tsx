
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer 
} from "recharts";
import { useTheme } from "next-themes";
import { useLanguage } from "@/contexts/LanguageContext";
import { ROITooltip } from "./ROITooltip";

interface ROILineChartProps {
  data: Array<{
    month: string;
    roi: number;
    benchmark: number;
  }>;
}

export const ROILineChart = ({ data }: ROILineChartProps) => {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={data}
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
        <Tooltip content={<ROITooltip />} />
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
  );
};
