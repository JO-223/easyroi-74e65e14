
import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import en from '@/locales/en';
import it from '@/locales/it';
import es from '@/locales/es';
import de from '@/locales/de';
import { TranslationKey, isValidTranslationKey } from '@/utils/translationUtils';

type Language = 'en' | 'it' | 'es' | 'de';
type Translations = Record<Language, Record<string, string>>;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey) => string;
  supportedLanguages: { code: Language; name: string }[];
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

  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = (key: TranslationKey): string => {
    // First check if the key is valid
    if (!isValidTranslationKey(key)) {
      console.warn(`Missing translation key: ${key}`);
      return key; // Return the key as fallback
    }

    // Use the current language's translation or fallback to English
    const translatedText = translations[language]?.[key] || translations.en[key];
    
    // If the translation is missing in both current language and English, fall back to key
    if (!translatedText) {
      console.warn(`Missing translation for key: ${key} in language: ${language}`);
      return key;
    }
    
    return translatedText;
  };

  const value = {
    language,
    setLanguage,
    t,
    supportedLanguages,
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
