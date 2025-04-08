
import { supabase } from "@/integrations/supabase/client";
import { MessageData } from "./types";

/**
 * Sends a message to another user
 */
export async function sendMessage(recipientId: string, content: string): Promise<boolean> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;
    
    const { error } = await supabase.rpc(
      'send_message',
      {
        p_sender_id: user.id,
        p_recipient_id: recipientId,
        p_content: content
      }
    );
    
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
    const { data, error } = await supabase.rpc(
      'get_conversation',
      {
        p_user1_id: user.id,
        p_user2_id: otherUserId
      }
    );
      
    if (error) throw error;
    
    // Mark messages as read
    await supabase.rpc(
      'mark_messages_as_read',
      {
        p_recipient_id: user.id,
        p_sender_id: otherUserId
      }
    );
    
    // Ensure we return an array, even if data is not what we expect
    return Array.isArray(data) ? data as MessageData[] : [];
  } catch (error) {
    console.error('Error getting conversation:', error);
    return [];
  }
}
