export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      amenities: {
        Row: {
          created_at: string
          icon: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          icon?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          icon?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      connections: {
        Row: {
          created_at: string
          from_user_id: string
          id: string
          status: string
          to_user_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          from_user_id: string
          id?: string
          status?: string
          to_user_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          from_user_id?: string
          id?: string
          status?: string
          to_user_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "connections_from_user_id_fkey"
            columns: ["from_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "connections_to_user_id_fkey"
            columns: ["to_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      data_imports: {
        Row: {
          completed_at: string | null
          error_details: string | null
          id: string
          import_date: string
          records_created: number | null
          records_failed: number | null
          records_processed: number | null
          records_updated: number | null
          source: string
          status: string | null
        }
        Insert: {
          completed_at?: string | null
          error_details?: string | null
          id?: string
          import_date?: string
          records_created?: number | null
          records_failed?: number | null
          records_processed?: number | null
          records_updated?: number | null
          source: string
          status?: string | null
        }
        Update: {
          completed_at?: string | null
          error_details?: string | null
          id?: string
          import_date?: string
          records_created?: number | null
          records_failed?: number | null
          records_processed?: number | null
          records_updated?: number | null
          source?: string
          status?: string | null
        }
        Relationships: []
      }
      development_projects: {
        Row: {
          available_units: number
          construction_stage: string
          created_at: string | null
          description: string
          expected_completion: string
          expected_roi: number | null
          id: string
          investor_level: string
          location_id: string
          min_investment: number | null
          name: string
          progress_percentage: number
          total_units: number
          updated_at: string | null
        }
        Insert: {
          available_units: number
          construction_stage: string
          created_at?: string | null
          description: string
          expected_completion: string
          expected_roi?: number | null
          id?: string
          investor_level?: string
          location_id: string
          min_investment?: number | null
          name: string
          progress_percentage: number
          total_units: number
          updated_at?: string | null
        }
        Update: {
          available_units?: number
          construction_stage?: string
          created_at?: string | null
          description?: string
          expected_completion?: string
          expected_roi?: number | null
          id?: string
          investor_level?: string
          location_id?: string
          min_investment?: number | null
          name?: string
          progress_percentage?: number
          total_units?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "development_projects_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "property_locations"
            referencedColumns: ["id"]
          },
        ]
      }
      display_settings: {
        Row: {
          currency: string | null
          language: string | null
          profile_id: string
          timezone: string | null
        }
        Insert: {
          currency?: string | null
          language?: string | null
          profile_id: string
          timezone?: string | null
        }
        Update: {
          currency?: string | null
          language?: string | null
          profile_id?: string
          timezone?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "display_settings_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      event_attendees: {
        Row: {
          event_id: string | null
          id: string
          priority: number | null
          registration_date: string
          user_badge: string | null
          user_id: string
        }
        Insert: {
          event_id?: string | null
          id?: string
          priority?: number | null
          registration_date?: string
          user_badge?: string | null
          user_id: string
        }
        Update: {
          event_id?: string | null
          id?: string
          priority?: number | null
          registration_date?: string
          user_badge?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_attendees_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          created_at: string
          current_attendees: number
          date: string
          description: string
          event_type: string
          id: string
          image_url: string | null
          is_online: boolean
          location: string
          max_attendees: number | null
          project_id: string | null
          property_id: string | null
          required_badges: string[] | null
          time: string
          title: string
        }
        Insert: {
          created_at?: string
          current_attendees?: number
          date: string
          description: string
          event_type: string
          id?: string
          image_url?: string | null
          is_online?: boolean
          location: string
          max_attendees?: number | null
          project_id?: string | null
          property_id?: string | null
          required_badges?: string[] | null
          time: string
          title: string
        }
        Update: {
          created_at?: string
          current_attendees?: number
          date?: string
          description?: string
          event_type?: string
          id?: string
          image_url?: string | null
          is_online?: boolean
          location?: string
          max_attendees?: number | null
          project_id?: string | null
          property_id?: string | null
          required_badges?: string[] | null
          time?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "events_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "development_projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      interests: {
        Row: {
          id: string
          name: string
        }
        Insert: {
          id?: string
          name: string
        }
        Update: {
          id?: string
          name?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          content: string
          created_at: string
          id: string
          read: boolean | null
          recipient_id: string
          sender_id: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          read?: boolean | null
          recipient_id: string
          sender_id: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          read?: boolean | null
          recipient_id?: string
          sender_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_settings: {
        Row: {
          app_notifications: boolean | null
          email_notifications: boolean | null
          event_reminders: boolean | null
          marketing_updates: boolean | null
          profile_id: string
          property_alerts: boolean | null
          sms_notifications: boolean | null
        }
        Insert: {
          app_notifications?: boolean | null
          email_notifications?: boolean | null
          event_reminders?: boolean | null
          marketing_updates?: boolean | null
          profile_id: string
          property_alerts?: boolean | null
          sms_notifications?: boolean | null
        }
        Update: {
          app_notifications?: boolean | null
          email_notifications?: boolean | null
          event_reminders?: boolean | null
          marketing_updates?: boolean | null
          profile_id?: string
          property_alerts?: boolean | null
          sms_notifications?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "notification_settings_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          message: string
          profile_id: string
          read: boolean | null
          related_id: string | null
          title: string
          type: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          profile_id: string
          read?: boolean | null
          related_id?: string | null
          title: string
          type: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          profile_id?: string
          read?: boolean | null
          related_id?: string | null
          title?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      privacy_settings: {
        Row: {
          created_at: string
          data_sharing: boolean | null
          profile_id: string
          public_profile: boolean | null
        }
        Insert: {
          created_at?: string
          data_sharing?: boolean | null
          profile_id: string
          public_profile?: boolean | null
        }
        Update: {
          created_at?: string
          data_sharing?: boolean | null
          profile_id?: string
          public_profile?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "privacy_settings_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profile_interests: {
        Row: {
          interest_id: string
          profile_id: string
        }
        Insert: {
          interest_id: string
          profile_id: string
        }
        Update: {
          interest_id?: string
          profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profile_interests_interest_id_fkey"
            columns: ["interest_id"]
            isOneToOne: false
            referencedRelation: "interests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profile_interests_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          email: string
          first_name: string | null
          id: string
          join_date: string
          last_name: string | null
          level: string | null
          location: string | null
          phone: string | null
          visibility: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          email: string
          first_name?: string | null
          id: string
          join_date?: string
          last_name?: string | null
          level?: string | null
          location?: string | null
          phone?: string | null
          visibility?: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          email?: string
          first_name?: string | null
          id?: string
          join_date?: string
          last_name?: string | null
          level?: string | null
          location?: string | null
          phone?: string | null
          visibility?: string
        }
        Relationships: []
      }
      project_images: {
        Row: {
          created_at: string | null
          id: string
          is_primary: boolean | null
          project_id: string
          url: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_primary?: boolean | null
          project_id: string
          url: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_primary?: boolean | null
          project_id?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_images_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "development_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      properties: {
        Row: {
          bathrooms: number
          bedrooms: number
          created_at: string
          data_source: string | null
          id: string
          investor_level: string | null
          location_id: string
          min_investment: number | null
          name: string
          occupation_status: string
          price: number
          roi_percentage: number | null
          service_charges: number | null
          size_sqm: number
          source_id: string | null
          status: string
          type_id: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          bathrooms: number
          bedrooms: number
          created_at?: string
          data_source?: string | null
          id?: string
          investor_level?: string | null
          location_id: string
          min_investment?: number | null
          name: string
          occupation_status: string
          price: number
          roi_percentage?: number | null
          service_charges?: number | null
          size_sqm: number
          source_id?: string | null
          status?: string
          type_id: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          bathrooms?: number
          bedrooms?: number
          created_at?: string
          data_source?: string | null
          id?: string
          investor_level?: string | null
          location_id?: string
          min_investment?: number | null
          name?: string
          occupation_status?: string
          price?: number
          roi_percentage?: number | null
          service_charges?: number | null
          size_sqm?: number
          source_id?: string | null
          status?: string
          type_id?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "properties_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "property_locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "properties_type_id_fkey"
            columns: ["type_id"]
            isOneToOne: false
            referencedRelation: "property_types"
            referencedColumns: ["id"]
          },
        ]
      }
      property_amenities: {
        Row: {
          amenity_id: string
          property_id: string
        }
        Insert: {
          amenity_id: string
          property_id: string
        }
        Update: {
          amenity_id?: string
          property_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "property_amenities_amenity_id_fkey"
            columns: ["amenity_id"]
            isOneToOne: false
            referencedRelation: "amenities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "property_amenities_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      property_images: {
        Row: {
          created_at: string
          id: string
          is_primary: boolean | null
          property_id: string
          url: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_primary?: boolean | null
          property_id: string
          url: string
        }
        Update: {
          created_at?: string
          id?: string
          is_primary?: boolean | null
          property_id?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "property_images_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      property_locations: {
        Row: {
          address: string
          city: string
          country: string
          created_at: string
          id: string
          zone: string
        }
        Insert: {
          address: string
          city: string
          country: string
          created_at?: string
          id?: string
          zone: string
        }
        Update: {
          address?: string
          city?: string
          country?: string
          created_at?: string
          id?: string
          zone?: string
        }
        Relationships: []
      }
      property_pros_cons: {
        Row: {
          created_at: string
          description: string
          id: string
          is_pro: boolean
          property_id: string
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          is_pro: boolean
          property_id: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          is_pro?: boolean
          property_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "property_pros_cons_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      property_types: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      security_settings: {
        Row: {
          login_alerts: boolean | null
          profile_id: string
          session_timeout: number | null
          two_factor_auth: boolean | null
        }
        Insert: {
          login_alerts?: boolean | null
          profile_id: string
          session_timeout?: number | null
          two_factor_auth?: boolean | null
        }
        Update: {
          login_alerts?: boolean | null
          profile_id?: string
          session_timeout?: number | null
          two_factor_auth?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "security_settings_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_events: {
        Row: {
          count: number
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          count?: number
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          count?: number
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_investment_growth: {
        Row: {
          id: string
          month: string
          month_index: number
          user_id: string
          value: number
          year: number
        }
        Insert: {
          id?: string
          month: string
          month_index: number
          user_id: string
          value?: number
          year?: number
        }
        Update: {
          id?: string
          month?: string
          month_index?: number
          user_id?: string
          value?: number
          year?: number
        }
        Relationships: []
      }
      user_investments: {
        Row: {
          id: string
          investment_change_percentage: number
          total_investment: number
          updated_at: string
          user_id: string
        }
        Insert: {
          id?: string
          investment_change_percentage?: number
          total_investment?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          id?: string
          investment_change_percentage?: number
          total_investment?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_portfolio_allocation: {
        Row: {
          id: string
          location: string
          percentage: number
          user_id: string
        }
        Insert: {
          id?: string
          location: string
          percentage?: number
          user_id: string
        }
        Update: {
          id?: string
          location?: string
          percentage?: number
          user_id?: string
        }
        Relationships: []
      }
      user_properties: {
        Row: {
          change: number
          count: number
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          change?: number
          count?: number
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          change?: number
          count?: number
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roi: {
        Row: {
          average_roi: number
          id: string
          roi_change: number
          updated_at: string
          user_id: string
        }
        Insert: {
          average_roi?: number
          id?: string
          roi_change?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          average_roi?: number
          id?: string
          roi_change?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_connection_request: {
        Args: { p_from_id: string; p_to_id: string }
        Returns: undefined
      }
      create_demo_platinum_user: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      delete_user_connection: {
        Args: { p_from_id: string; p_to_id: string }
        Returns: undefined
      }
      get_conversation: {
        Args: { p_user1_id: string; p_user2_id: string }
        Returns: {
          id: string
          sender_id: string
          recipient_id: string
          content: string
          created_at: string
          read: boolean
          sender_name: string
          recipient_name: string
        }[]
      }
      get_network_investors: {
        Args: Record<PropertyKey, never>
        Returns: Json[]
      }
      get_notification_settings: {
        Args: { p_user_id: string }
        Returns: {
          email_notifications: boolean
          push_notifications: boolean
        }[]
      }
      get_privacy_settings: {
        Args: { p_user_id: string }
        Returns: {
          public_profile: boolean
          data_sharing: boolean
        }[]
      }
      get_profile_by_id: {
        Args: { p_user_id: string }
        Returns: {
          avatar_url: string | null
          bio: string | null
          email: string
          first_name: string | null
          id: string
          join_date: string
          last_name: string | null
          level: string | null
          location: string | null
          phone: string | null
          visibility: string
        }[]
      }
      get_user_connections: {
        Args: { p_user_id: string }
        Returns: {
          user_id: string
          status: string
        }[]
      }
      get_user_notifications: {
        Args: { p_user_id: string }
        Returns: {
          id: string
          title: string
          message: string
          type: string
          read: boolean
          created_at: string
        }[]
      }
      get_user_profile_visibility: {
        Args: { p_user_id: string }
        Returns: {
          visibility: string
        }[]
      }
      get_visible_profiles: {
        Args: { p_current_user_id: string }
        Returns: {
          avatar_url: string | null
          bio: string | null
          email: string
          first_name: string | null
          id: string
          join_date: string
          last_name: string | null
          level: string | null
          location: string | null
          phone: string | null
          visibility: string
        }[]
      }
      mark_messages_as_read: {
        Args: { p_recipient_id: string; p_sender_id: string }
        Returns: undefined
      }
      mark_notifications_as_read: {
        Args: { p_notification_ids: string[] }
        Returns: undefined
      }
      send_message: {
        Args: { p_sender_id: string; p_recipient_id: string; p_content: string }
        Returns: undefined
      }
      update_connection_status: {
        Args: { p_connection_id: string; p_status: string }
        Returns: undefined
      }
      update_notification_settings: {
        Args: {
          p_user_id: string
          p_email_notifications: boolean
          p_push_notifications: boolean
        }
        Returns: undefined
      }
      update_privacy_settings: {
        Args: {
          p_user_id: string
          p_public_profile: boolean
          p_data_sharing: boolean
        }
        Returns: undefined
      }
      update_profile_visibility: {
        Args: { p_user_id: string; p_visibility: string }
        Returns: undefined
      }
      update_user_investment: {
        Args: { p_user_id: string; p_investment_amount: number }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
