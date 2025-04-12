
import { useLanguage } from "@/contexts/LanguageContext";
import { TranslationKey } from "@/utils/translationUtils";

/**
 * Hook that provides a typed translation function
 * @returns A function that accepts translation keys and optional parameters
 */
export function useTranslation() {
  const { t } = useLanguage();
  return t;
}
