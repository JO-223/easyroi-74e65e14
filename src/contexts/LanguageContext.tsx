import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface LanguageContextProps {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

interface LanguageProviderProps {
  children: React.ReactNode;
}

const translations = {
  english: {
    welcome: "Welcome",
    dashboard: "Dashboard",
    properties: "Properties",
    development: "Development",
    analytics: "Analytics",
    events: "Events",
    network: "Network",
    profile: "Profile",
    settings: "Settings",
    logout: "Logout",
    totalInvestment: "Total Investment",
    roi: "ROI",
    annualGrowth: "Annual Growth",
    marketComparison: "Market Comparison",
    vsPreviousYear: "vs Previous Year",
    vsMarketAverage: "vs Market Average",
    investmentGrowth: "Investment Growth",
    portfolioAllocation: "Portfolio Allocation",
    geographicDistribution: "Geographic Distribution",
    propertyValue: "Property Value",
    propertyStatus: "Property Status",
    propertyLocation: "Property Location",
    propertyROI: "Property ROI",
    propertyDetails: "Property Details",
    propertyValuation: "Property Valuation",
    marketTrends: "Market Trends",
    investmentTimeline: "Investment Timeline",
    financialPerformance: "Financial Performance",
    propertyManagement: "Property Management",
    tenantManagement: "Tenant Management",
    maintenanceRequests: "Maintenance Requests",
    rentCollection: "Rent Collection",
    upcomingEvents: "Upcoming Events",
    pastEvents: "Past Events",
    eventDetails: "Event Details",
    attendees: "Attendees",
    speakers: "Speakers",
    contactInformation: "Contact Information",
    connect: "Connect",
    messages: "Messages",
    notifications: "Notifications",
    privacySettings: "Privacy Settings",
    accountSettings: "Account Settings",
    helpCenter: "Help Center",
    aboutUs: "About Us",
    contactUs: "Contact Us",
    termsOfService: "Terms of Service",
    privacyPolicy: "Privacy Policy",
    comprehensiveAnalysis: "Comprehensive Analysis",
    roiPerformance: "ROI Performance",
    allocation: "Allocation",
    historicalROI: "Historical ROI",
    annualROI: "Annual ROI",
    importProjects: "Import Projects",
    loading: "Loading",
    errorLoadingData: "Error loading data",
    noHistoricalData: "No historical data",
    marketVolatility: "Market volatility offset detected",
    totalEvents: "Total Events Attended",
  },
  italian: {
    welcome: "Benvenuto",
    dashboard: "Cruscotto",
    properties: "Immobili",
    development: "Sviluppo",
    analytics: "Analisi",
    events: "Eventi",
    network: "Rete",
    profile: "Profilo",
    settings: "Impostazioni",
    logout: "Esci",
    totalInvestment: "Investimento Totale",
    roi: "ROI",
    annualGrowth: "Crescita Annuale",
    marketComparison: "Confronto con il Mercato",
    vsPreviousYear: "vs Anno Precedente",
    vsMarketAverage: "vs Media di Mercato",
    investmentGrowth: "Crescita dell'Investimento",
    portfolioAllocation: "Allocazione del Portafoglio",
    geographicDistribution: "Distribuzione Geografica",
    propertyValue: "Valore dell'Immobile",
    propertyStatus: "Stato dell'Immobile",
    propertyLocation: "Posizione dell'Immobile",
    propertyROI: "ROI dell'Immobile",
    propertyDetails: "Dettagli dell'Immobile",
    propertyValuation: "Valutazione dell'Immobile",
    marketTrends: "Tendenze di Mercato",
    investmentTimeline: "Cronologia degli Investimenti",
    financialPerformance: "Performance Finanziaria",
    propertyManagement: "Gestione dell'Immobile",
    tenantManagement: "Gestione degli Inquilini",
    maintenanceRequests: "Richieste di Manutenzione",
    rentCollection: "Raccolta Affitti",
    upcomingEvents: "Prossimi Eventi",
    pastEvents: "Eventi Passati",
    eventDetails: "Dettagli dell'Evento",
    attendees: "Partecipanti",
    speakers: "Relatori",
    contactInformation: "Informazioni di Contatto",
    connect: "Connetti",
    messages: "Messaggi",
    notifications: "Notifiche",
    privacySettings: "Impostazioni sulla Privacy",
    accountSettings: "Impostazioni Account",
    helpCenter: "Centro Assistenza",
    aboutUs: "Chi Siamo",
    contactUs: "Contattaci",
    termsOfService: "Termini di Servizio",
    privacyPolicy: "Politica sulla Privacy",
    comprehensiveAnalysis: "Analisi Completa",
    roiPerformance: "Performance ROI",
    allocation: "Allocazione",
    historicalROI: "ROI Storico",
    annualROI: "ROI Annuale",
    importProjects: "Importa Progetti",
    loading: "Caricamento",
    errorLoadingData: "Errore nel caricamento dei dati",
    noHistoricalData: "Dati storici non disponibili",
    marketVolatility: "Compensazione della volatilità di mercato rilevata",
    totalEvents: "Eventi Partecipati Totali",
  }
};

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState(localStorage.getItem('language') || 'english');

  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.lang = language;
  }, [language]);

  const t = useCallback((key: string) => {
    return translations[language as keyof typeof translations][key] || key;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
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
