
import { supabase } from "@/integrations/supabase/client";
import { GetUserNotificationsResponse } from "@/integrations/supabase/rpcTypes";

/**
 * Gets all notifications for the current user
 */
export async function getNotifications() {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];
    
    const { data, error } = await supabase.rpc(
      'get_user_notifications',
      {
        p_user_id: user.id
      }
    );
      
    if (error) throw error;
    
    return data || [];
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
    
    const { error } = await supabase.rpc(
      'mark_notifications_as_read',
      {
        p_notification_ids: notificationIds
      }
    );
      
    return !error;
  } catch (error) {
    console.error('Error marking notifications as read:', error);
    return false;
  }
}
