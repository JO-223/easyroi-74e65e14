
import { supabase } from '@/integrations/supabase/client';
import { Property, PropertyFilter } from '@/types/property';

export const fetchProperties = async (filter?: PropertyFilter): Promise<Property[]> => {
  try {
    let query = supabase
      .from('properties')
      .select(`
        *,
        type:type_id(id, name),
        location:location_id(address, city, country, zone),
        images(*),
        amenities:property_amenities(amenity_id(*)),
        pros_cons:property_pros_cons(*)
      `);
    
    // Apply filters if provided
    if (filter) {
      // Location filter
      if (filter.location) {
        query = query.like('location.city', `%${filter.location}%`);
      }
      
      // Type filter
      if (filter.type) {
        query = query.eq('type_id', filter.type);
      }
      
      // Price range filter
      if (filter.priceMin) {
        query = query.gte('price', filter.priceMin);
      }
      if (filter.priceMax) {
        query = query.lte('price', filter.priceMax);
      }
      
      // Bedrooms filter - use bedroomsMin/Max instead of bedrooms
      if (filter.bedroomsMin) {
        query = query.gte('bedrooms', filter.bedroomsMin);
      }
      if (filter.bedroomsMax) {
        query = query.lte('bedrooms', filter.bedroomsMax);
      }
      
      // Bathrooms filter - use bathroomsMin/Max instead of bathrooms
      if (filter.bathroomsMin) {
        query = query.gte('bathrooms', filter.bathroomsMin);
      }
      if (filter.bathroomsMax) {
        query = query.lte('bathrooms', filter.bathroomsMax);
      }
      
      // Investor level filter
      if (filter.investorLevel) {
        query = query.lte('investor_level', filter.investorLevel);
      }
      
      // Amenities filter
      // This would typically be handled in the post-processing step after fetching
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching properties:', error);
      throw new Error('Failed to fetch properties');
    }
    
    return data.map(item => ({
      ...item,
      // The created_at property is expected by some components,
      // although it's not explicitly defined in the Property interface
    }));
  } catch (error) {
    console.error('Error in fetchProperties:', error);
    throw error;
  }
};

export const fetchPropertyById = async (id: string): Promise<Property | null> => {
  try {
    const { data, error } = await supabase
      .from('properties')
      .select(`
        *,
        type:type_id(id, name),
        location:location_id(address, city, country, zone),
        images(*),
        amenities:property_amenities(amenity_id(*)),
        pros_cons:property_pros_cons(*)
      `)
      .eq('id', id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        return null; // No property found
      }
      console.error('Error fetching property:', error);
      throw new Error('Failed to fetch property');
    }
    
    return data;
  } catch (error) {
    console.error('Error in fetchPropertyById:', error);
    throw error;
  }
};
