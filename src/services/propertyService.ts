
import { supabase } from "@/integrations/supabase/client";
import { Property, PropertyFilter } from "@/types/property";

export const fetchProperties = async (filters?: PropertyFilter) => {
  let query = supabase
    .from('properties')
    .select(`
      *,
      location:location_id(*),
      type:type_id(*),
      amenities:property_amenities(amenity:amenity_id(*)),
      images:property_images(*),
      pros_cons:property_pros_cons(*)
    `);

  // Apply filters if provided
  if (filters) {
    if (filters.location) {
      query = query.or(`location.city.ilike.%${filters.location}%,location.country.ilike.%${filters.location}%,location.zone.ilike.%${filters.location}%`);
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
  
  if (!data || !Array.isArray(data)) {
    console.error('Invalid data format received from API');
    return [];
  }
  
  // Transform the data to match our Property type with proper type safety
  return data.map((item: any): Property => {
    const property: Property = {
      id: item.id,
      name: item.name,
      price: Number(item.price),
      size_sqm: Number(item.size_sqm),
      occupation_status: String(item.occupation_status),
      bedrooms: Number(item.bedrooms),
      bathrooms: Number(item.bathrooms),
      status: String(item.status),
      service_charges: item.service_charges !== null ? Number(item.service_charges) : null,
      roi_percentage: item.roi_percentage !== null ? Number(item.roi_percentage) : null,
      min_investment: item.min_investment !== null ? Number(item.min_investment) : null,
      investor_level: String(item.investor_level),
      created_at: String(item.created_at),
      updated_at: String(item.updated_at),
      location: item.location,
      type: item.type,
      amenities: Array.isArray(item.amenities) ? item.amenities.map((a: any) => a.amenity) : [],
      images: Array.isArray(item.images) ? item.images : [],
      pros_cons: Array.isArray(item.pros_cons) ? item.pros_cons : []
    };
    return property;
  });
};

export const fetchPropertyById = async (id: string): Promise<Property> => {
  const { data, error } = await supabase
    .from('properties')
    .select(`
      *,
      location:location_id(*),
      type:type_id(*),
      amenities:property_amenities(amenity:amenity_id(*)),
      images:property_images(*),
      pros_cons:property_pros_cons(*)
    `)
    .eq('id', id)
    .single();
  
  if (error) {
    console.error(`Error fetching property with id ${id}:`, error);
    throw error;
  }
  
  if (!data) {
    throw new Error('Property not found');
  }
  
  // Transform the data to match our Property type with proper type handling
  const property: Property = {
    id: data.id,
    name: data.name,
    price: Number(data.price),
    size_sqm: Number(data.size_sqm),
    occupation_status: String(data.occupation_status),
    bedrooms: Number(data.bedrooms),
    bathrooms: Number(data.bathrooms),
    status: String(data.status),
    service_charges: data.service_charges !== null ? Number(data.service_charges) : null,
    roi_percentage: data.roi_percentage !== null ? Number(data.roi_percentage) : null,
    min_investment: data.min_investment !== null ? Number(data.min_investment) : null,
    investor_level: String(data.investor_level),
    created_at: String(data.created_at),
    updated_at: String(data.updated_at),
    location: data.location,
    type: data.type,
    amenities: Array.isArray(data.amenities) ? data.amenities.map((a: any) => a.amenity) : [],
    images: Array.isArray(data.images) ? data.images : [],
    pros_cons: Array.isArray(data.pros_cons) ? data.pros_cons : []
  };
  
  return property;
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
