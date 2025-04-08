
import { supabase } from "@/integrations/supabase/client";
import { UserRole } from "@/types/property";

export type ProfileVisibility = 'public' | 'semi-public' | 'private';

export interface ProfileData {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string;
  phone: string | null;
  level: UserRole | null;
  bio: string | null;
  location: string | null;
  avatar_url: string | null;
  visibility: ProfileVisibility;
  join_date: string;
}

export interface ConnectionData {
  id: string;
  from_user_id: string;
  to_user_id: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  updated_at: string;
}

export interface MessageData {
  id: string;
  sender_id: string;
  recipient_id: string;
  content: string;
  read: boolean;
  created_at: string;
  updated_at: string;
  sender_name?: string;
  recipient_name?: string;
}

export interface NetworkInvestor {
  id: string;
  name: string;
  email: string;
  level: UserRole;
  role?: string;
  location?: string;
  bio?: string;
  avatar_url?: string;
  join_date: string;
  connection_status?: 'none' | 'pending' | 'connected';
}

/**
 * Fetches network investors with visibility filters applied
 */
export async function getNetworkInvestors(): Promise<NetworkInvestor[]> {
  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];
    
    // Use a stored procedure to get network investors
    const { data, error } = await supabase.rpc('get_network_investors');
    
    if (error) {
      console.error("RPC error:", error);
      // Fallback to direct query using profiles only
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select(`
          id, 
          first_name, 
          last_name, 
          email, 
          level, 
          bio, 
          location, 
          avatar_url,
          join_date,
          visibility
        `)
        .neq('id', user.id)
        .in('visibility', ['public', 'semi-public']);
        
      if (profilesError) throw profilesError;
      if (!profilesData) return [];
      
      return profilesData.map((profile) => ({
        id: profile.id,
        name: `${profile.first_name || ''} ${profile.last_name || ''}`.trim(),
        email: profile.visibility === 'public' ? profile.email : '',
        level: profile.level as UserRole || 'bronze',
        location: profile.location || '',
        bio: profile.bio || '',
        avatar_url: profile.avatar_url || '/placeholder.svg',
        join_date: profile.join_date,
        connection_status: 'none'
      }));
    }
    
    // Return the RPC result directly if it worked
    return data || [];
  } catch (error) {
    console.error('Error fetching network investors:', error);
    return [];
  }
}

/**
 * Sends a connection request to another user
 */
export async function sendConnectionRequest(toUserId: string): Promise<boolean> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;
    
    // Use a stored procedure to create a connection
    const { error } = await supabase.rpc('create_connection_request', {
      from_id: user.id,
      to_id: toUserId
    });
    
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
      conn_id: connectionId,
      status_value: 'accepted'
    });
    
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
      conn_id: connectionId,
      status_value: 'rejected'
    });
    
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
      from_id: user.id,
      to_id: toUserId
    });
    
    return !error;
  } catch (error) {
    console.error('Error removing connection:', error);
    return false;
  }
}

/**
 * Sends a message to another user
 */
export async function sendMessage(recipientId: string, content: string): Promise<boolean> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;
    
    const { error } = await supabase.rpc('send_message', {
      p_sender_id: user.id,
      p_recipient_id: recipientId,
      p_content: content
    });
    
    return !error;
  } catch (error) {
    console.error('Error sending message:', error);
    return false;
  }
}

/**
 * Gets messages between current user and another user
 */
export async function getConversation(otherUserId: string): Promise<MessageData[]> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];
    
    // Get all messages between the two users
    const { data, error } = await supabase.rpc('get_conversation', {
      user1_id: user.id,
      user2_id: otherUserId
    });
      
    if (error) throw error;
    
    // Mark messages as read
    await supabase.rpc('mark_messages_as_read', {
      p_recipient_id: user.id,
      p_sender_id: otherUserId
    });
    
    return data as MessageData[];
  } catch (error) {
    console.error('Error getting conversation:', error);
    return [];
  }
}

/**
 * Gets all notifications for the current user
 */
export async function getNotifications() {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];
    
    const { data, error } = await supabase.rpc('get_user_notifications', {
      p_user_id: user.id
    });
      
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Error getting notifications:', error);
    return [];
  }
}

/**
 * Marks notifications as read
 */
export async function markNotificationsAsRead(notificationIds: string[]) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;
    
    const { error } = await supabase.rpc('mark_notifications_as_read', {
      p_notification_ids: notificationIds
    });
      
    return !error;
  } catch (error) {
    console.error('Error marking notifications as read:', error);
    return false;
  }
}
