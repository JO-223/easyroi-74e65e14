import { supabase } from "@/integrations/supabase/client";
import { NewInvestorData } from "@/types/admin";
import { RpcResponse } from "./utils";

export const addNewInvestor = async (investorData: NewInvestorData): Promise<RpcResponse> => {
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

  return {
    success: true,
    message: "Investor added successfully",
    user_id: data?.user_id
  };
};
