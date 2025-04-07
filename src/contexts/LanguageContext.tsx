
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
    // Navigation & Common elements
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
    
    // Login page
    signIn: 'Sign in',
    signingIn: 'Signing in...',
    email: 'Email',
    password: 'Password',
    forgotPassword: 'Forgot password?',
    loginSuccessTitle: 'Success!',
    loginSuccessMsg: 'You have successfully logged in.',
    investorPortal: 'Investor Portal',
    investorPortalDesc: 'Sign in to access your exclusive investment dashboard',
    privatePortalAlert: 'This is a private investment portal. Access is granted only to verified investors.',
    needAssistance: 'Need assistance? Contact your investment advisor.',
    scheduleMeeting: 'Schedule a meeting',
    
    // Dashboard page
    investmentGrowth: 'Investment Growth',
    portfolioAllocation: 'Portfolio Allocation',
    yourProperties: 'Your Properties',
    
    // Events page
    upcomingEvents: 'Upcoming Events',
    pastEvents: 'Past Events',
    eventsFound: 'events found',
    rsvpConfirmed: 'RSVP Confirmed',
    rsvpConfirmedMsg: 'You\'ve successfully registered for:',
    downloadStarted: 'Download Started',
    downloadStartedMsg: 'Your recording download has started.',
    online: 'Online',
    inPerson: 'In-Person',
    viewDetails: 'View Details',
    rsvp: 'RSVP',
    capacity: 'Capacity',
    limitedTo: 'Limited to',
    investors: 'investors',
    unlimited: 'Unlimited',
    exclusiveEvents: 'Exclusive investment events and networking opportunities',
    
    // Network page
    investorNetwork: 'Investor Network',
    connectInvestors: 'Connect with fellow exclusive investors in the EasyROI community',
    searchInvestors: 'Search by name, location, or investment interest...',
    investorsFound: 'investors found',
    connectionSent: 'Connection Request Sent',
    connectionSentMsg: 'Your connection request has been sent to',
    messageCenter: 'Message Center',
    openingConversation: 'Opening conversation with',
    message: 'Message',
    connect: 'Connect',
    properties_count: 'Properties',
    
    // Analytics page
    comprehensiveAnalysis: 'Comprehensive data analysis of your investment portfolio',
    portfolioROI: 'Portfolio ROI',
    annualGrowth: 'Annual Growth',
    marketComparison: 'Market Comparison',
    aboveIndex: 'Above index',
    vsMarketAverage: 'vs market average',
    vsPreviousYear: 'vs previous year',
    roiPerformance: 'ROI Performance',
    yourPortfolio: 'Your Portfolio',
    marketAverage: 'Market Average',
    assetAllocation: 'Asset Allocation',
    allocation: 'Allocation',
    geographicDistribution: 'Geographic Distribution',
    historicalROI: 'Historical ROI Performance',
    annualROI: 'Annual ROI',
    
    // Landing page
    premiumRealEstate: 'Premium Real Estate',
    exceptionalReturns: 'Exceptional Returns',
    exclusiveAccess: 'Exclusive access to high-yield international real estate investments.',
    startInvesting: 'Start Investing',
    scroll: 'SCROLL',
    curated: 'Luxury portfolio carefully curated',
    curatedDesc: 'Access to exclusive real estate opportunities not available on the open market.',
    premiumProperties: 'Premium Properties',
    premiumPropertiesDesc: 'Access exclusive real estate in Italy, Dubai, and other luxury markets.',
    portfolioAnalytics: 'Portfolio Analytics',
    portfolioAnalyticsDesc: 'Track investments with comprehensive real-time data analysis.',
    securePlatform: 'Secure Platform',
    securePlatformDesc: 'Enterprise-grade security for your investments and data.',
    featuredLocations: 'Featured Locations',
    readyToMaximize: 'Ready to maximize your investment potential?',
    scheduleMeeting: 'Schedule a meeting',
    
    // Settings page
    configurePreferences: 'Configure your account preferences and settings',
    notificationChannels: 'Notification Channels',
    emailNotifications: 'Email Notifications',
    smsNotifications: 'SMS Notifications',
    notificationTypes: 'Notification Types',
    propertyAlerts: 'Property Alerts & Updates',
    eventReminders: 'Event Reminders',
    marketingNewsletter: 'Marketing & Newsletter',
    authentication: 'Authentication',
    twoFactorAuth: 'Two-factor Authentication',
    twoFactorDesc: 'Add an extra layer of security to your account.',
    loginAlerts: 'Login Alerts',
    loginAlertsDesc: 'Receive alerts when someone logs into your account.',
    passwordManagement: 'Password Management',
    changePassword: 'Change Password',
    sessionManagement: 'Session Management',
    sessionTimeout: 'Automatic Session Timeout',
    sessionTimeoutDesc: 'Choose how long until your session expires.',
    displayCurrency: 'Display Currency',
    timezone: 'Timezone',
    contactInformation: 'Contact Information',
    primaryEmail: 'Primary Email Address',
    phoneNumber: 'Phone Number',
    verify: 'Verify',
    minutes: 'minutes',
    hour: 'hour',
    hours: 'hours',
    
    // Language change messages
    languageChanged: 'Language changed to English',
    languageChankedItalian: 'Lingua cambiata in Italiano',
    languageChangedSpanish: 'Idioma cambiado a Español',
    languageChangedGerman: 'Sprache auf Deutsch geändert',
    
    // Registration page
    firstNameRequired: 'First name is required',
    lastNameRequired: 'Last name is required',
    invalidEmail: 'Invalid email address',
    passwordMinChars: 'Password must be at least 8 characters',
    acceptTermsRequired: 'You must accept the terms and conditions',
    passwordsNotMatch: 'Passwords do not match',
    registrationSuccess: 'Registration successful!',
    accountCreated: 'Your account has been created.',
    firstName: 'First name',
    lastName: 'Last name',
    confirmPassword: 'Confirm Password',
    iAccept: 'I accept the',
    termsAndConditions: 'terms and conditions',
    creatingAccount: 'Creating account...',
    alreadyHaveAccount: 'Already have an account?',
    joinCommunity: 'Join our exclusive investor community',
    firstNamePlaceholder: 'John',
    lastNamePlaceholder: 'Doe',
    
    // Properties page
    filterProperties: 'Filter Properties',
    showFilters: 'Show Filters',
    hideFilters: 'Hide Filters',
    allLocations: 'All Locations',
    allPrices: 'All Prices',
    allLevels: 'All Levels',
    priceRange: 'Price Range',
    investorLevel: 'Investor Level',
    resetFilters: 'Reset Filters',
    applyFilters: 'Apply Filters',
    minInvestment: 'Min Investment',
    expectedROI: 'Expected ROI',
    exclusiveProperties: 'Exclusive Properties',
    discoverProperties: 'Discover our handpicked selection of luxury real estate investments in premier locations around the world.',
    amenities: 'Amenities',
  },
  italian: {
    // Navigation & Common elements
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
    
    // Login page
    signIn: 'Accedi',
    signingIn: 'Accesso in corso...',
    email: 'Email',
    password: 'Password',
    forgotPassword: 'Password dimenticata?',
    loginSuccessTitle: 'Successo!',
    loginSuccessMsg: 'Hai effettuato l\'accesso con successo.',
    investorPortal: 'Portale Investitori',
    investorPortalDesc: 'Accedi per visualizzare la tua dashboard di investimenti esclusiva',
    privatePortalAlert: 'Questo è un portale di investimento privato. L\'accesso è consentito solo agli investitori verificati.',
    needAssistance: 'Hai bisogno di assistenza? Contatta il tuo consulente di investimenti.',
    scheduleMeeting: 'Richiedi una consulenza',
    
    // Dashboard page
    investmentGrowth: 'Crescita degli Investimenti',
    portfolioAllocation: 'Allocazione del Portafoglio',
    yourProperties: 'Le Tue Proprietà',
    
    // Events page
    upcomingEvents: 'Eventi Imminenti',
    pastEvents: 'Eventi Passati',
    eventsFound: 'eventi trovati',
    rsvpConfirmed: 'Registrazione Confermata',
    rsvpConfirmedMsg: 'Ti sei registrato con successo per:',
    downloadStarted: 'Download Avviato',
    downloadStartedMsg: 'Il download della registrazione è iniziato.',
    online: 'Online',
    inPerson: 'In Presenza',
    viewDetails: 'Vedi Dettagli',
    rsvp: 'Prenota',
    capacity: 'Capacità',
    limitedTo: 'Limitato a',
    investors: 'investitori',
    unlimited: 'Illimitato',
    exclusiveEvents: 'Eventi esclusivi di investimento e opportunità di networking',
    
    // Network page
    investorNetwork: 'Rete Investitori',
    connectInvestors: 'Connettiti con altri investitori esclusivi nella comunità EasyROI',
    searchInvestors: 'Cerca per nome, località o interesse di investimento...',
    investorsFound: 'investitori trovati',
    connectionSent: 'Richiesta di Connessione Inviata',
    connectionSentMsg: 'La tua richiesta di connessione è stata inviata a',
    messageCenter: 'Centro Messaggi',
    openingConversation: 'Apertura conversazione con',
    message: 'Messaggio',
    connect: 'Connetti',
    properties_count: 'Proprietà',
    
    // Analytics page
    comprehensiveAnalysis: 'Analisi completa del tuo portafoglio di investimenti',
    portfolioROI: 'ROI del Portafoglio',
    annualGrowth: 'Crescita Annuale',
    marketComparison: 'Confronto con il Mercato',
    aboveIndex: 'Sopra l\'indice',
    vsMarketAverage: 'vs media di mercato',
    vsPreviousYear: 'vs anno precedente',
    roiPerformance: 'Andamento ROI',
    yourPortfolio: 'Il Tuo Portafoglio',
    marketAverage: 'Media di Mercato',
    assetAllocation: 'Allocazione Asset',
    allocation: 'Allocazione',
    geographicDistribution: 'Distribuzione Geografica',
    historicalROI: 'Storico Andamento ROI',
    annualROI: 'ROI Annuale',
    
    // Landing page
    premiumRealEstate: 'Immobili di Pregio',
    exceptionalReturns: 'Rendimenti Eccezionali',
    exclusiveAccess: 'Accesso esclusivo a investimenti immobiliari internazionali ad alto rendimento.',
    startInvesting: 'Inizia ad Investire',
    scroll: 'SCORRI',
    curated: 'Portafoglio di lusso accuratamente selezionato',
    curatedDesc: 'Accesso a opportunità immobiliari esclusive non disponibili sul mercato aperto.',
    premiumProperties: 'Proprietà Premium',
    premiumPropertiesDesc: 'Accedi a immobili esclusivi in Italia, Dubai e altri mercati di lusso.',
    portfolioAnalytics: 'Analisi del Portafoglio',
    portfolioAnalyticsDesc: 'Monitora gli investimenti con analisi dei dati in tempo reale.',
    securePlatform: 'Piattaforma Sicura',
    securePlatformDesc: 'Sicurezza di livello enterprise per i tuoi investimenti e dati.',
    featuredLocations: 'Località in Evidenza',
    readyToMaximize: 'Pronto a massimizzare il tuo potenziale di investimento?',
    scheduleMeeting: 'Richiedi una consulenza',
    
    // Settings page
    configurePreferences: 'Configura le tue preferenze e impostazioni dell\'account',
    notificationChannels: 'Canali di Notifica',
    emailNotifications: 'Notifiche Email',
    smsNotifications: 'Notifiche SMS',
    notificationTypes: 'Tipi di Notifica',
    propertyAlerts: 'Avvisi e Aggiornamenti Proprietà',
    eventReminders: 'Promemoria Eventi',
    marketingNewsletter: 'Marketing & Newsletter',
    authentication: 'Autenticazione',
    twoFactorAuth: 'Autenticazione a Due Fattori',
    twoFactorDesc: 'Aggiungi un livello extra di sicurezza al tuo account.',
    loginAlerts: 'Avvisi di Accesso',
    loginAlertsDesc: 'Ricevi avvisi quando qualcuno accede al tuo account.',
    passwordManagement: 'Gestione Password',
    changePassword: 'Cambia Password',
    sessionManagement: 'Gestione Sessione',
    sessionTimeout: 'Timeout Automatico Sessione',
    sessionTimeoutDesc: 'Scegli quanto tempo deve passare prima che la tua sessione scada.',
    displayCurrency: 'Valuta di Visualizzazione',
    timezone: 'Fuso Orario',
    contactInformation: 'Informazioni di Contatto',
    primaryEmail: 'Indirizzo Email Principale',
    phoneNumber: 'Numero di Telefono',
    verify: 'Verifica',
    minutes: 'minuti',
    hour: 'ora',
    hours: 'ore',
    
    // Language change messages
    languageChanged: 'Language changed to English',
    languageChankedItalian: 'Lingua cambiata in Italiano',
    languageChangedSpanish: 'Idioma cambiado a Español',
    languageChangedGerman: 'Sprache auf Deutsch geändert',
    
    // Registration page
    firstNameRequired: 'Il nome è obbligatorio',
    lastNameRequired: 'Il cognome è obbligatorio',
    invalidEmail: 'Indirizzo email non valido',
    passwordMinChars: 'La password deve contenere almeno 8 caratteri',
    acceptTermsRequired: 'Devi accettare i termini e le condizioni',
    passwordsNotMatch: 'Le password non coincidono',
    registrationSuccess: 'Registrazione completata!',
    accountCreated: 'Il tuo account è stato creato.',
    firstName: 'Nome',
    lastName: 'Cognome',
    confirmPassword: 'Conferma Password',
    iAccept: 'Accetto i',
    termsAndConditions: 'termini e condizioni',
    creatingAccount: 'Creazione account in corso...',
    alreadyHaveAccount: 'Hai già un account?',
    joinCommunity: 'Unisciti alla nostra esclusiva comunità di investitori',
    firstNamePlaceholder: 'Mario',
    lastNamePlaceholder: 'Rossi',
    
    // Properties page
    filterProperties: 'Filtra Proprietà',
    showFilters: 'Mostra Filtri',
    hideFilters: 'Nascondi Filtri',
    allLocations: 'Tutte le Località',
    allPrices: 'Tutti i Prezzi',
    allLevels: 'Tutti i Livelli',
    priceRange: 'Fascia di Prezzo',
    investorLevel: 'Livello Investitore',
    resetFilters: 'Reimposta Filtri',
    applyFilters: 'Applica Filtri',
    minInvestment: 'Investimento Minimo',
    expectedROI: 'ROI Previsto',
    exclusiveProperties: 'Proprietà Esclusive',
    discoverProperties: 'Scopri la nostra selezione di investimenti immobiliari di lusso in location prestigiose in tutto il mondo.',
    amenities: 'Servizi',
  },
  spanish: {
    // Navigation & Common elements
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
    
    // Login page
    signIn: 'Iniciar Sesión',
    signingIn: 'Iniciando sesión...',
    email: 'Email',
    password: 'Contraseña',
    forgotPassword: '¿Olvidaste tu contraseña?',
    loginSuccessTitle: '¡Éxito!',
    loginSuccessMsg: 'Has iniciado sesión correctamente.',
    investorPortal: 'Portal de Inversores',
    investorPortalDesc: 'Inicia sesión para acceder a tu panel de inversiones exclusivo',
    privatePortalAlert: 'Este es un portal de inversión privado. El acceso se concede solo a inversores verificados.',
    needAssistance: '¿Necesitas ayuda? Contacta a tu asesor de inversiones.',
    scheduleMeeting: 'Agende su consulta',
    
    // Dashboard page
    investmentGrowth: 'Crecimiento de Inversión',
    portfolioAllocation: 'Asignación de Portafolio',
    yourProperties: 'Tus Propiedades',
    
    // Events page
    upcomingEvents: 'Próximos Eventos',
    pastEvents: 'Eventos Pasados',
    eventsFound: 'eventos encontrados',
    rsvpConfirmed: 'Confirmación de Asistencia',
    rsvpConfirmedMsg: 'Te has registrado exitosamente para:',
    downloadStarted: 'Descarga Iniciada',
    downloadStartedMsg: 'La descarga de tu grabación ha comenzado.',
    online: 'En Línea',
    inPerson: 'Presencial',
    viewDetails: 'Ver Detalles',
    rsvp: 'Reservar',
    capacity: 'Capacidad',
    limitedTo: 'Limitado a',
    investors: 'inversores',
    unlimited: 'Ilimitado',
    exclusiveEvents: 'Eventos exclusivos de inversión y oportunidades de networking',
    
    // Network page
    investorNetwork: 'Red de Inversores',
    connectInvestors: 'Conéctate con inversores exclusivos en la comunidad EasyROI',
    searchInvestors: 'Buscar por nombre, ubicación o interés de inversión...',
    investorsFound: 'inversores encontrados',
    connectionSent: 'Solicitud de Conexión Enviada',
    connectionSentMsg: 'Tu solicitud de conexión ha sido enviada a',
    messageCenter: 'Centro de Mensajes',
    openingConversation: 'Abriendo conversación con',
    message: 'Mensaje',
    connect: 'Conectar',
    properties_count: 'Propiedades',
    
    // Analytics page
    comprehensiveAnalysis: 'Análisis completo de tu cartera de inversiones',
    portfolioROI: 'ROI de Cartera',
    annualGrowth: 'Crecimiento Anual',
    marketComparison: 'Comparación con el Mercado',
    aboveIndex: 'Por encima del índice',
    vsMarketAverage: 'vs promedio del mercado',
    vsPreviousYear: 'vs año anterior',
    roiPerformance: 'Rendimiento ROI',
    yourPortfolio: 'Tu Cartera',
    marketAverage: 'Promedio del Mercado',
    assetAllocation: 'Asignación de Activos',
    allocation: 'Asignación',
    geographicDistribution: 'Distribución Geográfica',
    historicalROI: 'Historial de Rendimiento ROI',
    annualROI: 'ROI Anual',
    
    // Landing page
    premiumRealEstate: 'Inmuebles Premium',
    exceptionalReturns: 'Retornos Excepcionales',
    exclusiveAccess: 'Acceso exclusivo a inversiones inmobiliarias internacionales de alto rendimiento.',
    startInvesting: 'Comenzar a Invertir',
    scroll: 'DESPLAZAR',
    curated: 'Portafoglio de lujo cuidadosamente seleccionado',
    curatedDesc: 'Acceso a oportunidades inmobiliarias exclusivas no disponibles en el mercado abierto.',
    premiumProperties: 'Propiedades Premium',
    premiumPropertiesDesc: 'Accede a inmuebles exclusivos en Italia, Dubai y otros mercados de lujo.',
    portfolioAnalytics: 'Análisis de Portafolio',
    portfolioAnalyticsDesc: 'Rastrea inversiones con análisis de datos completos en tiempo real.',
    securePlatform: 'Plataforma Segura',
    securePlatformDesc: 'Seguridad empresarial para tus inversiones y datos.',
    featuredLocations: 'Ubicaciones Destacadas',
    readyToMaximize: '¿Listo para maximizar tu potencial de inversion?',
    scheduleMeeting: 'Agende su consulta',
    
    // Settings page
    configurePreferences: 'Configura las preferencias y ajustes de tu cuenta',
    notificationChannels: 'Canales de Notificación',
    emailNotifications: 'Notificaciones por Email',
    smsNotifications: 'Notificaciones SMS',
    notificationTypes: 'Tipos de Notificación',
    propertyAlerts: 'Alertas y Actualizaciones de Propiedades',
    eventReminders: 'Recordatorios de Eventos',
    marketingNewsletter: 'Marketing y Boletín',
    authentication: 'Autenticación',
    twoFactorAuth: 'Autenticación de Dos Factores',
    twoFactorDesc: 'Añade una capa extra de seguridad a tu cuenta.',
    loginAlerts: 'Alertas de Inicio de Sesión',
    loginAlertsDesc: 'Recibe alertas cuando alguien inicie sesión en tu cuenta.',
    passwordManagement: 'Gestión de Contraseña',
    changePassword: 'Cambiar Contraseña',
    sessionManagement: 'Gestión de Sesión',
    sessionTimeout: 'Tiempo de Espera Automático de Sesión',
    sessionTimeoutDesc: 'Elige cuanto tiempo hasta que tu sesión expire.',
    displayCurrency: 'Moneda de Visualización',
    timezone: 'Zona Horaria',
    contactInformation: 'Información de Contacto',
    primaryEmail: 'Dirección de Email Principal',
    phoneNumber: 'Número de Teléfono',
    verify: 'Verificar',
    minutes: 'minutos',
    hour: 'hora',
    hours: 'horas',
    
    // Language change messages
    languageChanged: 'Language changed to English',
    languageChankedItalian: 'Lingua cambiata in Italiano',
    languageChangedSpanish: 'Idioma cambiado a Español',
    languageChangedGerman: 'Sprache auf Deutsch geändert',
    
    // Registration page
    firstNameRequired: 'El nombre es obligatorio',
    lastNameRequired: 'El apellido es obligatorio',
    invalidEmail: 'Dirección de correo inválida',
    passwordMinChars: 'La contraseña debe tener al menos 8 caracteres',
    acceptTermsRequired: 'Debes aceptar los términos y condiciones',
    passwordsNotMatch: 'Las contraseñas no coinciden',
    registrationSuccess: '¡Registro exitoso!',
    accountCreated: 'Tu cuenta ha sido creada.',
    firstName: 'Nombre',
    lastName: 'Apellido',
    confirmPassword: 'Confirmar Contraseña',
    iAccept: 'Acepto los',
    termsAndConditions: 'términos y condiciones',
    creatingAccount: 'Creando cuenta...',
    alreadyHaveAccount: '¿Ya tienes una cuenta?',
    joinCommunity: 'Únete a nuestra comunidad exclusiva de inversores',
    firstNamePlaceholder: 'Juan',
    lastNamePlaceholder: 'Pérez',
    
    // Properties page
    filterProperties: 'Filtrar Propiedades',
    showFilters: 'Mostrar Filtros',
    hideFilters: 'Ocultar Filtros',
    allLocations: 'Todas las Ubicaciones',
    allPrices: 'Todos los Precios',
    allLevels: 'Todos los Niveles',
    priceRange: 'Rango de Precio',
    investorLevel: 'Nivel de Inversor',
    resetFilters: 'Restablecer Filtros',
    applyFilters: 'Aplicar Filtros',
    minInvestment: 'Inversión Mínima',
    expectedROI: 'ROI Esperado',
    exclusiveProperties: 'Propiedades Exclusivas',
    discoverProperties: 'Descubre nuestra selección de inversiones inmobiliarias de lujo en ubicaciones privilegiadas de todo el mundo.',
    amenities: 'Comodidades',
  },
  german: {
    // Navigation & Common elements
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
    
    // Login page
    signIn: 'Anmelden',
    signingIn: 'Anmeldung läuft...',
    email: 'E-Mail',
    password: 'Passwort',
    forgotPassword: 'Passwort vergessen?',
    loginSuccessTitle: 'Erfolg!',
    loginSuccessMsg: 'Du hast dich erfolgreich angemeldet.',
    investorPortal: 'Investorenportal',
    investorPortalDesc: 'Melde dich an, um auf dein exklusives Investoren-Dashboard zuzugreifen',
    privatePortalAlert: 'Dies ist ein privates Investitionsportal. Der Zugang wird nur verifizierten Investoren gewährt.',
    needAssistance: 'Brauchst du Hilfe? Kontaktiere deinen Anlageberater.',
    scheduleMeeting: 'Beratung buchen',
    
    // Dashboard page
    investmentGrowth: 'Investitionswachstum',
    portfolioAllocation: 'Portfolio-Allokation',
    yourProperties: 'Deine Immobilien',
    
    // Events page
    upcomingEvents: 'Kommende Veranstaltungen',
    pastEvents: 'Vergangene Veranstaltungen',
    eventsFound: 'Veranstaltungen gefunden',
    rsvpConfirmed: 'Anmeldung Bestätigt',
    rsvpConfirmedMsg: 'Du hast dich erfolgreich registriert für:',
    downloadStarted: 'Download Gestartet',
    downloadStartedMsg: 'Der Download deiner Aufzeichnung hat begonnen.',
    online: 'Online',
    inPerson: 'Vor Ort',
    viewDetails: 'Details Anzeigen',
    rsvp: 'Anmelden',
    capacity: 'Kapazität',
    limitedTo: 'Begrenzt auf',
    investors: 'Investoren',
    unlimited: 'Unbegrenzt',
    exclusiveEvents: 'Exklusive Investitionsveranstaltungen und Networking-Möglichkeiten',
    
    // Network page
    investorNetwork: 'Investorennetzwerk',
    connectInvestors: 'Verbinde dich mit anderen exklusiven Investoren in der EasyROI-Community',
    searchInvestors: 'Suche nach Name, Standort oder Investitionsinteresse...',
    investorsFound: 'Investoren gefunden',
    connectionSent: 'Verbindungsanfrage Gesendet',
    connectionSentMsg: 'Deine Verbindungsanfrage wurde gesendet an',
    messageCenter: 'Nachrichtenzentrale',
    openingConversation: 'Öffne Konversation mit',
    message: 'Nachricht',
    connect: 'Verbinden',
    properties_count: 'Immobilien',
    
    // Analytics page
    comprehensiveAnalysis: 'Umfassende Datenanalyse deines Investitionsportfolios',
    portfolioROI: 'Portfolio-ROI',
    annualGrowth: 'Jährliches Wachstum',
    marketComparison: 'Marktvergleich',
    aboveIndex: 'Über dem Index',
    vsMarketAverage: 'vs. Marktdurchschnitt',
    vsPreviousYear: 'vs. Vorjahr',
    roiPerformance: 'ROI-Performance',
    yourPortfolio: 'Dein Portfolio',
    marketAverage: 'Marktdurchschnitt',
    assetAllocation: 'Asset-Allokation',
    allocation: 'Allokation',
    geographicDistribution: 'Geografische Verteilung',
    historicalROI: 'Historische ROI-Performance',
    annualROI: 'Jährlicher ROI',
    
    // Landing page
    premiumRealEstate: 'Premium-Immobilien',
    exceptionalReturns: 'Außergewöhnliche Renditen',
    exclusiveAccess: 'Exklusiver Zugang zu renditestarken internationalen Immobilieninvestitionen.',
    startInvesting: 'Jetzt Investieren',
    scroll: 'SCROLLEN',
    curated: 'Sorgfältig zusammengestelltes Luxusportfolio',
    curatedDesc: 'Zugang zu exklusiven Immobilienangeboten, die auf dem offenen Markt nicht verfügbar sind.',
    premiumProperties: 'Premium-Immobilien',
    premiumPropertiesDesc: 'Zugang zu exklusiven Immobilien in Italien, Dubai und anderen Luxusmärkten.',
    portfolioAnalytics: 'Portfolio-Analysen',
    portfolioAnalyticsDesc: 'Verfolge Investitionen mit umfassender Echtzeitdatenanalyse.',
    securePlatform: 'Sichere Plattform',
    securePlatformDesc: 'Unternehmenssichere Plattform für deine Investitionen und Daten.',
    featuredLocations: 'Ausgewählte Standorte',
    readyToMaximize: 'Bereit, dein Investitionspotenzial zu maximieren?',
    scheduleMeeting: 'Beratung buchen',
    
    // Settings page
    configurePreferences: 'Konfiguriere deine Kontoeinstellungen und Präferenzen',
    notificationChannels: 'Benachrichtigungskanäle',
    emailNotifications: 'E-Mail-Benachrichtigungen',
    smsNotifications: 'SMS-Benachrichtigungen',
    notificationTypes: 'Benachrichtigungstypen',
    propertyAlerts: 'Immobilien-Alerts & Updates',
    eventReminders: 'Veranstaltungserinnerungen',
    marketingNewsletter: 'Marketing & Newsletter',
    authentication: 'Authentifizierung',
    twoFactorAuth: 'Zwei-Faktor-Authentifizierung',
    twoFactorDesc: 'Füge eine zusätzliche Sicherheitsebene zu deinem Konto hinzu.',
    loginAlerts: 'Login-Benachrichtigungen',
    loginAlertsDesc: 'Erhalte Benachrichtigungen, wenn sich jemand in dein Konto einloggt.',
    passwordManagement: 'Passwortverwaltung',
    changePassword: 'Passwort Ändern',
    sessionManagement: 'Sitzungsverwaltung',
    sessionTimeout: 'Automatisches Sitzungs-Timeout',
    sessionTimeoutDesc: 'Wähle, wie lange es dauert, bis deine Sitzung abläuft.',
    displayCurrency: 'Anzeigewährung',
    timezone: 'Zeitzone',
    contactInformation: 'Kontaktinformationen',
    primaryEmail: 'Primäre E-Mail-Adresse',
    phoneNumber: 'Telefonnummer',
    verify: 'Verifizieren',
    minutes: 'Minuten',
    hour: 'Stunde',
    hours: 'Stunden',
    
    // Language change messages
    languageChanged: 'Language changed to English',
    languageChankedItalian: 'Lingua cambiata in Italiano',
    languageChangedSpanish: 'Idioma cambiado a Español',
    languageChangedGerman: 'Sprache auf Deutsch geändert',
    
    // Registration page
    firstNameRequired: 'Vorname ist erforderlich',
    lastNameRequired: 'Nachname ist erforderlich',
    invalidEmail: 'Ungültige E-Mail-Adresse',
    passwordMinChars: 'Passwort muss mindestens 8 Zeichen enthalten',
    acceptTermsRequired: 'Du musst die Allgemeinen Geschäftsbedingungen akzeptieren',
    passwordsNotMatch: 'Passwörter stimmen nicht überein',
    registrationSuccess: 'Registrierung erfolgreich!',
    accountCreated: 'Dein Konto wurde erstellt.',
    firstName: 'Vorname',
    lastName: 'Nachname',
    confirmPassword: 'Passwort bestätigen',
    iAccept: 'Ich akzeptiere die',
    termsAndConditions: 'Allgemeinen Geschäftsbedingungen',
    creatingAccount: 'Konto wird erstellt...',
    alreadyHaveAccount: 'Hast du bereits ein Konto?',
    joinCommunity: 'Tritt unserer exklusiven Investorengemeinschaft bei',
    firstNamePlaceholder: 'Hans',
    lastNamePlaceholder: 'Schmidt',
    
    // Properties page
    filterProperties: 'Immobilien filtern',
    showFilters: 'Filter anzeigen',
    hideFilters: 'Filter ausblenden',
    allLocations: 'Alle Standorte',
    allPrices: 'Alle Preise',
    allLevels: 'Alle Stufen',
    priceRange: 'Preisbereich',
    investorLevel: 'Investorenstufe',
    resetFilters: 'Filter zurücksetzen',
    applyFilters: 'Filter anwenden',
    minInvestment: 'Mindestinvestition',
    expectedROI: 'Erwarteter ROI',
    exclusiveProperties: 'Exklusive Immobilien',
    discoverProperties: 'Entdecke unsere handverlesene Auswahl an Luxusimmobilieninvestitionen an erstklassigen Standorten weltweit.',
    amenities: 'Ausstattung',
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
