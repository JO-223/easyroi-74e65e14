
import { TranslationKey } from './translationUtils';
import * as enTranslations from '@/locales/en';

export const checkTranslations = (key: string): boolean => {
  if (!key) return false;

  // We check if the key exists in the English translation file
  // as this is our base language
  return Object.hasOwnProperty.call(enTranslations.default, key);
};

export const getTranslationKeys = (): TranslationKey[] => {
  return Object.keys(enTranslations.default) as TranslationKey[];
};
