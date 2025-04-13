
import { supabase } from "@/integrations/supabase/client";

/**
 * Tipo per i dati dell'allocazione del portafoglio per paese
 */
export interface CountryAllocation {
  country: string;
  value: number;
  percentage: number;
  properties_count: number;
}

/**
 * Fetches portfolio allocation data aggregated by country
 */
export async function fetchPortfolioByCountry(userId?: string): Promise<CountryAllocation[]> {
  try {
    // Se l'ID utente non è fornito, ottieni l'utente corrente
    if (!userId) {
      const { data: { user } } = await supabase.auth.getUser();
      userId = user?.id;
    }

    if (!userId) {
      throw new Error("User ID not available");
    }

    // Query che aggrega i dati delle proprietà per paese utilizzando la funzione RPC
    const { data, error } = await supabase
      .rpc('get_portfolio_allocation_by_country', { user_id: userId });

    if (error) {
      console.error("Error fetching portfolio allocation by country:", error);
      throw error;
    }

    // Assicuriamoci di restituire sempre un array, anche se vuoto
    return data || [];
  } catch (error) {
    console.error("Error in fetchPortfolioByCountry:", error);
    // Restituisci un array vuoto per corrispondere al tipo di ritorno CountryAllocation[]
    return [];
  }
}

/**
 * Verifica se esiste la funzione RPC per l'aggregazione per paese
 * Se non esiste, possiamo suggerire all'utente di eseguire una migrazione
 */
export async function checkCountryAggregationFunction(): Promise<boolean> {
  try {
    // Tenta di chiamare la funzione RPC senza parametri solo per verificare che esista
    const { error } = await supabase
      .rpc('get_portfolio_allocation_by_country', { user_id: '00000000-0000-0000-0000-000000000000' });
    
    // Se l'errore è relativo ai parametri, la funzione esiste
    return !error || error.message.includes('invalid input');
  } catch (error) {
    // Se otteniamo un'eccezione, la funzione probabilmente non esiste
    return false;
  }
}
