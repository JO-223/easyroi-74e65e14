
export interface SavedPropertySearch {
  id: string;
  user_id: string;
  search_name: string;
  search_criteria: Record<string, any>;
  is_alert: boolean;
  created_at: string;
  locations?: string[];
  price_range?: [number, number];
  property_types?: string[];
  min_bedrooms?: number;
  max_bedrooms?: number;
  min_bathrooms?: number;
  max_bathrooms?: number;
  min_roi?: number;
  alert_frequency?: string;
  last_notification_sent?: string;
}
