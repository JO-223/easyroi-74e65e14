
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer 
} from "recharts";
import { useTheme } from "next-themes";
import { useLanguage } from "@/contexts/LanguageContext";
import { ROITooltip } from "./ROITooltip";

interface ROIBarChartProps {
  data: Array<{
    month: string;
    roi: number;
    benchmark: number;
  }>;
}

export const ROIBarChart = ({ data }: ROIBarChartProps) => {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
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
  );
};
