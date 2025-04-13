
import { QueryClient } from "@tanstack/react-query";

/**
 * Utility per l'invalidazione coerente delle query React Query
 */

/**
 * Tipi di query che possono essere invalidate
 */
type QueryType = 
  | 'user'
  | 'properties'
  | 'portfolio'
  | 'dashboard'
  | 'investments'
  | 'projects'
  | 'events'
  | 'network'
  | 'notifications';

/**
 * Mappa delle queryKey per ogni tipo di query
 */
const queryKeyMap: Record<QueryType, string[]> = {
  user: ['user', 'userLevel', 'userProfile'],
  properties: ['properties', 'userProperties', 'propertyDetails'],
  portfolio: ['portfolio', 'allocation', 'userInvestments'],
  dashboard: ['dashboard', 'dashboardStats', 'investmentGrowth'],
  investments: ['investments', 'roi', 'investmentDetails'],
  projects: ['projects', 'developmentProjects'],
  events: ['events', 'eventDetails', 'eventRegistrations'],
  network: ['network', 'connections', 'investors'],
  notifications: ['notifications']
};

/**
 * Invalidazione di un tipo specifico di query
 * 
 * @param queryClient - Il QueryClient di React Query
 * @param type - Il tipo di query da invalidare
 * @param specificKey - Una chiave specifica da invalidare (opzionale)
 */
export function invalidateQueries(
  queryClient: QueryClient,
  type: QueryType,
  specificKey?: string
): void {
  const keys = queryKeyMap[type];
  
  if (specificKey) {
    // Invalida una query specifica all'interno del tipo
    queryClient.invalidateQueries({
      queryKey: [specificKey],
    });
    return;
  }
  
  // Invalida tutte le query del tipo specificato
  keys.forEach(key => {
    queryClient.invalidateQueries({
      queryKey: [key],
    });
  });
}

/**
 * Invalidazione di tutte le query relative ai dati dell'utente
 * Utile dopo operazioni che modificano più aspetti contemporaneamente
 * 
 * @param queryClient - Il QueryClient di React Query
 */
export function invalidateAllUserData(queryClient: QueryClient): void {
  [
    'user',
    'properties',
    'portfolio',
    'dashboard',
    'investments'
  ].forEach(type => {
    invalidateQueries(queryClient, type as QueryType);
  });
}
