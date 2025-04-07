
export type Property = {
  id: string;
  name: string;
  price: number;
  size_sqm: number;
  occupation_status: string;
  bedrooms: number;
  bathrooms: number;
  status: string;
  service_charges: number | null;
  roi_percentage: number | null;
  min_investment: number | null;
  investor_level: string;
  created_at: string;
  updated_at: string;
  location: PropertyLocation;
  type: PropertyType;
  amenities: Amenity[];
  images: PropertyImage[];
  pros_cons: PropertyProCon[];
};

export type PropertyLocation = {
  id: string;
  address: string;
  zone: string;
  city: string;
  country: string;
};

export type PropertyType = {
  id: string;
  name: string;
  description: string | null;
};

export type Amenity = {
  id: string;
  name: string;
  icon: string | null;
};

export type PropertyImage = {
  id: string;
  url: string;
  is_primary: boolean;
};

export type PropertyProCon = {
  id: string;
  is_pro: boolean;
  description: string;
};

export type PropertyFilter = {
  location?: string;
  priceMin?: number;
  priceMax?: number;
  investorLevel?: string;
  type?: string;
  bedrooms?: number;
  bathrooms?: number;
  amenities?: string[];
};

// Add data import types
export type DataImport = {
  id: string;
  source: string;
  import_date: string;
  records_processed: number | null;
  records_created: number | null;
  records_updated: number | null;
  records_failed: number | null;
  status: string | null;
  error_details: string | null;
  completed_at: string | null;
};
