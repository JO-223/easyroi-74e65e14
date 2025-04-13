
export interface Property {
  id: string;
  name: string;
  price: number;
  size_sqm: number;
  bedrooms: number;
  bathrooms: number;
  roi_percentage: number;
  currency: string;
  status: string;
  listing_status: string;
  occupation_status: string;
  address: string;
  city: string;
  country: string;
  zone?: string;
  created_at?: string;
  service_charges?: number;
  user_id: string;
  type: string | { name: string; id: string };
  // Add missing properties
  images: PropertyImage[];
  investor_level?: string;
  location: PropertyLocation;
  amenities: PropertyAmenity[];
  min_investment?: number;
  pros_cons: PropertyProCon[];
}

export interface PropertyImage {
  id: string;
  url: string;
  property_id: string;
  is_primary: boolean;
}

export interface PropertyLocation {
  id: string;
  address: string;
  city: string;
  country: string;
  zone: string;
}

export interface PropertyAmenity {
  id: string;
  name: string;
  icon?: string;
}

export interface PropertyProCon {
  id: string;
  description: string;
  is_pro: boolean;
  property_id: string;
}

export interface PropertyType {
  id: string;
  name: string;
  description?: string;
}

export interface PropertyFilter {
  location?: string;
  priceMin?: number;
  priceMax?: number;
  type?: string;
  bedroomsMin?: number;
  bedroomsMax?: number;
  bathroomsMin?: number;
  bathroomsMax?: number;
  minRoi?: number;
  // Add missing properties
  amenities?: string[];
  investorLevel?: string;
}

export interface EventFilter {
  eventType?: string;
  eventFormat?: string;
  location?: string;
  fromDate?: string;
  toDate?: string;
  onlyAvailable?: boolean;
  badge?: string;
  // Add missing properties
  dateFrom?: string;
  dateTo?: string;
  isOnline?: boolean;
  hasAvailability?: boolean;
}

// Common user roles
export type UserRole = 'admin' | 'owner' | 'investor' | 'agent' | 'user';

// Add DevelopmentProject type
export interface DevelopmentProject {
  id: string;
  name: string;
  description: string;
  location_id: string;
  location: PropertyLocation;
  progress_percentage: number;
  total_units: number;
  available_units: number;
  expected_roi?: number;
  min_investment?: number;
  investor_level: string;
  construction_stage: string;
  expected_completion: string;
  images?: PropertyImage[];
}
