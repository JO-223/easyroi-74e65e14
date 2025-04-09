
import { supabase } from "@/integrations/supabase/client";

/**
 * Handles user login with email and password
 */
export async function loginUser(email: string, password: string): Promise<boolean> {
  try {
    // Try to sign in
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    return !error;
  } catch (error) {
    console.error("Login error:", error);
    return false;
  }
}

/**
 * Handles demo platinum user login
 * @returns An object with success status and error message if applicable
 */
export async function loginDemoPlatinumUser(): Promise<{ success: boolean; error?: string }> {
  try {
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
export async function signOut(): Promise<void> {
  await supabase.auth.signOut();
}
