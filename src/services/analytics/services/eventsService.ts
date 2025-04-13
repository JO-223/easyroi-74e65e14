
import { supabase } from "@/integrations/supabase/client";

/**
 * Fetches events attended count
 */
export async function fetchEventsAttendedData(userId: string) {
  const { data, error } = await supabase
    .from('user_events')
    .select('count')
    .eq('user_id', userId)
    .maybeSingle();
    
  if (error) console.error("Error fetching events data:", error);
  return data;
}
