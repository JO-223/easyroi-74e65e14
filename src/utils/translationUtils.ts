
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
