
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
  type: string;
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
}

export interface EventFilter {
  eventType?: string;
  eventFormat?: string;
  location?: string;
  fromDate?: string;
  toDate?: string;
  onlyAvailable?: boolean;
  badge?: string; // Added missing property
}

// Common user roles
export type UserRole = 'admin' | 'owner' | 'investor' | 'agent' | 'user';
