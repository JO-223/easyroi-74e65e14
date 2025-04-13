
export interface SavedPropertySearch {
  id: string;
  user_id: string;
  search_name: string;
  search_criteria: any;
  min_bedrooms?: number;
  max_bedrooms?: number;
  min_bathrooms?: number;
  max_bathrooms?: number;
  min_roi?: number;
  price_range?: [number, number];
  property_types?: string[];
  locations?: string[];
  is_alert: boolean;
  alert_frequency?: string;
  last_notification_sent?: string;
  created_at: string;
}

export interface SavedSearchFormData {
  search_name: string;
  min_bedrooms?: number;
  max_bedrooms?: number;
  min_bathrooms?: number;
  max_bathrooms?: number;
  min_roi?: number;
  price_min?: number;
  price_max?: number;
  property_types?: string[];
  locations?: string[];
  is_alert: boolean;
  alert_frequency?: string;
}

export type AlertFrequency = 'daily' | 'weekly' | 'monthly';

export const alertFrequencyOptions = [
  { label: 'Daily', value: 'daily' },
  { label: 'Weekly', value: 'weekly' },
  { label: 'Monthly', value: 'monthly' }
];
