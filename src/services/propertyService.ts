
import { supabase } from "@/integrations/supabase/client";
import { Property, PropertyFilter } from "@/types/property";

export const fetchProperties = async (filters?: PropertyFilter): Promise<Property[]> => {
  try {
    let query = supabase
      .from("properties")
      .select(`
        *,
        type:type_id (*),
        location:location_id (*),
        images:property_images(*),
        amenities:property_amenities(amenity_id(*)),
        pros_cons:property_pros_cons(*)
      `)
      .order("created_at", { ascending: false });

    // Apply filters
    if (filters) {
      if (filters.location) {
        query = query.or(`location.city.ilike.%${filters.location}%,location.country.ilike.%${filters.location}%,location.zone.ilike.%${filters.location}%`);
      }
      
      if (filters.priceMin !== undefined) {
        query = query.gte("price", filters.priceMin);
      }
      
      if (filters.priceMax !== undefined) {
        query = query.lte("price", filters.priceMax);
      }
      
      if (filters.type) {
        query = query.eq("type_id", filters.type);
      }
      
      if (filters.bedroomsMin !== undefined) {
        query = query.gte("bedrooms", filters.bedroomsMin);
      }
      
      if (filters.bedroomsMax !== undefined) {
        query = query.lte("bedrooms", filters.bedroomsMax);
      }
      
      if (filters.bathroomsMin !== undefined) {
        query = query.gte("bathrooms", filters.bathroomsMin);
      }
      
      if (filters.bathroomsMax !== undefined) {
        query = query.lte("bathrooms", filters.bathroomsMax);
      }
      
      if (filters.minRoi !== undefined) {
        query = query.gte("roi_percentage", filters.minRoi);
      }
      
      // Handle amenities filter if implemented
      // This would require a more complex query or post-filtering
      
      // Handle investor level filter if implemented
      if (filters.investorLevel) {
        query = query.eq("investor_level", filters.investorLevel);
      }
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching properties:", error);
      throw new Error(error.message);
    }

    // Add proper type casting
    return data as unknown as Property[];
  } catch (error) {
    console.error("Error in fetchProperties:", error);
    throw error;
  }
};

// Add implementations for fetchLocations, fetchPropertyTypes and fetchAmenities
export const fetchLocations = async () => {
  try {
    const { data, error } = await supabase
      .from("property_locations")
      .select("city, country, zone")
      .order("country", { ascending: true })
      .order("city", { ascending: true });

    if (error) {
      console.error("Error fetching locations:", error);
      throw new Error(error.message);
    }

    return data as Array<{city: string, country: string, zone: string}>;
  } catch (error) {
    console.error("Error in fetchLocations:", error);
    throw error;
  }
};

export const fetchPropertyTypes = async () => {
  try {
    const { data, error } = await supabase
      .from("property_types")
      .select("id, name")
      .order("name", { ascending: true });

    if (error) {
      console.error("Error fetching property types:", error);
      throw new Error(error.message);
    }

    return data as Array<{id: string, name: string}>;
  } catch (error) {
    console.error("Error in fetchPropertyTypes:", error);
    throw error;
  }
};

export const fetchAmenities = async () => {
  try {
    const { data, error } = await supabase
      .from("amenities")
      .select("id, name")
      .order("name", { ascending: true });

    if (error) {
      console.error("Error fetching amenities:", error);
      throw new Error(error.message);
    }

    return data as Array<{id: string, name: string}>;
  } catch (error) {
    console.error("Error in fetchAmenities:", error);
    throw error;
  }
};
