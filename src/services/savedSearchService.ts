
import { supabase } from "@/integrations/supabase/client";
import { SavedPropertySearch } from "@/types/search";
import { PropertyFilter } from "@/types/property";

export async function fetchSavedSearches(): Promise<SavedPropertySearch[]> {
  const { data: user } = await supabase.auth.getUser();
  
  if (!user.user) {
    throw new Error("User not authenticated");
  }
  
  const { data, error } = await supabase
    .from("saved_searches")
    .select("*")
    .eq("user_id", user.user.id)
    .order("created_at", { ascending: false });
  
  if (error) {
    console.error("Error fetching saved searches:", error);
    throw new Error(error.message);
  }
  
  return data as SavedPropertySearch[];
}

export async function savePropertySearch(
  searchName: string,
  searchCriteria: PropertyFilter,
  isAlert: boolean = false,
  alertFrequency?: string
): Promise<SavedPropertySearch> {
  const { data: user } = await supabase.auth.getUser();
  
  if (!user.user) {
    throw new Error("User not authenticated");
  }
  
  // Extract relevant properties for database storage
  const searchData = {
    locations: searchCriteria.location ? [searchCriteria.location] : undefined,
    price_range: searchCriteria.priceMin && searchCriteria.priceMax 
      ? [searchCriteria.priceMin, searchCriteria.priceMax] as [number, number]
      : undefined,
    property_types: searchCriteria.type ? [searchCriteria.type] : undefined,
    min_bedrooms: searchCriteria.bedroomsMin,
    max_bedrooms: searchCriteria.bedroomsMax,
    min_bathrooms: searchCriteria.bathroomsMin,
    max_bathrooms: searchCriteria.bathroomsMax,
    min_roi: searchCriteria.minRoi
  };
  
  const { data, error } = await supabase
    .from("saved_searches")
    .insert({
      user_id: user.user.id,
      search_name: searchName,
      search_criteria: searchCriteria,
      is_alert: isAlert,
      alert_frequency: isAlert ? alertFrequency : null,
      ...searchData
    })
    .select("*")
    .single();
  
  if (error) {
    console.error("Error saving search:", error);
    throw new Error(error.message);
  }
  
  return data as SavedPropertySearch;
}

export async function deleteSavedSearch(searchId: string): Promise<void> {
  const { error } = await supabase
    .from("saved_searches")
    .delete()
    .eq("id", searchId);
  
  if (error) {
    console.error("Error deleting saved search:", error);
    throw new Error(error.message);
  }
}

export function buildSearchQueryFromSaved(savedSearch: SavedPropertySearch): PropertyFilter {
  // Convert from the database format to the application filter format
  return {
    location: savedSearch.locations?.[0] || '',
    priceMin: savedSearch.price_range?.[0],
    priceMax: savedSearch.price_range?.[1],
    type: savedSearch.property_types?.[0] || '',
    bedroomsMin: savedSearch.min_bedrooms,
    bedroomsMax: savedSearch.max_bedrooms,
    bathroomsMin: savedSearch.min_bathrooms,
    bathroomsMax: savedSearch.max_bathrooms,
    minRoi: savedSearch.min_roi
  };
}
