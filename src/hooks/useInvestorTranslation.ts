
import { useLanguage } from "@/contexts/LanguageContext";
import { InvestorKey } from "@/utils/translations/investor";

/**
 * A specialized hook that provides type-safe translations for investor-related keys
 */
export function useInvestorTranslation() {
  const { t } = useLanguage();
  
  const tInvestor = (key: InvestorKey) => {
    return t(key as any);
  };
  
  return tInvestor;
}
