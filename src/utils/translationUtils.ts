
import { generalKeys } from './translations/general';
import { propertyKeys } from './translations/property';
import { adminKeys } from './translations/admin';
import { dashboardKeys } from './translations/dashboard';
import { settingsKeys } from './translations/settings';
import { developmentKeys } from './translations/development';
import { analyticsKeys } from './translations/analytics';
import { eventsKeys } from './translations/events';
import { networkKeys } from './translations/network';
import { profileKeys } from './translations/profile';
import { landingKeys } from './translations/landing';
import { aboutKeys } from './translations/about';
import { contactKeys } from './translations/contact';
import { authKeys } from './translations/auth';
import { uiKeys } from './translations/ui';
import { miscKeys } from './translations/misc';
import { tooltipKeys } from './translations/tooltip';
import { investorKeys } from './translations/investor';
import { legalKeys } from './translations/legal';
import { consultationKeys } from './translations/consultation';

// All translation keys combined
export type TranslationKey = 
  | typeof generalKeys[number]
  | typeof propertyKeys[number]
  | typeof adminKeys[number]
  | typeof dashboardKeys[number]
  | typeof settingsKeys[number]
  | typeof developmentKeys[number]
  | typeof analyticsKeys[number]
  | typeof eventsKeys[number]
  | typeof networkKeys[number]
  | typeof profileKeys[number]
  | typeof landingKeys[number]
  | typeof aboutKeys[number]
  | typeof contactKeys[number]
  | typeof authKeys[number]
  | typeof uiKeys[number]
  | typeof miscKeys[number]
  | typeof tooltipKeys[number]
  | typeof investorKeys[number]
  | typeof legalKeys[number]
  | typeof consultationKeys[number]
  | string; // <-- Allow any string for dynamic translations

// Utility to check if a key is a valid translation key
export function isValidTranslationKey(key: string): key is TranslationKey {
  return true; // For now we allow all strings
}
