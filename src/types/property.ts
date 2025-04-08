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

export type UserInvestment = {
  id: string;
  user_id: string;
  total_investment: number;
  last_updated: string;
};

export type UserRole = 
  | 'user'
  | 'bronze' 
  | 'silver' 
  | 'gold' 
  | 'platinum' 
  | 'diamond'
  | 'administrator'
  | 'owner';

export type DevelopmentProject = {
  id: string;
  name: string;
  description: string;
  location: PropertyLocation;
  expected_completion: string;
  construction_stage: string;
  progress_percentage: number;
  total_units: number;
  available_units: number;
  min_investment: number | null;
  expected_roi: number | null;
  investor_level: "bronze" | "silver" | "gold" | "platinum" | "diamond";
  images: PropertyImage[];
};

export type Event = {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  event_type: string;
  max_attendees: number | null;
  current_attendees: number;
  property_id?: string;
  project_id?: string;
  image_url?: string;
  is_online: boolean;
  required_badges?: string[];
};

export type EventFilter = {
  eventType?: string;
  dateFrom?: Date;
  dateTo?: Date;
  location?: string;
  hasAvailability?: boolean;
  isOnline?: boolean;
  badge?: string;
};
