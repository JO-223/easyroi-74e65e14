
import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import en from '@/locales/en';
import it from '@/locales/it';
import es from '@/locales/es';
import de from '@/locales/de';
import { TranslationKey, isValidTranslationKey } from '@/utils/translationUtils';

export type Language = 'en' | 'it' | 'es' | 'de';
export type Currency = 'usd' | 'eur' | 'gbp';
export type Timezone = 'europe_rome' | 'europe_london' | 'america_newyork' | 'europe_zurich';

type Translations = Record<Language, Record<string, any>>;

export interface DisplaySettings {
  language: Language;
  currency: Currency;
  timezone: Timezone;
}

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey) => string;
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

  const t = (key: TranslationKey): string => {
    // Handle nested keys for status
    if (key.includes('.')) {
      const [parent, child] = key.split('.');
      const parentObj = translations[language]?.[parent];
      
      if (parentObj && typeof parentObj === 'object' && child in parentObj) {
        return parentObj[child] as string;
      }
      
      // Fallback to English if translation doesn't exist
      const enParent = translations.en[parent];
      if (enParent && typeof enParent === 'object' && child in enParent) {
        return enParent[child] as string;
      }
      
      console.warn(`Missing translation key: ${key}`);
      return key;
    }
    
    // Handle regular keys
    if (!translations[language]?.[key] && !translations.en[key]) {
      console.warn(`Missing translation key: ${key}`);
      return key; // Return the key as fallback
    }

    // Use the current language's translation or fallback to English
    return translations[language]?.[key] as string || translations.en[key] as string || key;
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
