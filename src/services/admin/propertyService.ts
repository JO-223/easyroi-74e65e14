
import { supabase } from "@/integrations/supabase/client";
import { 
  NewPropertyData, 
  NewForSalePropertyData,
  AdminProperty,
  PropertyRpcResponse,
  RpcResponse
} from "@/types/admin";
import { PropertyType } from "@/types/property";
import { ensureTypedResponse } from "./utils";

// Fetch property types from the database
export const fetchPropertyTypes = async (): Promise<PropertyType[]> => {
  const { data, error } = await supabase
    .from("property_types")
    .select("id, name, description")
    .order("name", { ascending: true });

  if (error) {
    console.error("Error fetching property types:", error);
    throw new Error("Failed to fetch property types");
  }

  return ensureTypedResponse<PropertyType>(data);
};

// Fetch properties list for admin forms (simplified version with just id and name)
export const fetchProperties = async (): Promise<AdminProperty[]> => {
  const { data, error } = await supabase
    .from("properties")
    .select("id, name")
    .order("name", { ascending: true });

  if (error) {
    console.error("Error fetching properties:", error);
    throw new Error("Failed to fetch properties");
  }

  return ensureTypedResponse<AdminProperty>(data);
};

export const addPropertyForUser = async (userId: string, propertyData: NewPropertyData): Promise<PropertyRpcResponse> => {
  console.log("Adding property for user:", userId, propertyData);
  
  const { data, error } = await supabase.rpc('add_property_for_user', {
    p_user_id: userId,
    p_name: propertyData.name,
    p_address: propertyData.address,
    p_city: propertyData.city,
    p_country: propertyData.country,
    p_zone: propertyData.zone,
    p_type_id: propertyData.typeId,
    p_price: propertyData.price,
    p_size_sqm: propertyData.sizeSqm,
    p_bedrooms: propertyData.bedrooms,
    p_bathrooms: propertyData.bathrooms,
    p_occupation_status: propertyData.occupationStatus,
    p_status: propertyData.status,
    p_price_currency: propertyData.price_currency,
    p_listing_status: propertyData.listing_status,
    p_roi_percentage: propertyData.roiPercentage || null,
    p_service_charges: propertyData.serviceCharges || null
  });

  if (error) {
    console.error("Error adding property for user:", error);
    throw error;
  }
  
  // Log the complete response for debugging
  console.log("RPC Response:", data);
  
  // Check if data is properly structured and has the expected format
  if (!data || typeof data !== 'object') {
    throw new Error("Invalid response format from add_property_for_user RPC");
  }
  
  // Properly cast the response to our expected type
  const response = data as PropertyRpcResponse;
  
  // Ensure proper response structure with default values if needed
  return {
    success: response.success === true, // Explicitly check for true
    message: response.message || "Unknown response status",
    property_id: response.property_id
  };
};

export const addPropertyForSale = async (propertyData: NewForSalePropertyData): Promise<PropertyRpcResponse> => {
  const { data, error } = await supabase.rpc('add_property_for_sale', {
    p_name: propertyData.name,
    p_address: propertyData.address,
    p_city: propertyData.city,
    p_country: propertyData.country,
    p_zone: propertyData.zone,
    p_type_id: propertyData.typeId,
    p_price: propertyData.price,
    p_size_sqm: propertyData.sizeSqm,
    p_bedrooms: propertyData.bedrooms,
    p_bathrooms: propertyData.bathrooms,
    p_min_investment: propertyData.minInvestment || null,
    p_roi_percentage: propertyData.roiPercentage || null,
    p_investor_level: propertyData.investorLevel || 'bronze'
  });

  if (error) {
    console.error("Error adding property for sale:", error);
    throw error;
  }
  
  // Log the complete response for debugging
  console.log("RPC Response:", data);
  
  // Check if data is properly structured
  if (!data || typeof data !== 'object') {
    throw new Error("Invalid response format from add_property_for_sale RPC");
  }
  
  // Properly cast the response
  const response = data as PropertyRpcResponse;
  
  return {
    success: response.success === true,
    message: response.message || "Unknown response status",
    property_id: response.property_id
  };
};
