
import { generalKeys, GeneralKey } from './general';
import { propertyKeys, PropertyKey } from './property';
import { developmentKeys, DevelopmentKey } from './development';
import { adminKeys, AdminKey } from './admin';
import { dashboardKeys, DashboardKey } from './dashboard';
import { settingsKeys, SettingsKey } from './settings';
import { analyticsKeys, AnalyticsKey } from './analytics';
import { eventsKeys, EventsKey } from './events';
import { networkKeys, NetworkKey } from './network';
import { profileKeys, ProfileKey } from './profile';
import { landingKeys, LandingKey } from './landing';
import { aboutKeys, AboutKey } from './about';
import { contactKeys, ContactKey } from './contact';
import { authKeys, AuthKey } from './auth';
import { uiKeys, UiKey } from './ui';
import { miscKeys, MiscKey } from './misc';
import { tooltipKeys, TooltipKey } from './tooltip';

// Union of all translation keys
export type TranslationKey =
  | GeneralKey
  | PropertyKey
  | DevelopmentKey
  | AdminKey
  | DashboardKey
  | SettingsKey
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
  | TooltipKey;

// Array of all translation keys, useful for validation
const allTranslationKeys = [
  ...generalKeys,
  ...propertyKeys,
  ...developmentKeys,
  ...adminKeys,
  ...dashboardKeys,
  ...settingsKeys,
  ...analyticsKeys,
  ...eventsKeys,
  ...networkKeys,
  ...profileKeys,
  ...landingKeys,
  ...aboutKeys,
  ...contactKeys,
  ...authKeys,
  ...uiKeys,
  ...miscKeys,
  ...tooltipKeys
] as const;

// Function to check if a string is a valid translation key
export const isValidTranslationKey = (key: string): key is TranslationKey => {
  return (allTranslationKeys as readonly string[]).includes(key);
};

// Export all key categories for organization
export {
  generalKeys,
  propertyKeys,
  developmentKeys,
  adminKeys,
  dashboardKeys,
  settingsKeys,
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
  tooltipKeys
};
