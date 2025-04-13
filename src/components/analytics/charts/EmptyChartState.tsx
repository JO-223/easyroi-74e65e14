
import { useLanguage } from "@/contexts/LanguageContext";

export const EmptyChartState = () => {
  const { t } = useLanguage();
  
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <p className="text-muted-foreground mb-2">{t('noInvestmentDataAvailable')}</p>
      <p className="text-sm text-muted-foreground">Dati disponibili nel Q2 2024</p>
    </div>
  );
};
