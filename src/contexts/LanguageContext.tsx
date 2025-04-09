
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { createTranslator } from '@/utils/translationUtils';

// Import all language files
import english from '@/locales/en';
import italian from '@/locales/it';
import spanish from '@/locales/es';
import german from '@/locales/de';

// Type definitions
export type Language = 'english' | 'italian' | 'spanish' | 'german';
export type Currency = 'usd' | 'eur' | 'gbp';
export type Timezone = 'europe_rome' | 'europe_london' | 'america_newyork' | 'europe_zurich';

interface DisplaySettings {
  language: Language;
  currency: Currency;
  timezone: Timezone;
}

interface LanguageContextProps {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string) => string;
  displaySettings: DisplaySettings;
  updateDisplaySettings: (settings: Partial<DisplaySettings>) => void;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

interface LanguageProviderProps {
  children: React.ReactNode;
}

// Combine all translations
const translations = {
  english,
  italian,
  spanish,
  german
};

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState(localStorage.getItem('language') || 'english');
  const [displaySettings, setDisplaySettings] = useState<DisplaySettings>({
    language: (localStorage.getItem('language') || 'english') as Language,
    currency: 'usd',
    timezone: 'europe_london'
  });

  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.lang = language;
  }, [language]);

  const t = useCallback((key: string) => {
    return createTranslator(translations, language as Language)(key);
  }, [language]);

  const updateDisplaySettings = useCallback((settings: Partial<DisplaySettings>) => {
    setDisplaySettings(prev => {
      const newSettings = { ...prev, ...settings };
      if (settings.language) {
        setLanguage(settings.language);
      }
      return newSettings;
    });
  }, []);

  return (
    <LanguageContext.Provider value={{ 
      language, 
      setLanguage, 
      t, 
      displaySettings, 
      updateDisplaySettings 
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
