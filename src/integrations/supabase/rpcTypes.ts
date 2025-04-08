
// Type definitions for Supabase RPC functions
import { PostgrestSingleResponse } from "@supabase/supabase-js";

export type GetUserNotificationsResponse = {
  id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  created_at: string;
}[];

export type GetNotificationSettingsResponse = {
  email_notifications: boolean;
  push_notifications: boolean;
}[];

export type ProfileVisibilityResponse = {
  visibility: string;
}[];

export type GetProfileByIdResponse = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  visibility: string;
  email: string;
  avatar_url: string | null;
}[];

export type GetPrivacySettingsResponse = {
  public_profile: boolean;
  data_sharing: boolean;
}[];

// Response types for our RPC functions
export interface RPCResponses {
  get_user_notifications: GetUserNotificationsResponse;
  mark_notifications_as_read: null;
  send_message: null;
  get_conversation: any[];
  mark_messages_as_read: null;
  create_connection_request: null;
  update_connection_status: null;
  delete_user_connection: null;
  get_notification_settings: GetNotificationSettingsResponse;
  update_notification_settings: null;
  get_profile_by_id: GetProfileByIdResponse;
  get_privacy_settings: GetPrivacySettingsResponse;
  update_privacy_settings: null;
  update_profile_visibility: null;
  get_user_profile_visibility: ProfileVisibilityResponse;
  get_network_investors: any[];
  get_visible_profiles: any[];
  get_user_connections: any[];
}

// Type for RPC function parameters 
export interface RPCParams {
  get_user_notifications: { p_user_id: string };
  mark_notifications_as_read: { p_notification_ids: string[] };
  send_message: { p_sender_id: string; p_recipient_id: string; p_content: string };
  get_conversation: { p_user1_id: string; p_user2_id: string };
  mark_messages_as_read: { p_recipient_id: string; p_sender_id: string };
  create_connection_request: { p_from_id: string; p_to_id: string };
  update_connection_status: { p_connection_id: string; p_status: string };
  delete_user_connection: { p_from_id: string; p_to_id: string };
  get_notification_settings: { p_user_id: string };
  update_notification_settings: { p_user_id: string; p_email_notifications: boolean; p_push_notifications: boolean };
  get_profile_by_id: { p_user_id: string };
  get_privacy_settings: { p_user_id: string };
  update_privacy_settings: { p_user_id: string; p_public_profile: boolean; p_data_sharing: boolean };
  update_profile_visibility: { p_user_id: string; p_visibility: string };
  get_user_profile_visibility: { p_user_id: string };
  get_network_investors: Record<string, never>;
  get_visible_profiles: { p_current_user_id: string };
  get_user_connections: { p_user_id: string };
}

// Helper type to ensure type safety when calling RPC functions
export type SupabaseRPC = {
  rpc<T extends keyof RPCResponses>(
    fn: T,
    params?: RPCParams[T],
    options?: { head: boolean } | { count: null | 'exact' | 'planned' | 'estimated' }
  ): Promise<PostgrestSingleResponse<RPCResponses[T]>>;
};
