import { supabase } from '@/integrations/supabase/client';
import { SavedPropertySearch } from '@/types/search';

export const createSavedSearch = async (search: Omit<SavedPropertySearch, 'id' | 'created_at'>): Promise<SavedPropertySearch | null> => {
  try {
    const { data, error } = await supabase
      .from('saved_property_searches')
      .insert([search])
      .select()
      .single();
      
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Error creating saved search:', error);
    return null;
  }
};

export const updateSavedSearch = async (id: string, updates: Partial<SavedPropertySearch>): Promise<SavedPropertySearch | null> => {
  try {
    const { data, error } = await supabase
      .from('saved_property_searches')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
      
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Error updating saved search:', error);
    return null;
  }
};

export const deleteSavedSearch = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('saved_property_searches')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error deleting saved search:', error);
    return false;
  }
};

export const getSavedSearchById = async (id: string): Promise<SavedPropertySearch | null> => {
  try {
    const { data, error } = await supabase
      .from('saved_property_searches')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Error getting saved search by id:', error);
    return null;
  }
};

export const convertSearchCriteriaToDisplayText = (criteria: any): string => {
  const displayParts: string[] = [];
  
  if (criteria.location) {
    displayParts.push(`Location: ${criteria.location}`);
  }
  
  if (criteria.propertyTypes && criteria.propertyTypes.length > 0) {
    displayParts.push(`Types: ${criteria.propertyTypes.join(', ')}`);
  }
  
  if (criteria.bedrooms) {
    displayParts.push(`Bedrooms: ${criteria.bedrooms}`);
  }
  
  if (criteria.bathrooms) {
    displayParts.push(`Bathrooms: ${criteria.bathrooms}`);
  }
  
  if (criteria.minROI) {
    displayParts.push(`Min ROI: ${criteria.minROI}%`);
  }
  
  // Fix for line 151 - Properly handle price range which might be an array
  if (criteria.priceRange && Array.isArray(criteria.priceRange)) {
    const [min, max] = criteria.priceRange;
    displayParts.push(`Price: ${min.toLocaleString()} - ${max.toLocaleString()}`);
  } else if (typeof criteria.priceRange === 'string') {
    // If it's already a string, use it directly
    displayParts.push(`Price: ${criteria.priceRange}`);
  }
  
  return displayParts.join(' • ');
};

// For the type casting errors, we need to add proper type safety
export const fetchSavedSearches = async (userId: string): Promise<SavedPropertySearch[]> => {
  try {
    const { data, error } = await supabase
      .from('saved_property_searches')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    
    // Properly cast the data with type assertion
    return (data as unknown) as SavedPropertySearch[];
  } catch (error) {
    console.error('Error fetching saved searches:', error);
    return [];
  }
};
