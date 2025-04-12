
import { supabase } from "@/integrations/supabase/client";

// Helper function to ensure proper typing for supabase responses
export const ensureTypedResponse = <T,>(data: any): T[] => {
  if (!data) return [];
  return data as T[];
};

// Type for Supabase RPC response with success and message
export interface RpcResponse {
  success: boolean;
  message: string;
  [key: string]: any; // For additional fields like user_id, property_id, etc.
}
