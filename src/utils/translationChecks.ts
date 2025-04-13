
import en from "@/locales/en";
import it from "@/locales/it";
import es from "@/locales/es";
import de from "@/locales/de";
import { TranslationValue } from "@/contexts/LanguageContext";

/**
 * Utility to check for missing translation keys between locales
 * Used during development to ensure all locales have the same keys
 */
export const checkMissingTranslationKeys = () => {
  const enKeys = Object.keys(en);
  const itKeys = Object.keys(it);
  const esKeys = Object.keys(es);
  const deKeys = Object.keys(de);
  
  // Check for keys in English that are missing in other locales
  const missingInItalian = enKeys.filter(key => !itKeys.includes(key));
  const missingInSpanish = enKeys.filter(key => !esKeys.includes(key));
  const missingInGerman = enKeys.filter(key => !deKeys.includes(key));
  
  if (missingInItalian.length > 0) {
    console.warn('Keys missing in Italian:', missingInItalian);
  }
  
  if (missingInSpanish.length > 0) {
    console.warn('Keys missing in Spanish:', missingInSpanish);
  }
  
  if (missingInGerman.length > 0) {
    console.warn('Keys missing in German:', missingInGerman);
  }
  
  // Check for keys in other locales that aren't in English
  const extraInItalian = itKeys.filter(key => !enKeys.includes(key));
  const extraInSpanish = esKeys.filter(key => !enKeys.includes(key));
  const extraInGerman = deKeys.filter(key => !enKeys.includes(key));
  
  if (extraInItalian.length > 0) {
    console.warn('Extra keys in Italian:', extraInItalian);
  }
  
  if (extraInSpanish.length > 0) {
    console.warn('Extra keys in Spanish:', extraInSpanish);
  }
  
  if (extraInGerman.length > 0) {
    console.warn('Extra keys in German:', extraInGerman);
  }
  
  return {
    missingInItalian,
    missingInSpanish,
    missingInGerman,
    extraInItalian,
    extraInSpanish,
    extraInGerman
  };
};

/**
 * Helper function to check if a translation value is a simple string or an object
 * Used for type checking during development
 */
const isTranslationObject = (value: unknown): value is Record<string, string> => {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
};

/**
 * This function can be called during development to check for duplicate keys
 * in the translation files.
 */
export const checkDuplicateTranslationKeys = () => {
  const checkDuplicates = (obj: Record<string, TranslationValue>, name: string) => {
    const keys = Object.keys(obj);
    const keySet = new Set();
    const duplicates: string[] = [];
    
    for (const key of keys) {
      if (keySet.has(key)) {
        duplicates.push(key);
      } else {
        keySet.add(key);
      }
    }
    
    if (duplicates.length > 0) {
      console.warn(`Duplicate keys found in ${name}:`, duplicates);
    }
    
    return duplicates;
  };
  
  return {
    duplicatesInEnglish: checkDuplicates(en, 'English'),
    duplicatesInItalian: checkDuplicates(it, 'Italian'),
    duplicatesInSpanish: checkDuplicates(es, 'Spanish'),
    duplicatesInGerman: checkDuplicates(de, 'German')
  };
};
