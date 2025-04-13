
import { supabase } from "@/integrations/supabase/client";
import { SavedPropertySearch, SavedSearchFormData } from "@/types/savedSearch";

export async function fetchUserSavedSearches(userId: string) {
  const { data, error } = await supabase
    .from('saved_property_searches')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching saved searches:', error);
    throw error;
  }

  return data as SavedPropertySearch[];
}

export async function savePropertySearch(formData: SavedSearchFormData, userId: string) {
  // Prepare the search criteria JSON
  const searchCriteria = {
    min_bedrooms: formData.min_bedrooms,
    max_bedrooms: formData.max_bedrooms,
    min_bathrooms: formData.min_bathrooms,
    max_bathrooms: formData.max_bathrooms,
    min_roi: formData.min_roi,
    price_range: formData.price_min && formData.price_max 
      ? [formData.price_min, formData.price_max]
      : undefined,
    property_types: formData.property_types,
    locations: formData.locations
  };
  
  // Create the price range if both min and max prices are provided
  let priceRange = null;
  if (formData.price_min !== undefined && formData.price_max !== undefined) {
    priceRange = `[${formData.price_min},${formData.price_max})`;
  }

  const { data, error } = await supabase
    .from('saved_property_searches')
    .insert({
      user_id: userId,
      search_name: formData.search_name,
      search_criteria: searchCriteria,
      min_bedrooms: formData.min_bedrooms,
      max_bedrooms: formData.max_bedrooms,
      min_bathrooms: formData.min_bathrooms,
      max_bathrooms: formData.max_bathrooms,
      min_roi: formData.min_roi,
      price_range: priceRange,
      property_types: formData.property_types,
      locations: formData.locations,
      is_alert: formData.is_alert,
      alert_frequency: formData.is_alert ? formData.alert_frequency : null
    })
    .select()
    .single();

  if (error) {
    console.error('Error saving search:', error);
    throw error;
  }

  return data as SavedPropertySearch;
}

export async function updateSavedSearch(id: string, formData: SavedSearchFormData) {
  // Prepare the search criteria JSON
  const searchCriteria = {
    min_bedrooms: formData.min_bedrooms,
    max_bedrooms: formData.max_bedrooms,
    min_bathrooms: formData.min_bathrooms,
    max_bathrooms: formData.max_bathrooms,
    min_roi: formData.min_roi,
    price_range: formData.price_min && formData.price_max 
      ? [formData.price_min, formData.price_max]
      : undefined,
    property_types: formData.property_types,
    locations: formData.locations
  };
  
  // Create the price range if both min and max prices are provided
  let priceRange = null;
  if (formData.price_min !== undefined && formData.price_max !== undefined) {
    priceRange = `[${formData.price_min},${formData.price_max})`;
  }

  const { data, error } = await supabase
    .from('saved_property_searches')
    .update({
      search_name: formData.search_name,
      search_criteria: searchCriteria,
      min_bedrooms: formData.min_bedrooms,
      max_bedrooms: formData.max_bedrooms,
      min_bathrooms: formData.min_bathrooms,
      max_bathrooms: formData.max_bathrooms,
      min_roi: formData.min_roi,
      price_range: priceRange,
      property_types: formData.property_types,
      locations: formData.locations,
      is_alert: formData.is_alert,
      alert_frequency: formData.is_alert ? formData.alert_frequency : null
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating saved search:', error);
    throw error;
  }

  return data as SavedPropertySearch;
}

export async function deleteSavedSearch(id: string) {
  const { error } = await supabase
    .from('saved_property_searches')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting saved search:', error);
    throw error;
  }

  return true;
}

export function buildSearchQueryFromSaved(savedSearch: SavedPropertySearch) {
  // This function creates a query object that can be used with your property filtering
  // logic based on the saved search criteria
  const query: Record<string, any> = {};
  
  if (savedSearch.min_bedrooms) query.minBedrooms = savedSearch.min_bedrooms;
  if (savedSearch.max_bedrooms) query.maxBedrooms = savedSearch.max_bedrooms;
  if (savedSearch.min_bathrooms) query.minBathrooms = savedSearch.min_bathrooms;
  if (savedSearch.max_bathrooms) query.maxBathrooms = savedSearch.max_bathrooms;
  if (savedSearch.min_roi) query.minRoi = savedSearch.min_roi;
  
  if (savedSearch.price_range) {
    const range = savedSearch.price_range.replace(/[\[\]\(\)]/g, '').split(',');
    if (range.length === 2) {
      query.minPrice = parseFloat(range[0]);
      query.maxPrice = parseFloat(range[1]);
    }
  }
  
  if (savedSearch.property_types && savedSearch.property_types.length > 0) {
    query.propertyTypes = savedSearch.property_types;
  }
  
  if (savedSearch.locations && savedSearch.locations.length > 0) {
    query.locations = savedSearch.locations;
  }
  
  return query;
}
