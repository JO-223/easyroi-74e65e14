
import { supabase } from '@/integrations/supabase/client';
import { SavedPropertySearch } from '@/types/search';
import { PropertyFilter } from '@/types/property';

export const fetchSavedSearches = async (): Promise<SavedPropertySearch[]> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }
  
  try {
    const { data, error } = await supabase
      .from('saved_property_searches')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching saved searches:', error);
      throw new Error('Failed to fetch saved searches');
    }
    
    return data as SavedPropertySearch[];
  } catch (error) {
    console.error('Error in fetchSavedSearches:', error);
    throw error;
  }
};

export const savePropertySearch = async (
  searchName: string,
  searchCriteria: PropertyFilter,
  isAlert: boolean = false,
  alertFrequency?: string
): Promise<SavedPropertySearch> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }
  
  try {
    // Convert filter to proper format for database
    const searchData = {
      user_id: user.id,
      search_name: searchName,
      search_criteria: searchCriteria,
      is_alert: isAlert,
      alert_frequency: alertFrequency || null,
      locations: searchCriteria.location ? [searchCriteria.location] : null,
      price_range: (searchCriteria.priceMin || searchCriteria.priceMax) 
        ? [searchCriteria.priceMin || 0, searchCriteria.priceMax || 999999999]
        : null,
      property_types: searchCriteria.type ? [searchCriteria.type] : null,
      min_bedrooms: searchCriteria.bedroomsMin || null,
      max_bedrooms: searchCriteria.bedroomsMax || null,
      min_bathrooms: searchCriteria.bathroomsMin || null,
      max_bathrooms: searchCriteria.bathroomsMax || null,
    };
    
    const { data, error } = await supabase
      .from('saved_property_searches')
      .insert(searchData)
      .select()
      .single();
    
    if (error) {
      console.error('Error saving property search:', error);
      throw new Error('Failed to save property search');
    }
    
    return data as SavedPropertySearch;
  } catch (error) {
    console.error('Error in savePropertySearch:', error);
    throw error;
  }
};

export const deleteSavedSearch = async (searchId: string): Promise<void> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }
  
  try {
    const { error } = await supabase
      .from('saved_property_searches')
      .delete()
      .eq('id', searchId)
      .eq('user_id', user.id);
    
    if (error) {
      console.error('Error deleting saved search:', error);
      throw new Error('Failed to delete saved search');
    }
  } catch (error) {
    console.error('Error in deleteSavedSearch:', error);
    throw error;
  }
};

export const getSavedSearchById = async (searchId: string): Promise<SavedPropertySearch> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }
  
  try {
    const { data, error } = await supabase
      .from('saved_property_searches')
      .select('*')
      .eq('id', searchId)
      .eq('user_id', user.id)
      .single();
    
    if (error) {
      console.error('Error fetching saved search:', error);
      throw new Error('Failed to fetch saved search');
    }
    
    return data as SavedPropertySearch;
  } catch (error) {
    console.error('Error in getSavedSearchById:', error);
    throw error;
  }
};

export const buildSearchQueryFromSaved = (savedSearch: SavedPropertySearch): PropertyFilter => {
  // Extract the search criteria and convert it to PropertyFilter format
  const criteria: PropertyFilter = {
    location: savedSearch.locations?.[0] || undefined,
    type: savedSearch.property_types?.[0] || undefined,
    priceMin: savedSearch.price_range?.[0] || undefined,
    priceMax: savedSearch.price_range?.[1] || undefined,
    bedroomsMin: savedSearch.min_bedrooms || undefined,
    bedroomsMax: savedSearch.max_bedrooms || undefined,
    bathroomsMin: savedSearch.min_bathrooms || undefined,
    bathroomsMax: savedSearch.max_bathrooms || undefined,
  };
  
  return criteria;
};
