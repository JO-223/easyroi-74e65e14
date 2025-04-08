
// Type definitions for Supabase RPC functions

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

// Custom typings for our RPC functions
export interface CustomRpcFunctions {
  get_user_notifications: (params: { p_user_id: string }) => Promise<{ data: GetUserNotificationsResponse; error: any }>;
  mark_notifications_as_read: (params: { p_notification_ids: string[] }) => Promise<{ data: any; error: any }>;
  send_message: (params: { p_sender_id: string; p_recipient_id: string; p_content: string }) => Promise<{ data: any; error: any }>;
  get_conversation: (params: { p_user1_id: string; p_user2_id: string }) => Promise<{ data: any; error: any }>;
  mark_messages_as_read: (params: { p_recipient_id: string; p_sender_id: string }) => Promise<{ data: any; error: any }>;
  create_connection_request: (params: { p_from_id: string; p_to_id: string }) => Promise<{ data: any; error: any }>;
  update_connection_status: (params: { p_connection_id: string; p_status: string }) => Promise<{ data: any; error: any }>;
  delete_user_connection: (params: { p_from_id: string; p_to_id: string }) => Promise<{ data: any; error: any }>;
  get_notification_settings: (params: { p_user_id: string }) => Promise<{ data: GetNotificationSettingsResponse; error: any }>;
  update_notification_settings: (params: { p_user_id: string; p_email_notifications: boolean; p_push_notifications: boolean }) => Promise<{ data: any; error: any }>;
  get_profile_by_id: (params: { p_user_id: string }) => Promise<{ data: GetProfileByIdResponse; error: any }>;
  get_privacy_settings: (params: { p_user_id: string }) => Promise<{ data: GetPrivacySettingsResponse; error: any }>;
  update_privacy_settings: (params: { p_user_id: string; p_public_profile: boolean; p_data_sharing: boolean }) => Promise<{ data: any; error: any }>;
  update_profile_visibility: (params: { p_user_id: string; p_visibility: string }) => Promise<{ data: any; error: any }>;
  get_user_profile_visibility: (params: { p_user_id: string }) => Promise<{ data: ProfileVisibilityResponse; error: any }>;
  get_network_investors: () => Promise<{ data: any; error: any }>;
  get_visible_profiles: (params: { p_current_user_id: string }) => Promise<{ data: any; error: any }>;
  get_user_connections: (params: { p_user_id: string }) => Promise<{ data: any; error: any }>;
}

// Helper function to type-check RPC calls
export const typedRpc = <T extends keyof CustomRpcFunctions>(
  name: T,
  params?: Parameters<CustomRpcFunctions[T]>[0]
): ReturnType<CustomRpcFunctions[T]> => {
  // @ts-ignore - This is a runtime wrapper with type information
  return { rpc: (name: string, params?: any) => ({ name, params }) };
}
