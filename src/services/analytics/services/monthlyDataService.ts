
import { supabase } from "@/integrations/supabase/client";
import { MonthlyROIData, MonthlyROIResult } from "../types";

/**
 * Fetches monthly ROI data
 */
export async function fetchMonthlyRoiData(userId: string): Promise<MonthlyROIResult> {
  const { data, error } = await supabase
    .from('user_roi_monthly')
    .select('month, month_index, roi_value')
    .eq('user_id', userId)
    .order('month_index', { ascending: true });

  // Cast the data to ensure it matches MonthlyROIData[] type
  const typedData = data as MonthlyROIData[] | null;
  
  if (error) console.error("Error fetching monthly ROI data:", error);
  return { data: typedData, error };
}
