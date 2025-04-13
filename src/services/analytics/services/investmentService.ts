
import { supabase } from "@/integrations/supabase/client";

/**
 * Fetches user investment data
 */
export async function fetchInvestmentData(userId: string) {
  const { data, error } = await supabase
    .from('user_investments')
    .select('investment_change_percentage')
    .eq('user_id', userId)
    .maybeSingle();
    
  if (error) console.error("Error fetching investment data:", error);
  return data;
}
