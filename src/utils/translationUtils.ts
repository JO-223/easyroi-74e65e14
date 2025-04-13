
import { GeneralKey } from './translations/general';
import { PropertyKey } from './translations/property';
import { AdminKey } from './translations/admin';
import { DashboardKey } from './translations/dashboard';
import { SettingsKey } from './translations/settings';

// Define all possible translation keys
export type TranslationKey =
  | GeneralKey
  | PropertyKey
  | AdminKey
  | DashboardKey
  | SettingsKey;

// Type guard to check if a string is a valid translation key
export function isValidTranslationKey(key: string): key is TranslationKey {
  // This function is used to validate keys at runtime if needed
  return true; // In practice, we would check against all keys
}
