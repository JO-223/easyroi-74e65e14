
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

export type AddNewInvestorResponse = {
  user_id: string;
  success: boolean;
  message: string;
}[];

export type AddNewPropertyResponse = {
  property_id: string;
  success: boolean;
  message: string;
}[];

export type AddPropertyForSaleResponse = {
  property_id: string;
  success: boolean;
  message: string;
}[];

export type AddNewDevelopmentProjectResponse = {
  project_id: string;
  success: boolean;
  message: string;
}[];

export type AddNewEventResponse = {
  event_id: string;
  success: boolean;
  message: string;
}[];

export type GetPortfolioAllocationByCountryResponse = {
  country: string;
  value: number;
  percentage: number;
  properties_count: number;
}[];

export type UpdateUserDashboardDataResponse = boolean;

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
  update_user_investment: null;
  add_new_investor: AddNewInvestorResponse;
  add_property_for_user: AddNewPropertyResponse;
  add_property_for_sale: AddPropertyForSaleResponse;
  add_new_development_project: AddNewDevelopmentProjectResponse;
  add_new_event: AddNewEventResponse;
  get_portfolio_allocation_by_country: GetPortfolioAllocationByCountryResponse;
  update_user_dashboard_data: UpdateUserDashboardDataResponse;
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
  update_user_investment: { p_user_id: string; p_investment_amount: number };
  add_new_investor: { 
    p_email: string; 
    p_first_name: string; 
    p_last_name: string; 
    p_password: string;
    p_initial_investment?: number;
  };
  add_property_for_user: { 
    p_user_id: string; 
    p_name: string; 
    p_address: string;
    p_city: string;
    p_country: string;
    p_zone: string;
    p_type_id: string;
    p_price: number;
    p_size_sqm: number;
    p_bedrooms: number;
    p_bathrooms: number;
    p_occupation_status: string;
    p_status: string;
    p_roi_percentage?: number;
    p_service_charges?: number;
  };
  add_property_for_sale: { 
    p_name: string; 
    p_address: string;
    p_city: string;
    p_country: string;
    p_zone: string;
    p_type_id: string;
    p_price: number;
    p_size_sqm: number;
    p_bedrooms: number;
    p_bathrooms: number;
    p_min_investment?: number;
    p_roi_percentage?: number;
    p_investor_level?: string;
  };
  add_new_development_project: {
    p_name: string;
    p_description: string;
    p_address: string;
    p_city: string;
    p_country: string;
    p_zone: string;
    p_expected_completion: string;
    p_construction_stage: string;
    p_progress_percentage: number;
    p_total_units: number;
    p_available_units: number;
    p_min_investment?: number;
    p_expected_roi?: number;
    p_investor_level?: string;
  };
  add_new_event: {
    p_title: string;
    p_description: string;
    p_date: string;
    p_time: string;
    p_location: string;
    p_event_type: string;
    p_max_attendees?: number;
    p_property_id?: string;
    p_project_id?: string;
    p_image_url?: string;
    p_is_online: boolean;
    p_required_badges?: string[];
  };
  get_portfolio_allocation_by_country: { user_id: string };
  update_user_dashboard_data: { p_user_id: string };
}

// Helper type to ensure type safety when calling RPC functions
export type SupabaseRPC = {
  rpc<T extends keyof RPCResponses>(
    fn: T,
    params?: RPCParams[T],
    options?: { head: boolean } | { count: null | 'exact' | 'planned' | 'estimated' }
  ): Promise<PostgrestSingleResponse<RPCResponses[T]>>;
};
