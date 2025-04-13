
// Continues from above, adding/updating amenities and investorLevel properties
export interface PropertyFilter {
  locations?: string[];
  priceMin?: number;
  priceMax?: number;
  sizeMin?: number;
  sizeMax?: number;
  bedroomsMin?: number;
  bedroomsMax?: number;
  bathroomsMin?: number;
  bathroomsMax?: number;
  propertyTypes?: string[];
  status?: string;
  occupationStatus?: string;
  roiMin?: number;
  listingStatus?: string;
  amenities?: string[];
  investorLevel?: string;
}

export interface Property {
  id: string;
  name: string;
  price: number;
  size_sqm: number;
  bedrooms: number;
  bathrooms: number;
  location: {
    address: string;
    city: string;
    country: string;
    zone: string;
  };
  type: {
    name: string;
    id: string;
  };
  service_charges?: number;
  roi_percentage?: number;
  min_investment?: number;
  created_at: string;
  updated_at: string;
  occupation_status: string;
  status: string;
  listing_status: string;
  price_currency: string;
  images: { url: string; id: string; is_primary: boolean }[];
  amenities: { name: string; icon: string }[];
  pros_cons: { id: string; description: string; is_pro: boolean }[];
  investor_level: string;
}

// Add the DevelopmentProject interface
export interface DevelopmentProject {
  id: string;
  name: string;
  description: string;
  location: {
    address: string;
    city: string;
    country: string;
    zone: string;
  };
  location_id: string;
  expected_completion: string;
  construction_stage: string;
  progress_percentage: number;
  total_units: number;
  available_units: number;
  min_investment: number;
  expected_roi: number;
  investor_level: string;
  image_url?: string;
  created_at?: string;
  updated_at?: string;
}

export interface PropertyType {
  id: string;
  name: string;
  description?: string;
}

export interface UserRole {
  id: string;
  name: "admin" | "investor" | "agent";
}
