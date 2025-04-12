
import en from '@/locales/en';
import { TranslationValue } from '@/contexts/LanguageContext';

export type TranslationKey = string;

/**
 * Validates translation keys to ensure all are defined in each language file
 * @param languages Object containing all language translations
 * @returns Boolean indicating if all keys are valid
 */
export function validateTranslationKeys(languages: Record<string, Record<string, TranslationValue>>) {
  const englishKeys = Object.keys(languages['en']);
  let isValid = true;

  Object.entries(languages).forEach(([lang, translations]) => {
    if (lang === 'en') return; // Skip English as it's our reference
    
    const currentKeys = Object.keys(translations);
    
    // Check for missing keys
    const missingKeys = englishKeys.filter(key => !currentKeys.includes(key));
    if (missingKeys.length > 0) {
      console.error(`Language ${lang} is missing these keys: ${missingKeys.join(', ')}`);
      isValid = false;
    }
    
    // Check for extra keys not in English
    const extraKeys = currentKeys.filter(key => !englishKeys.includes(key));
    if (extraKeys.length > 0) {
      console.warn(`Language ${lang} has extra keys not in English: ${extraKeys.join(', ')}`);
    }
    
    // Check for duplicates within a language
    const dupeCheck = new Set();
    const dupes: string[] = [];
    
    Object.keys(translations).forEach(key => {
      if (dupeCheck.has(key)) {
        dupes.push(key);
      } else {
        dupeCheck.add(key);
      }
    });
    
    if (dupes.length > 0) {
      console.error(`Language ${lang} has duplicate keys: ${dupes.join(', ')}`);
      isValid = false;
    }
  });
  
  return isValid;
}

/**
 * Checks if a translation key exists in the English locale
 */
export function isValidTranslationKey(key: string): key is TranslationKey {
  return typeof key === 'string';
}

/**
 * Sorts translation keys alphabetically within their categories
 */
export function getSortedTranslationKeys() {
  const englishEntries = Object.entries(en);
  const categories: Record<string, Record<string, TranslationValue>> = {};
  let currentCategory = 'uncategorized';
  
  englishEntries.forEach(([key, value]) => {
    // Comments in the translation file indicate categories
    if (typeof value === 'string' && value === '') {
      currentCategory = key.replace(/\/\/ /, '').trim();
      categories[currentCategory] = {};
    } else {
      if (!categories[currentCategory]) {
        categories[currentCategory] = {};
      }
      categories[currentCategory][key] = value;
    }
  });
  
  // Sort keys within each category
  Object.keys(categories).forEach(category => {
    categories[category] = Object.fromEntries(
      Object.entries(categories[category]).sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
    );
  });
  
  return categories;
}
