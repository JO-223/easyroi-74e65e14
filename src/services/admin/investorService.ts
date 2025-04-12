
import { supabase } from "@/integrations/supabase/client";
import { Investor, InvestorRpcResponse, RpcResponse } from "@/types/admin";
import { ensureTypedResponse } from "./utils";

// Fetch investors for admin forms
export const fetchInvestors = async (): Promise<Investor[]> => {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("id, first_name, last_name, email, level")
      .eq("is_active", true)
      .order("first_name", { ascending: true });

    if (error) {
      console.error("Error fetching investors:", error);
      throw new Error("Failed to fetch investors");
    }

    return ensureTypedResponse<Investor>(data);
  } catch (error) {
    console.error("Error in fetchInvestors:", error);
    throw error;
  }
};

// Crea un nuovo investitore
export const addNewInvestor = async (investorData: {
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
}): Promise<InvestorRpcResponse> => {
  const { data, error } = await supabase.rpc('add_new_investor', {
    p_user_id: investorData.user_id,
    p_first_name: investorData.first_name,
    p_last_name: investorData.last_name,
    p_email: investorData.email
  });

  if (error) {
    console.error("Error adding investor:", error);
    throw error;
  }

  // Ensure proper response structure
  return {
    success: data?.success === true,
    message: data?.message || "Unknown response status",
    user_id: data?.user_id
  };
};

// Crea un nuovo utente owner (mediante edge function)
export const createOwnerUser = async (userData: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}): Promise<{id: string}> => {
  try {
    const { data, error } = await supabase.functions.invoke('create-owner-user', {
      body: userData
    });

    if (error) {
      console.error("Edge function error:", error);
      throw new Error(`Failed to create user: ${error.message}`);
    }

    if (!data || !data.id) {
      throw new Error("Invalid response from edge function");
    }

    return { id: data.id };
  } catch (error) {
    console.error("Error creating owner user:", error);
    throw error;
  }
};
