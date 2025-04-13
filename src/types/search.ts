
export interface SavedPropertySearch {
  id: string;
  user_id: string;
  search_name: string;
  search_criteria: any;
  created_at?: string;
  is_alert: boolean;
  alert_frequency?: string;
}

export interface SearchCriteria {
  location?: string[];
  priceRange?: [number, number];
  propertyTypes?: string[];
  bedroomsRange?: [number, number];
  bathroomsRange?: [number, number];
  minRoi?: number;
  amenities?: string[];
  investorLevel?: string;
}
