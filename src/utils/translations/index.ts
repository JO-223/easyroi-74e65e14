
import { generalKeys, GeneralKey } from './general';
import { propertyKeys, PropertyKey } from './property';
import { developmentKeys, DevelopmentKey } from './development';
import { investorKeys, InvestorKey } from './investor';
import { eventsKeys, EventsKey } from './events';
import { networkKeys, NetworkKey } from './network';
import { settingsKeys, SettingsKey } from './settings';
import { adminKeys, AdminKey } from './admin';
import { uiKeys, UiKey } from './misc';
import { miscKeys, MiscKey } from './misc';
import { analyticsKeys, AnalyticsKey } from './analytics';
import { landingKeys, LandingKey } from './landing';
import { authKeys, AuthKey } from './auth';
import { aboutKeys, AboutKey } from './about';
import { contactKeys, ContactKey } from './contact';
import { profileKeys, ProfileKey } from './profile';

// Unione di tutte le chiavi di traduzione
export type TranslationKey =
  | GeneralKey
  | PropertyKey
  | DevelopmentKey
  | InvestorKey
  | EventsKey
  | NetworkKey
  | SettingsKey
  | AdminKey
  | UiKey
  | MiscKey
  | AnalyticsKey
  | LandingKey
  | AuthKey
  | AboutKey
  | ContactKey
  | ProfileKey;

// Array di tutte le chiavi, utile per la validazione
const allTranslationKeys = [
  ...generalKeys,
  ...propertyKeys,
  ...developmentKeys,
  ...investorKeys,
  ...eventsKeys,
  ...networkKeys,
  ...settingsKeys,
  ...adminKeys,
  ...uiKeys,
  ...miscKeys,
  ...analyticsKeys,
  ...landingKeys,
  ...authKeys,
  ...aboutKeys,
  ...contactKeys,
  ...profileKeys
] as const;

// Funzione per verificare se una stringa è una chiave di traduzione valida
export const isValidTranslationKey = (key: string): key is TranslationKey => {
  return (allTranslationKeys as readonly string[]).includes(key);
};

// Esportazione di tutte le categorie di chiavi per facilitare l'organizzazione
export {
  generalKeys,
  propertyKeys,
  developmentKeys,
  investorKeys,
  eventsKeys,
  networkKeys,
  settingsKeys,
  adminKeys,
  uiKeys,
  miscKeys,
  analyticsKeys,
  landingKeys,
  authKeys,
  aboutKeys,
  contactKeys,
  profileKeys
};
