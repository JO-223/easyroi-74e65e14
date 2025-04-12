
import { supabase } from "@/integrations/supabase/client";
import { NewInvestorData } from "@/types/admin";
import { RpcResponse } from "./utils";

export interface InvestorRpcResponse extends RpcResponse {
  user_id?: string;
}

// Add new investor through RPC
export const addNewInvestor = async (investorData: NewInvestorData): Promise<InvestorRpcResponse> => {
  const { user_id, email, first_name, last_name, phone, location, bio, level, avatar_url, initialInvestment } = investorData;

  const { data, error } = await supabase.rpc('add_new_investor', {
    p_user_id: user_id,
    p_email: email,
    p_first_name: first_name,
    p_last_name: last_name,
    p_phone: phone,
    p_location: location,
    p_bio: bio,
    p_level: level,
    p_avatar_url: avatar_url,
    p_initial_investment: initialInvestment
  });

  if (error) {
    console.error("Error adding new investor:", error);
    return {
      success: false,
      message: error.message,
    };
  }

  // Explicitly type and check the response
  const typedResponse = data as { user_id?: string };

  return {
    success: true,
    message: "Investor added successfully",
    user_id: typedResponse?.user_id
  };
};

// Fetch active investors
export const fetchInvestors = async () => {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, first_name, last_name, email, level, is_active')
    .eq('is_active', true);

  if (error) {
    console.error("Error fetching investors:", error);
    return [];
  }

  return data || [];
};

// Create owner user via edge function
export const createOwnerUser = async (userData: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}) => {
  try {
    const response = await fetch('/api/create-owner-user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create user');
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating owner user:', error);
    throw error;
  }
};
