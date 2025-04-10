
import { supabase } from "@/integrations/supabase/client";

export interface AddPropertyParams {
  user_id: string;
  name: string;
  location: string;
  value: number;
  roi: number;
  status: string;
}

export interface User {
  id: string;
  email: string;
  name?: string;
}

/**
 * Add a new property for a specific user and update all related tables
 */
export async function addNewPropertyForUser(params: AddPropertyParams): Promise<{success: boolean; error?: string; property_id?: string}> {
  try {
    const { data, error } = await supabase.functions.invoke('add-property-for-user', {
      body: JSON.stringify(params)
    });
    
    if (error) {
      return { success: false, error: error.message };
    }
    
    if (!data.success) {
      return { success: false, error: data.error || 'Unknown error' };
    }
    
    return { success: true, property_id: data.property_id };
  } catch (error) {
    console.error("Error adding property:", error);
    return { success: false, error: error.message || 'Unknown error occurred' };
  }
}

/**
 * Get all users with basic profile information for admin selection
 */
export async function getUsers(): Promise<User[]> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, email, first_name, last_name');
    
    if (error) {
      throw error;
    }
    
    return data.map(user => ({
      id: user.id as string,
      email: user.email as string,
      name: `${user.first_name || ''} ${user.last_name || ''}`.trim() || undefined
    }));
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
}
