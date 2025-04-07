
import { supabase } from "@/integrations/supabase/client";
import { Property, PropertyFilter } from "@/types/property";

export const fetchProperties = async (filters?: PropertyFilter) => {
  let query = supabase
    .from('properties')
    .select(`
      *,
      location:location_id(id, address, zone, city, country),
      type:type_id(id, name, description),
      amenities:property_amenities(amenity:amenity_id(*)),
      images:property_images(*),
      pros_cons:property_pros_cons(*)
    `);

  // Apply filters if provided
  if (filters) {
    if (filters.location) {
      query = query.eq('location.city', filters.location)
                   .or(`location.country.eq.${filters.location},location.zone.eq.${filters.location}`);
    }
    if (filters.priceMin) {
      query = query.gte('price', filters.priceMin);
    }
    if (filters.priceMax) {
      query = query.lte('price', filters.priceMax);
    }
    if (filters.investorLevel) {
      query = query.eq('investor_level', filters.investorLevel);
    }
    if (filters.type) {
      query = query.eq('type.name', filters.type);
    }
    if (filters.bedrooms) {
      query = query.gte('bedrooms', filters.bedrooms);
    }
    if (filters.bathrooms) {
      query = query.gte('bathrooms', filters.bathrooms);
    }
    // Amenities filtering requires special handling
    if (filters.amenities && filters.amenities.length > 0) {
      // This requires a more complex query approach
      // Will need to join with property_amenities and filter based on that
    }
  }

  const { data, error } = await query;
  
  if (error) {
    console.error('Error fetching properties:', error);
    throw error;
  }
  
  // Transform the data to match our Property type
  return data.map((item: any): Property => {
    return {
      id: item.id,
      name: item.name,
      price: item.price,
      size_sqm: item.size_sqm,
      occupation_status: item.occupation_status,
      bedrooms: item.bedrooms,
      bathrooms: item.bathrooms,
      status: item.status,
      service_charges: item.service_charges,
      roi_percentage: item.roi_percentage,
      min_investment: item.min_investment,
      investor_level: item.investor_level,
      created_at: item.created_at,
      updated_at: item.updated_at,
      location: item.location,
      type: item.type,
      amenities: item.amenities.map((a: any) => a.amenity),
      images: item.images,
      pros_cons: item.pros_cons
    };
  });
};

export const fetchLocations = async () => {
  const { data, error } = await supabase
    .from('property_locations')
    .select('city, country, zone')
    .order('country', { ascending: true });
    
  if (error) throw error;
  return data;
};

export const fetchPropertyTypes = async () => {
  const { data, error } = await supabase
    .from('property_types')
    .select('*')
    .order('name', { ascending: true });
    
  if (error) throw error;
  return data;
};

export const fetchAmenities = async () => {
  const { data, error } = await supabase
    .from('amenities')
    .select('*')
    .order('name', { ascending: true });
    
  if (error) throw error;
  return data;
};
