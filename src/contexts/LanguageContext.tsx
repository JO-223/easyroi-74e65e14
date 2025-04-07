
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'english' | 'italian' | 'spanish' | 'german';
export type Currency = 'eur' | 'usd' | 'gbp' | 'chf';
export type Timezone = 'europe_rome' | 'europe_london' | 'europe_zurich' | 'america_newyork';

interface DisplaySettings {
  language: Language;
  currency: Currency;
  timezone: Timezone;
}

interface LanguageContextType {
  displaySettings: DisplaySettings;
  updateDisplaySettings: (settings: Partial<DisplaySettings>) => void;
}

const defaultSettings: DisplaySettings = {
  language: 'english',
  currency: 'eur',
  timezone: 'europe_rome',
};

// Recupera le impostazioni salvate dal localStorage o usa i valori predefiniti
const getInitialSettings = (): DisplaySettings => {
  const savedSettings = localStorage.getItem('displaySettings');
  return savedSettings ? JSON.parse(savedSettings) : defaultSettings;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [displaySettings, setDisplaySettings] = useState<DisplaySettings>(getInitialSettings);

  useEffect(() => {
    // Salva le impostazioni nel localStorage quando cambiano
    localStorage.setItem('displaySettings', JSON.stringify(displaySettings));
    // Si potrebbe aggiungere qui la logica per cambiare la lingua dell'interfaccia
    document.documentElement.lang = displaySettings.language;
  }, [displaySettings]);

  const updateDisplaySettings = (newSettings: Partial<DisplaySettings>) => {
    setDisplaySettings(prev => ({ ...prev, ...newSettings }));
  };

  return (
    <LanguageContext.Provider value={{ displaySettings, updateDisplaySettings }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
