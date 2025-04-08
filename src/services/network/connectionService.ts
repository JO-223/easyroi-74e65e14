
import { supabase } from "@/integrations/supabase/client";

/**
 * Sends a connection request to another user
 */
export async function sendConnectionRequest(toUserId: string): Promise<boolean> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;
    
    // Use a stored procedure to create a connection
    const { error } = await supabase.rpc('create_connection_request', {
      p_from_id: user.id,
      p_to_id: toUserId
    }) as { data: any; error: any };
    
    if (error) {
      console.error("RPC error:", error);
      return false;
    }
      
    return true;
  } catch (error) {
    console.error('Error sending connection request:', error);
    return false;
  }
}

/**
 * Accepts a connection request
 */
export async function acceptConnectionRequest(connectionId: string): Promise<boolean> {
  try {
    const { error } = await supabase.rpc('update_connection_status', {
      p_connection_id: connectionId,
      p_status: 'accepted'
    }) as { data: any; error: any };
    
    return !error;
  } catch (error) {
    console.error('Error accepting connection request:', error);
    return false;
  }
}

/**
 * Rejects a connection request
 */
export async function rejectConnectionRequest(connectionId: string): Promise<boolean> {
  try {
    const { error } = await supabase.rpc('update_connection_status', {
      p_connection_id: connectionId,
      p_status: 'rejected'
    }) as { data: any; error: any };
    
    return !error;
  } catch (error) {
    console.error('Error rejecting connection request:', error);
    return false;
  }
}

/**
 * Removes a connection between users
 */
export async function removeConnection(toUserId: string): Promise<boolean> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;
    
    const { error } = await supabase.rpc('delete_user_connection', {
      p_from_id: user.id,
      p_to_id: toUserId
    }) as { data: any; error: any };
    
    return !error;
  } catch (error) {
    console.error('Error removing connection:', error);
    return false;
  }
}
