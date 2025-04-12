
import { supabase } from "@/integrations/supabase/client";
import { Investor, NewInvestorData } from "@/types/admin";
import { ensureTypedResponse, RpcResponse } from "./utils";

// Fetch investors from the database
export const fetchInvestors = async (): Promise<Investor[]> => {
  const { data, error } = await supabase
    .rpc('fetch_active_investors');

  if (error) {
    console.error("Error fetching investors:", error);
    throw new Error("Failed to fetch investors");
  }

  return ensureTypedResponse<Investor>(data);
};

/**
 * Crea un nuovo utente tramite la edge function "create-owner-user".
 * Restituisce un oggetto contenente { success, message, user }.
 */
export const createOwnerUser = async (userData: { email: string; password: string; firstName: string; lastName: string; }) => {
  const { email, password, firstName, lastName } = userData;
  const response = await supabase.functions.invoke("create-owner-user", {
    body: { email, password, firstName, lastName }
  });

  if (response.error) {
    throw new Error(response.error.message);
  }

  const responseData = response.data as { success: boolean; message: string; user: any };
  if (!responseData.success) {
    throw new Error(responseData.message);
  }
  return responseData.user;  // Contiene almeno { id, ... }
};

/**
 * Richiama la funzione RPC "add_new_investor" per completare la registrazione dell'investitore.
 * Restituisce l'oggetto JSON con { success, message, user_id }.
 */
export const addNewInvestor = async (investorData: NewInvestorData) => {
  console.log("Calling addNewInvestor RPC with data:", investorData);
  
  const { data, error } = await supabase.rpc("add_new_investor", {
    p_user_id: investorData.user_id,
    p_first_name: investorData.first_name,
    p_last_name: investorData.last_name,
    p_email: investorData.email,
    p_initial_investment: investorData.initialInvestment,
  });

  if (error) {
    console.error("RPC error:", error);
    throw new Error(error.message);
  }
  
  console.log("RPC response:", data);
  const typedData = data as RpcResponse;
  if (!typedData || !typedData.success) {
    throw new Error(typedData?.message || "Error adding investor");
  }
  return typedData;
};
