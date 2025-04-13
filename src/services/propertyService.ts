import { supabase } from "@/integrations/supabase/client";
import { Property, PropertyFilter } from "@/types/property";

// Add missing functions
export async function fetchLocations(): Promise<string[]> {
  const { data, error } = await supabase
    .from("properties")
    .select("city")
    .order("city");
  
  if (error) {
    console.error("Error fetching locations:", error);
    throw new Error(error.message);
  }
  
  const uniqueCities = [...new Set(data.map(item => item.city))];
  return uniqueCities.filter(Boolean);
}

export async function fetchPropertyTypes(): Promise<string[]> {
  const { data, error } = await supabase
    .from("property_types")
    .select("name")
    .order("name");
  
  if (error) {
    console.error("Error fetching property types:", error);
    throw new Error(error.message);
  }
  
  return data.map(item => item.name);
}

export async function fetchAmenities(): Promise<string[]> {
  const { data, error } = await supabase
    .from("amenities")
    .select("name")
    .order("name");
  
  if (error) {
    console.error("Error fetching amenities:", error);
    throw new Error(error.message);
  }
  
  return data.map(item => item.name);
}

export function filterProperties(properties: Property[], filter: PropertyFilter): Property[] {
  return properties.filter(property => {
    // Filter by location
    if (filter.location && property.city !== filter.location) {
      return false;
    }
    
    // Filter by price range
    if (filter.priceMin && property.price < filter.priceMin) {
      return false;
    }
    
    if (filter.priceMax && property.price > filter.priceMax) {
      return false;
    }
    
    // Filter by property type
    if (filter.type && property.type !== filter.type) {
      return false;
    }
    
    // Filter by number of bedrooms
    if (filter.bedroomsMin !== undefined && property.bedrooms < filter.bedroomsMin) {
      return false;
    }
    
    if (filter.bedroomsMax !== undefined && property.bedrooms > filter.bedroomsMax) {
      return false;
    }
    
    // Filter by number of bathrooms
    if (filter.bathroomsMin !== undefined && property.bathrooms < filter.bathroomsMin) {
      return false;
    }
    
    if (filter.bathroomsMax !== undefined && property.bathrooms > filter.bathroomsMax) {
      return false;
    }
    
    // Filter by minimum ROI
    if (filter.minRoi && property.roi_percentage < filter.minRoi) {
      return false;
    }
    
    return true;
  });
}

export async function fetchProperties(): Promise<Property[]> {
  const { data, error } = await supabase
    .from("properties")
    .select(`
      *,
      type:type_id (*),
      location:location_id (*),
      images (*),
      amenities (*),
      pros_cons (*)
    `)
    .order("created_at", { ascending: false });
  
  if (error) {
    console.error("Error fetching properties:", error);
    throw new Error(error.message);
  }
  
  return data as unknown as Property[];
}
