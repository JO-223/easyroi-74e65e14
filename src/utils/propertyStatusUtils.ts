
import { useLanguage } from "@/contexts/LanguageContext";

/**
 * Tipi di stato delle proprietà
 */
export type PropertyStatus = 'development' | 'active' | 'sold';

/**
 * Hook per ottenere la traduzione localizzata dello stato della proprietà
 * 
 * @returns Funzione che traduce lo stato della proprietà
 */
export function usePropertyStatus() {
  const { t } = useLanguage();
  
  /**
   * Traduce lo stato della proprietà in base alla lingua corrente
   * 
   * @param status - Lo stato della proprietà
   * @returns - Stringa localizzata dello stato
   */
  const getLocalizedStatus = (status: PropertyStatus): string => {
    switch (status) {
      case 'development':
        return t('development');
      case 'active':
        return t('active');
      case 'sold':
        return t('sold');
      default:
        return t('active');
    }
  };
  
  /**
   * Restituisce la classe CSS appropriata per lo stato della proprietà
   * 
   * @param status - Lo stato della proprietà
   * @returns - Classe CSS per lo stato
   */
  const getStatusColorClass = (status: PropertyStatus): string => {
    switch (status) {
      case 'development':
        return 'bg-amber-100 text-amber-800';
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'sold':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  return { getLocalizedStatus, getStatusColorClass };
}
