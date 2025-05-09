
import * as allTranslationKeys from './translations';
import * as enTranslations from '@/locales/en';
import * as itTranslations from '@/locales/it';
import * as esTranslations from '@/locales/es';
import * as deTranslations from '@/locales/de';

// Get all translation keys from the TranslationKey type
export const getAllTranslationKeys = () => {
  const keys: string[] = [];
  
  // Collect keys from all modules
  Object.values(allTranslationKeys).forEach(module => {
    if (Array.isArray(module)) {
      module.forEach(key => {
        if (!keys.includes(key)) {
          keys.push(key);
        }
      });
    }
  });
  
  return keys;
};

// Check if all translation keys are present in a given locale
export const checkTranslationCompleteness = (locale: 'en' | 'it' | 'es' | 'de') => {
  const allKeys = getAllTranslationKeys();
  const localeTranslations = {
    en: enTranslations.default,
    it: itTranslations.default,
    es: esTranslations.default,
    de: deTranslations.default
  }[locale];
  
  const missingKeys: string[] = [];
  
  allKeys.forEach(key => {
    if (!Object.prototype.hasOwnProperty.call(localeTranslations, key)) {
      missingKeys.push(key);
    }
  });
  
  return {
    total: allKeys.length,
    missing: missingKeys,
    completeness: ((allKeys.length - missingKeys.length) / allKeys.length) * 100
  };
};
