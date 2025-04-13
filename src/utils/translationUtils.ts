
import { eventsKeys } from "@/utils/translations/events";
import { searchKeys } from "@/utils/translations/search";
import { developmentKeys } from "@/utils/translations/development";
import { eventKeys } from "@/utils/translations/event";

// Combine all translation keys together
export type TranslationKey = 
  | typeof eventsKeys[number]
  | typeof searchKeys[number]
  | typeof developmentKeys[number]
  | typeof eventKeys[number]
  | string; // Allow for other translation keys not explicitly defined

// Function to check if a string is a valid translation key (not comprehensive)
export const isValidTranslationKey = (key: string): key is TranslationKey => {
  // Simple implementation - we're allowing string keys so this will always return true
  // In a more comprehensive implementation, we would check against an array of known keys
  return typeof key === 'string';
};
