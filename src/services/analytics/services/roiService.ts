
import { supabase } from "@/integrations/supabase/client";

/**
 * Fetches portfolio ROI data for a specific user
 */
export async function fetchRoiData(userId: string) {
  const { data, error } = await supabase
    .from('user_roi')
    .select('average_roi, roi_change')
    .eq('user_id', userId)
    .maybeSingle();
    
  if (error) console.error("Error fetching ROI data:", error);
  return data;
}
