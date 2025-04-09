
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";

interface ROIPerformanceProps {
  data: Array<{
    month: string;
    roi: number;
    benchmark: number;
  }>;
}

export const ROIPerformanceChart = ({ data }: ROIPerformanceProps) => {
  const { t } = useLanguage();

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>{t('roiPerformance')} (2024)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                domain={[0, 'auto']}
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip formatter={(value) => [`${value}%`, "ROI"]} />
              <Legend />
              <Line
                type="monotone"
                dataKey="roi"
                name={t('yourPortfolio')}
                stroke="#0C2340"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="benchmark"
                name={t('marketAverage')}
                stroke="#D4AF37"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
