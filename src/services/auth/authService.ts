
import { supabase } from "@/integrations/supabase/client";
import { AuthError } from "@supabase/supabase-js";

/**
 * Handles user login with email and password
 */
export async function loginUser(email: string, password: string): Promise<boolean> {
  try {
    console.log("Attempting to sign in with email:", email);
    
    // Try to sign in
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Login error:", error.message);
      return false;
    }
    
    console.log("Login successful, session established");
    return true;
  } catch (error) {
    console.error("Login exception:", error);
    return false;
  }
}

/**
 * Handles demo platinum user login
 * @returns An object with success status and error message if applicable
 */
export async function loginDemoPlatinumUser(): Promise<{ success: boolean; error?: string }> {
  try {
    console.log("Attempting demo login");
    // Fixed password for the demo account - ensure this matches what's in Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'demo.platinum@easyroi.com',
      password: 'EasyROI2025!',
    });
    
    if (error) {
      console.error("Demo login error:", error);
      // Return specific error message for better debugging
      return { 
        success: false, 
        error: error.message || "Unknown login error" 
      };
    }
    
    console.log("Demo login successful");
    return { success: true };
  } catch (error: any) {
    console.error("Demo login exception:", error);
    return { 
      success: false, 
      error: error.message || "An unexpected error occurred during demo login" 
    };
  }
}

/**
 * Signs out the current user
 */
export async function signOut(): Promise<{ success: boolean; error?: string }> {
  try {
    console.log("Signing out user");
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error("Sign out error:", error);
      return {
        success: false,
        error: error.message
      };
    }
    
    console.log("Sign out successful");
    return { success: true };
  } catch (error: any) {
    console.error("Sign out exception:", error);
    return {
      success: false,
      error: error.message || "An unexpected error occurred during sign out"
    };
  }
}

/**
 * Gets the current session if it exists
 */
export async function getCurrentSession() {
  try {
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error("Error fetching session:", error);
      return null;
    }
    
    return data.session;
  } catch (error) {
    console.error("Error in getCurrentSession:", error);
    return null;
  }
}

/**
 * Utility function to handle common auth errors
 */
export function getReadableAuthError(error: AuthError | null): string {
  if (!error) return "Unknown error";
  
  const errorCode = error.message;
  
  if (errorCode.includes("Email not confirmed")) {
    return "Please check your email to confirm your account before logging in.";
  } else if (errorCode.includes("Invalid login credentials")) {
    return "Invalid email or password. Please try again.";
  } else if (errorCode.includes("User not found")) {
    return "No account exists with this email address.";
  } else if (errorCode.includes("Email link is invalid or has expired")) {
    return "The login link is invalid or has expired. Please request a new one.";
  }
  
  return error.message || "An error occurred during authentication.";
}
