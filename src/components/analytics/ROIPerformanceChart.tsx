
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartControls } from "./charts/ChartControls";
import { ROILineChart } from "./charts/ROILineChart";
import { ROIBarChart } from "./charts/ROIBarChart";
import { EmptyChartState } from "./charts/EmptyChartState";
import { generateDefaultRoiPerformance } from "./charts/helpers";

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

  const renderChart = () => {
    if (isEmpty) {
      return <EmptyChartState />;
    }

    return activeType === 'line' 
      ? <ROILineChart data={formattedData} /> 
      : <ROIBarChart data={formattedData} />;
  };

  return (
    <Card className="shadow-md">
      <CardHeader className="pb-0">
        <CardTitle className="text-lg font-medium">{t('roiPerformance')} (2024)</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartControls activeType={activeType} setActiveType={setActiveType} />
        <div className="h-80">
          {renderChart()}
        </div>
      </CardContent>
    </Card>
  );
};
