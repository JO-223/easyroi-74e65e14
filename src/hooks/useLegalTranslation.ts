
import { useLanguage } from "@/contexts/LanguageContext";
import { LegalKey } from "@/utils/translations/legal";

/**
 * A specialized hook that provides type-safe translations for legal-related keys
 */
export function useLegalTranslation() {
  const { t } = useLanguage();
  
  const tLegal = (key: LegalKey) => {
    return t(key as any);
  };
  
  return tLegal;
}
