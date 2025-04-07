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
  t: (key: string) => string; // Translation function
}

const defaultSettings: DisplaySettings = {
  language: 'english',
  currency: 'eur',
  timezone: 'europe_rome',
};

// Get saved settings from localStorage or use defaults
const getInitialSettings = (): DisplaySettings => {
  if (typeof window === 'undefined') return defaultSettings;
  
  const savedSettings = localStorage.getItem('displaySettings');
  return savedSettings ? JSON.parse(savedSettings) : defaultSettings;
};

// Translations dictionary
const translations: Record<Language, Record<string, string>> = {
  english: {
    home: 'Home',
    properties: 'Properties',
    events: 'Events',
    contact: 'Contact',
    login: 'Login',
    dashboard: 'Dashboard',
    analytics: 'Analytics',
    network: 'Network',
    profile: 'Profile',
    settings: 'Settings',
    language: 'Language',
    logout: 'Logout',
    // Dashboard components
    totalInvestment: 'Total Investment',
    roi: 'ROI',
    property: 'Property',
    location: 'Location',
    value: 'Value',
    status: 'Status',
    active: 'Active',
    development: 'Development',
    // Settings tabs
    notifications: 'Notifications',
    account: 'Account',
    preferences: 'Preferences',
    notificationSettings: 'Notification Settings',
    securitySettings: 'Security Settings',
    displayPreferences: 'Display Preferences',
    // Other common strings
    saveSettings: 'Save Settings',
    savePreferences: 'Save Preferences',
    saveNotificationSettings: 'Save Notification Settings',
    saveSecuritySettings: 'Save Security Settings',
  },
  italian: {
    home: 'Home',
    properties: 'Proprietà',
    events: 'Eventi',
    contact: 'Contatti',
    login: 'Accedi',
    dashboard: 'Dashboard',
    analytics: 'Analisi',
    network: 'Rete',
    profile: 'Profilo',
    settings: 'Impostazioni',
    language: 'Lingua',
    logout: 'Esci',
    // Dashboard components
    totalInvestment: 'Investimento Totale',
    roi: 'ROI',
    property: 'Proprietà',
    location: 'Posizione',
    value: 'Valore',
    status: 'Stato',
    active: 'Attivo',
    development: 'Sviluppo',
    // Settings tabs
    notifications: 'Notifiche',
    account: 'Account',
    preferences: 'Preferenze',
    notificationSettings: 'Impostazioni Notifiche',
    securitySettings: 'Impostazioni Sicurezza',
    displayPreferences: 'Preferenze Display',
    // Other common strings
    saveSettings: 'Salva Impostazioni',
    savePreferences: 'Salva Preferenze',
    saveNotificationSettings: 'Salva Impostazioni Notifiche',
    saveSecuritySettings: 'Salva Impostazioni Sicurezza',
  },
  spanish: {
    home: 'Inicio',
    properties: 'Propiedades',
    events: 'Eventos',
    contact: 'Contacto',
    login: 'Iniciar Sesión',
    dashboard: 'Panel',
    analytics: 'Análisis',
    network: 'Red',
    profile: 'Perfil',
    settings: 'Configuración',
    language: 'Idioma',
    logout: 'Cerrar Sesión',
    // Dashboard components
    totalInvestment: 'Inversión Total',
    roi: 'ROI',
    property: 'Propiedad',
    location: 'Ubicación',
    value: 'Valor',
    status: 'Estado',
    active: 'Activo',
    development: 'Desarrollo',
    // Settings tabs
    notifications: 'Notificaciones',
    account: 'Cuenta',
    preferences: 'Preferencias',
    notificationSettings: 'Configuración de Notificaciones',
    securitySettings: 'Configuración de Seguridad',
    displayPreferences: 'Preferencias de Pantalla',
    // Other common strings
    saveSettings: 'Guardar Configuración',
    savePreferences: 'Guardar Preferencias',
    saveNotificationSettings: 'Guardar Configuración de Notificaciones',
    saveSecuritySettings: 'Guardar Configuración de Seguridad',
  },
  german: {
    home: 'Startseite',
    properties: 'Immobilien',
    events: 'Veranstaltungen',
    contact: 'Kontakt',
    login: 'Anmelden',
    dashboard: 'Dashboard',
    analytics: 'Analysen',
    network: 'Netzwerk',
    profile: 'Profil',
    settings: 'Einstellungen',
    language: 'Sprache',
    logout: 'Abmelden',
    // Dashboard components
    totalInvestment: 'Gesamtinvestition',
    roi: 'ROI',
    property: 'Immobilie',
    location: 'Standort',
    value: 'Wert',
    status: 'Status',
    active: 'Aktiv',
    development: 'Entwicklung',
    // Settings tabs
    notifications: 'Benachrichtigungen',
    account: 'Konto',
    preferences: 'Präferenzen',
    notificationSettings: 'Benachrichtigungseinstellungen',
    securitySettings: 'Sicherheitseinstellungen',
    displayPreferences: 'Anzeigeeinstellungen',
    // Other common strings
    saveSettings: 'Einstellungen Speichern',
    savePreferences: 'Präferenzen Speichern',
    saveNotificationSettings: 'Benachrichtigungseinstellungen Speichern',
    saveSecuritySettings: 'Sicherheitseinstellungen Speichern',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [displaySettings, setDisplaySettings] = useState<DisplaySettings>(getInitialSettings);
  const [, setForceUpdate] = useState<number>(0); // Used to force re-render

  useEffect(() => {
    // Save settings to localStorage when they change
    localStorage.setItem('displaySettings', JSON.stringify(displaySettings));
    document.documentElement.lang = displaySettings.language;
    
    // Force a re-render of the entire application
    setForceUpdate(prev => prev + 1);
  }, [displaySettings]);

  const updateDisplaySettings = (newSettings: Partial<DisplaySettings>) => {
    setDisplaySettings(prev => ({ ...prev, ...newSettings }));
  };

  // Translation function
  const t = (key: string): string => {
    const currentLanguage = displaySettings.language;
    return translations[currentLanguage]?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ displaySettings, updateDisplaySettings, t }}>
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
