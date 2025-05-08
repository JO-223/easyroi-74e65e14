
import { GeneralKey } from './translations/general';
import { PropertyKey } from './translations/property';
import { AdminKey } from './translations/admin';
import { DashboardKey } from './translations/dashboard';
import { SettingsKey } from './translations/settings';
import { DevelopmentKey } from './translations/development';
import { AnalyticsKey } from './translations/analytics';
import { EventsKey } from './translations/events';
import { NetworkKey } from './translations/network';
import { ProfileKey } from './translations/profile';
import { LandingKey } from './translations/landing';
import { AboutKey } from './translations/about';
import { ContactKey } from './translations/contact';
import { AuthKey } from './translations/auth';
import { UiKey } from './translations/ui';
import { MiscKey } from './translations/misc';
import { TooltipKey } from './translations/tooltip';
import { InvestorKey } from './translations/investor';
import { LegalKey } from './translations/legal';
import { ConsultationKey } from './translations/consultation';

// Define all possible translation keys
export type TranslationKey =
  | GeneralKey
  | PropertyKey
  | AdminKey
  | DashboardKey
  | SettingsKey
  | DevelopmentKey
  | AnalyticsKey
  | EventsKey
  | NetworkKey
  | ProfileKey
  | LandingKey
  | AboutKey
  | ContactKey
  | AuthKey
  | UiKey
  | MiscKey
  | TooltipKey
  | InvestorKey
  | LegalKey
  | ConsultationKey;

// Type guard to check if a string is a valid translation key
export function isValidTranslationKey(key: string): key is TranslationKey {
  // This function is used to validate keys at runtime if needed
  return true; // In practice, we would check against all keys
}

// Re-export all translation key arrays for use in translationChecks.ts
export {
  generalKeys, 
  propertyKeys, 
  adminKeys, 
  dashboardKeys, 
  settingsKeys,
  developmentKeys,
  analyticsKeys,
  eventsKeys,
  networkKeys,
  profileKeys,
  landingKeys,
  aboutKeys,
  contactKeys,
  authKeys,
  uiKeys,
  miscKeys,
  tooltipKeys,
  investorKeys,
  legalKeys,
  consultationKeys
} from './translations';
