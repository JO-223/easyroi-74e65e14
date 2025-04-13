
import { supabase } from "@/integrations/supabase/client";

/**
 * Fetches geographic distribution data
 */
export async function fetchGeographicDistribution(userId: string) {
  const { data, error } = await supabase
    .from('user_portfolio_allocation')
    .select('location, percentage')
    .eq('user_id', userId);
    
  if (error) console.error("Error fetching geo distribution data:", error);
  return data;
}
