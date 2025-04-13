
// File indice principale che esporta tutto dalle categorie
import { TranslationKey, isValidTranslationKey } from './translations';

export type { TranslationKey };
export { isValidTranslationKey };

// Exporting the categories as well for better organization
export * from './translations';
