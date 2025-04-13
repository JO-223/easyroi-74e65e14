
import { supabase } from "@/integrations/supabase/client";
import { SavedPropertySearch, SearchCriteria } from "@/types/search";
import { PropertyFilter } from "@/types/property";

export const fetchSavedSearches = async (userId?: string): Promise<SavedPropertySearch[]> => {
  try {
    // Get current user if userId is not provided
    if (!userId) {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No authenticated user found");
      userId = user.id;
    }

    const { data, error } = await supabase
      .from("saved_property_searches")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching saved searches:", error);
      throw new Error(error.message);
    }

    return (data as unknown) as SavedPropertySearch[];
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
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("No authenticated user found");

    const newSearch = {
      user_id: user.id,
      search_name: searchName,
      search_criteria: searchCriteria,
      is_alert: isAlert,
      alert_frequency: isAlert ? alertFrequency : null
    };

    const { data, error } = await supabase
      .from("saved_property_searches")
      .insert(newSearch)
      .select()
      .single();

    if (error) {
      console.error("Error saving search:", error);
      throw new Error(error.message);
    }

    return (data as unknown) as SavedPropertySearch;
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
      console.error("Error deleting saved search:", error);
      throw new Error(error.message);
    }
  } catch (error) {
    console.error("Error in deleteSavedSearch:", error);
    throw error;
  }
};

export const buildSearchQueryFromSaved = (savedSearch: SavedPropertySearch): PropertyFilter => {
  // Convert the saved search criteria to a property filter
  const searchCriteria = savedSearch.search_criteria as SearchCriteria;
  
  // Map the search criteria to a property filter
  const filter: PropertyFilter = {
    locations: searchCriteria.location as string[],
    priceMin: searchCriteria.priceRange ? searchCriteria.priceRange[0] : undefined,
    priceMax: searchCriteria.priceRange ? searchCriteria.priceRange[1] : undefined,
    propertyTypes: searchCriteria.propertyTypes,
    bedroomsMin: searchCriteria.bedroomsRange ? searchCriteria.bedroomsRange[0] : undefined,
    bedroomsMax: searchCriteria.bedroomsRange ? searchCriteria.bedroomsRange[1] : undefined,
    bathroomsMin: searchCriteria.bathroomsRange ? searchCriteria.bathroomsRange[0] : undefined,
    bathroomsMax: searchCriteria.bathroomsRange ? searchCriteria.bathroomsRange[1] : undefined,
    roiMin: searchCriteria.minRoi,
    amenities: searchCriteria.amenities,
    investorLevel: searchCriteria.investorLevel,
  };
  
  return filter;
};
