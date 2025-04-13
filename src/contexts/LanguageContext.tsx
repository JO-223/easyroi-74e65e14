
import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import en from '@/locales/en';
import it from '@/locales/it';
import es from '@/locales/es';
import de from '@/locales/de';
import { TranslationKey, isValidTranslationKey } from '@/utils/translationUtils';

export type Language = 'en' | 'it' | 'es' | 'de';
export type Currency = 'usd' | 'eur' | 'gbp';
export type Timezone = 'europe_rome' | 'europe_london' | 'america_newyork' | 'europe_zurich';

// Update translation type to support both simple strings and nested objects
export type TranslationValue = string | Record<string, string>;
type Translations = Record<Language, Record<string, TranslationValue>>;

export interface DisplaySettings {
  language: Language;
  currency: Currency;
  timezone: Timezone;
}

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey, params?: string | Record<string, string | number>) => string;
  supportedLanguages: { code: Language; name: string }[];
  displaySettings: DisplaySettings;
  updateDisplaySettings: (settings: Partial<DisplaySettings>) => void;
}

const translations: Translations = { en, it, es, de };

const supportedLanguages = [
  { code: 'en' as const, name: 'English' },
  { code: 'it' as const, name: 'Italiano' },
  { code: 'es' as const, name: 'Español' },
  { code: 'de' as const, name: 'Deutsch' },
];

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  // Get language from localStorage if available, otherwise default to English
  const [language, setLanguageState] = useState<Language>(() => {
    const savedLang = localStorage.getItem('language');
    return (savedLang && (supportedLanguages.some(l => l.code === savedLang))) 
      ? savedLang as Language 
      : 'en';
  });

  // Initialize display settings
  const [displaySettings, setDisplaySettings] = useState<DisplaySettings>(() => {
    const savedSettings = localStorage.getItem('displaySettings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        return {
          language: (supportedLanguages.some(l => l.code === parsed.language)) ? parsed.language : 'en',
          currency: ['usd', 'eur', 'gbp'].includes(parsed.currency) ? parsed.currency : 'usd',
          timezone: ['europe_rome', 'europe_london', 'america_newyork', 'europe_zurich'].includes(parsed.timezone) 
            ? parsed.timezone : 'europe_london'
        };
      } catch (e) {
        console.error("Error parsing display settings", e);
        return { language: 'en', currency: 'usd', timezone: 'europe_london' };
      }
    }
    return { language: language, currency: 'usd', timezone: 'europe_london' };
  });

  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.lang = language;
  }, [language]);

  useEffect(() => {
    localStorage.setItem('displaySettings', JSON.stringify(displaySettings));
    document.documentElement.lang = displaySettings.language;
  }, [displaySettings]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    setDisplaySettings(prev => ({ ...prev, language: lang }));
  };

  const updateDisplaySettings = (settings: Partial<DisplaySettings>) => {
    setDisplaySettings(prev => ({ ...prev, ...settings }));
    if (settings.language) {
      setLanguageState(settings.language);
    }
  };

  // Enhanced translation function that supports both string interpolation and nested objects
  const t = (key: TranslationKey, params?: string | Record<string, string | number>): string => {
    // First, get the translation value
    const translationValue = translations[language]?.[key] || translations.en[key];
    
    if (translationValue === undefined) {
      console.warn(`Missing translation key: ${key}`);
      return key;
    }
    
    // Handle nested translation case (e.g., tooltip.investor)
    if (typeof params === 'string' && typeof translationValue === 'object') {
      return translationValue[params] || params;
    }
    
    // Handle string with interpolation case
    if (typeof translationValue === 'string' && typeof params === 'object') {
      let result = translationValue;
      Object.entries(params).forEach(([paramKey, paramValue]) => {
        result = result.replace(new RegExp(`{${paramKey}}`, 'g'), String(paramValue));
      });
      return result;
    }
    
    // Handle simple string translation
    if (typeof translationValue === 'string') {
      return translationValue;
    }
    
    // Fallback for unhandled cases
    return key;
  };

  const value = {
    language,
    setLanguage,
    t,
    supportedLanguages,
    displaySettings,
    updateDisplaySettings,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
