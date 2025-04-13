
// If this file doesn't exist yet, we're creating it with basic types
export interface Property {
  id: string;
  name: string;
  type: {
    id: string;
    name: string;
  };
  location: {
    address: string;
    city: string;
    country: string;
    zone: string;
  };
  price: number;
  size_sqm: number;
  bedrooms: number;
  bathrooms: number;
  occupation_status: string;
  status: string;
  service_charges: number | null;
  images: {
    id: string;
    url: string;
    is_primary: boolean;
  }[];
  amenities: {
    id: string;
    name: string;
    icon?: string;
  }[];
  pros_cons: {
    id: string;
    description: string;
    is_pro: boolean;
  }[];
  roi_percentage: number | null;
  min_investment: number | null;
  investor_level: string | null;
  created_at?: string; // Added this field as it's used in the code
  property_id?: string; // For related properties
  project_id?: string; // For related projects
}

export interface PropertyType {
  id: string;
  name: string;
  description?: string;
}

export interface DevelopmentProject {
  id: string;
  name: string;
  description: string;
  expected_completion: string | null;
  construction_stage: string;
  progress_percentage: number;
  total_units: number;
  available_units: number;
  min_investment: number | null;
  expected_roi: number | null;
  investor_level: string | null;
  location: {
    address: string;
    city: string;
    country: string;
    zone: string;
  };
  images: {
    id: string;
    url: string;
    is_primary: boolean;
  }[];
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  is_online: boolean;
  event_type: string;
  image_url: string | null;
  max_attendees: number | null;
  current_attendees: number;
  required_badges: string[];
  average_rating?: number;
  property_id?: string; // Adding this field that was missing
  project_id?: string;  // Adding this field that was missing
}

export interface PropertyFilter {
  location?: string;
  type?: string;
  priceMin?: number;
  priceMax?: number;
  bedroomsMin?: number; 
  bedroomsMax?: number;
  bathroomsMin?: number;
  bathroomsMax?: number;
  amenities?: string[];
  investorLevel?: string;
  // Adding these to fix errors
  bedrooms?: { min?: number; max?: number }; 
  bathrooms?: { min?: number; max?: number };
}

export interface EventFilter {
  eventType?: string;
  location?: string;
  dateFrom?: Date;
  dateTo?: Date;
  hasAvailability?: boolean;
  isOnline?: boolean;
  badge?: string; // Adding this field that was missing
}

export type UserRole = 'user' | 'admin' | 'owner';
