
import { useLanguage } from "@/contexts/LanguageContext";
import { TranslationKey } from "@/utils/translationUtils";
import en from "@/locales/en";

/**
 * Hook that provides a typed translation function
 * @returns A function that accepts only valid translation keys
 */
export function useTranslation() {
  const { t } = useLanguage();
  
  // This ensures we only accept valid translation keys
  return (key: TranslationKey) => t(key);
}
