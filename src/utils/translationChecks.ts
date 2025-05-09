
import { TranslationKey } from './translationUtils';
import * as enTranslations from '@/locales/en';

// Utility function to check if a translation key exists
export const checkTranslationKey = (key: string): key is TranslationKey => {
  return Object.hasOwnProperty.call(enTranslations.default, key);
};

// Get a list of all available translation keys
export const getAvailableTranslationKeys = (): TranslationKey[] => {
  return Object.keys(enTranslations.default) as TranslationKey[];
};

// Check if a value exists for a translation key
export const hasTranslationValue = (key: TranslationKey): boolean => {
  const value = enTranslations.default[key];
  return value !== undefined && value !== '';
};
