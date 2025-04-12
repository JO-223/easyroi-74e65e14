
import { PostgrestError } from "@supabase/supabase-js";
import { RpcResponse } from "../utils";

/**
 * Parses Supabase error messages into user-friendly formats
 */
export const parseSupabaseError = (error: PostgrestError | Error): string => {
  // Check if it's a PostgrestError
  if ('code' in error) {
    switch (error.code) {
      case '23505': // Unique violation
        if (error.message.includes('email')) {
          return "An investor with this email already exists.";
        }
        return "A record with these details already exists.";
      case '23503': // Foreign key violation
        return "The referenced record doesn't exist.";
      case '23502': // Not null violation
        return "Required information is missing.";
      default:
        return error.message || "An unexpected database error occurred.";
    }
  }
  
  // Regular Error object
  return error.message || "An unexpected error occurred.";
};

/**
 * Validate investor data beyond what Zod can do
 * Returns true if valid, or an error message string if invalid
 */
export const validateInvestorData = (
  firstName: string, 
  lastName: string, 
  email: string
): true | string => {
  // Example extra validation - email domain check
  if (email.endsWith('@example.com')) {
    return "Please use a real email address.";
  }
  
  // Additional validations could be added here
  
  return true;
};

/**
 * Format RPC response for consistent handling
 */
export const formatInvestorResponse = (response: RpcResponse): RpcResponse => {
  return {
    success: response.success,
    message: response.message || (response.success ? "Investor added successfully." : "Failed to add investor."),
    user_id: response.user_id
  };
};
