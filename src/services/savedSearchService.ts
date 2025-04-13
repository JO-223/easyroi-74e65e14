
import { supabase } from "@/integrations/supabase/client";
import { SavedPropertySearch, SearchCriteria } from "@/types/search";

export const fetchSavedSearches = async (): Promise<SavedPropertySearch[]> => {
  try {
    const { data, error } = await supabase
      .from("saved_property_searches")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching saved searches:", error);
      throw new Error(error.message);
    }

    // Add proper type casting
    return data as SavedPropertySearch[];
  } catch (error) {
    console.error("Error in fetchSavedSearches:", error);
    throw error;
  }
};

export const savePropertySearch = async (
  searchName: string,
  searchCriteria: SearchCriteria,
  isAlert: boolean = false,
  alertFrequency?: string
): Promise<SavedPropertySearch> => {
  try {
    const user = supabase.auth.getUser();
    if (!user) {
      throw new Error("User not authenticated");
    }

    const { data, error } = await supabase
      .from("saved_property_searches")
      .insert({
        search_name: searchName,
        search_criteria: searchCriteria,
        is_alert: isAlert,
        alert_frequency: alertFrequency,
      })
      .select()
      .single();

    if (error) {
      console.error("Error saving search:", error);
      throw new Error(error.message);
    }

    // Add proper type casting
    return data as SavedPropertySearch;
  } catch (error) {
    console.error("Error in savePropertySearch:", error);
    throw error;
  }
};

export const deleteSavedSearch = async (searchId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from("saved_property_searches")
      .delete()
      .eq("id", searchId);

    if (error) {
      console.error("Error deleting search:", error);
      throw new Error(error.message);
    }
  } catch (error) {
    console.error("Error in deleteSavedSearch:", error);
    throw error;
  }
};

export const buildSearchQueryFromSaved = (savedSearch: SavedPropertySearch): URLSearchParams => {
  const params = new URLSearchParams();
  const criteria = savedSearch.search_criteria;

  if (!criteria) return params;

  // Location
  if (criteria.location) {
    if (Array.isArray(criteria.location)) {
      params.append("location", criteria.location.join(','));
    } else {
      params.append("location", criteria.location);
    }
  }

  // Price range
  if (criteria.priceRange) {
    if (criteria.priceRange[0]) params.append("priceMin", criteria.priceRange[0].toString());
    if (criteria.priceRange[1]) params.append("priceMax", criteria.priceRange[1].toString());
  }

  // Property types
  if (criteria.propertyTypes && criteria.propertyTypes.length) {
    params.append("type", criteria.propertyTypes.join(','));
  }

  // Bedrooms
  if (criteria.bedroomsRange) {
    if (criteria.bedroomsRange[0]) params.append("bedroomsMin", criteria.bedroomsRange[0].toString());
    if (criteria.bedroomsRange[1]) params.append("bedroomsMax", criteria.bedroomsRange[1].toString());
  }

  // Bathrooms
  if (criteria.bathroomsRange) {
    if (criteria.bathroomsRange[0]) params.append("bathroomsMin", criteria.bathroomsRange[0].toString());
    if (criteria.bathroomsRange[1]) params.append("bathroomsMax", criteria.bathroomsRange[1].toString());
  }

  // Min ROI
  if (criteria.minRoi) {
    params.append("minRoi", criteria.minRoi.toString());
  }

  // Amenities
  if (criteria.amenities && criteria.amenities.length) {
    params.append("amenities", criteria.amenities.join(','));
  }

  // Investor level
  if (criteria.investorLevel) {
    params.append("investorLevel", criteria.investorLevel);
  }

  return params;
};
