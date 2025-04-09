
import { useLanguage } from "@/contexts/LanguageContext";
import { AllocationPieChart } from "./AllocationPieChart";

interface PortfolioBreakdownProps {
  assetAllocation: Array<{
    name: string;
    value: number;
  }>;
  geographicDistribution: Array<{
    name: string;
    value: number;
  }>;
}

export const PortfolioBreakdown = ({ 
  assetAllocation, 
  geographicDistribution 
}: PortfolioBreakdownProps) => {
  const { t } = useLanguage();
  
  // We always render both pie charts, even if data is empty
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <AllocationPieChart 
        title={t('assetAllocation')}
        data={assetAllocation}
        emptyMessage={t('noAssetAllocationData')}
      />
      <AllocationPieChart 
        title={t('geographicDistribution')}
        data={geographicDistribution}
        emptyMessage={t('noGeographicData')}
      />
    </div>
  );
};
