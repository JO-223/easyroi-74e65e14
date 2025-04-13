
import { supabase } from "@/integrations/supabase/client";
import { Property, PropertyFilter } from "@/types/property";

export const fetchProperties = async (filter?: PropertyFilter): Promise<Property[]> => {
  try {
    let query = supabase.from("properties").select(`
      *,
      type:type_id(*),
      location:location_id(*),
      images:property_images(*),
      amenities:property_amenities(amenities(*)),
      pros_cons:property_pros_cons(*)
    `);

    // Apply filters
    if (filter) {
      // Location filter
      if (filter.locations && filter.locations.length > 0) {
        const locationText = filter.locations[0]; // Use the first location for now
        query = query.or(
          `location.city.ilike.%${locationText}%,location.country.ilike.%${locationText}%,location.zone.ilike.%${locationText}%,location.address.ilike.%${locationText}%`
        );
      }

      // Price range filter
      if (filter.priceMin) {
        query = query.gte("price", filter.priceMin);
      }
      if (filter.priceMax) {
        query = query.lte("price", filter.priceMax);
      }

      // Property type filter
      if (filter.propertyTypes && filter.propertyTypes.length > 0) {
        const propertyTypeIds = filter.propertyTypes;
        query = query.in("type_id", propertyTypeIds);
      }

      // Bedroom range filter
      if (filter.bedroomsMin) {
        query = query.gte("bedrooms", filter.bedroomsMin);
      }
      if (filter.bedroomsMax) {
        query = query.lte("bedrooms", filter.bedroomsMax);
      }

      // Bathroom range filter
      if (filter.bathroomsMin) {
        query = query.gte("bathrooms", filter.bathroomsMin);
      }
      if (filter.bathroomsMax) {
        query = query.lte("bathrooms", filter.bathroomsMax);
      }

      // ROI filter
      if (filter.roiMin) {
        query = query.gte("roi_percentage", filter.roiMin);
      }

      // Investor level filter
      if (filter.investorLevel) {
        query = query.eq("investor_level", filter.investorLevel);
      }
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching properties:", error);
      throw new Error(error.message);
    }

    // Transform the data to match our Property interface
    const properties = data.map((property: any) => {
      return {
        ...property,
        amenities: property.amenities.map((a: any) => a.amenities),
        // Restructure other nested objects as needed
      };
    });

    return properties as Property[];
  } catch (error) {
    console.error("Error in fetchProperties:", error);
    throw error;
  }
};
