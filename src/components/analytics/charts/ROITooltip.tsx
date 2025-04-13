
import { TooltipProps } from "recharts";
import { useLanguage } from "@/contexts/LanguageContext";

interface CustomTooltipProps extends TooltipProps<number, string> {}

export const ROITooltip = ({ active, payload, label }: CustomTooltipProps) => {
  const { t } = useLanguage();
  
  const formatTooltipValue = (value: number) => {
    return `${value.toFixed(2)}%`;
  };

  if (active && payload && payload.length) {
    const portfolioROI = payload[0].value as number;
    const marketROI = payload[1].value as number;
    
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
