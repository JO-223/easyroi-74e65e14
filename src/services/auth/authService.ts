
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
 */
export async function loginDemoPlatinumUser(): Promise<boolean> {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'demo.platinum@easyroi.com',
      password: 'EasyROI2025!',
    });
    
    return !error;
  } catch (error) {
    console.error("Demo login error:", error);
    return false;
  }
}

/**
 * Signs out the current user
 */
export async function signOut(): Promise<void> {
  await supabase.auth.signOut();
}
