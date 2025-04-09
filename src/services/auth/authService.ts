
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

/**
 * Creates the demo platinum user if it doesn't exist yet
 */
export async function createDemoPlatinumUser(): Promise<boolean> {
  try {
    // Check if user already exists
    const { data } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', 'demo.platinum@easyroi.com')
      .maybeSingle();
    
    if (data?.id) {
      console.log("Demo Platinum user already exists");
      return true;
    }

    // Create the user if doesn't exist
    const { data: newUser, error: signUpError } = await supabase.auth.signUp({
      email: 'demo.platinum@easyroi.com',
      password: 'EasyROI2025!',
      options: {
        data: {
          first_name: 'Demo',
          last_name: 'Platinum',
        }
      }
    });

    if (signUpError) {
      console.error("Error creating demo user:", signUpError);
      return false;
    }

    // The user was created, now we need to call the function to set up demo data
    if (newUser.user) {
      const { error } = await supabase.rpc('insert_demo_platinum_data', {
        p_user_id: newUser.user.id
      });
      
      if (error) {
        console.error("Error inserting demo data:", error);
        return false;
      }
      
      return true;
    }
    
    return false;
  } catch (error) {
    console.error("Error in createDemoPlatinumUser:", error);
    return false;
  }
}

/**
 * Handles user login and creates demo user if needed
 */
export async function loginUser(email: string, password: string): Promise<boolean> {
  try {
    // Try to sign in
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    // If login fails for demo account, try to create it
    if (error && email === 'demo.platinum@easyroi.com') {
      console.log("Creating demo platinum user...");
      const created = await createDemoPlatinumUser();
      if (created) {
        // Try login again
        const { error: secondLoginError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        return !secondLoginError;
      }
      return false;
    }

    return !error;
  } catch (error) {
    console.error("Login error:", error);
    return false;
  }
}

/**
 * Signs out the current user
 */
export async function signOut(): Promise<void> {
  await supabase.auth.signOut();
}
