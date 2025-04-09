
import { Language } from "@/contexts/LanguageContext";
import en from "@/locales/en";

// Type to ensure type safety when accessing translation keys
export type TranslationKey = keyof typeof en;

/**
 * Creates a translation function with a safe fallback to English
 * @param translations The translations object containing all languages
 * @param currentLanguage The current language setting
 * @returns A function that translates keys with fallbacks
 */
export const createTranslator = (
  translations: Record<Language, Record<string, string>>,
  currentLanguage: Language
) => {
  return (key: string) => {
    // Try to get the translation in the current language
    const translation = translations[currentLanguage]?.[key];
    
    if (translation) {
      return translation;
    }
    
    // Fallback to English if the key exists there
    const englishTranslation = translations.english?.[key];
    if (englishTranslation) {
      return englishTranslation;
    }
    
    // If we're in development, show a missing key indicator
    if (process.env.NODE_ENV === "development") {
      console.warn(`Translation key not found: ${key}`);
      return `[missing key: ${key}]`;
    }
    
    // Last resort: return the key itself
    return key;
  };
};

/**
 * Typed version of the translator that provides type checking for translation keys
 */
export const createTypedTranslator = (
  translations: Record<Language, Record<string, string>>,
  currentLanguage: Language
) => {
  const translator = createTranslator(translations, currentLanguage);
  return (key: TranslationKey) => translator(key);
};
