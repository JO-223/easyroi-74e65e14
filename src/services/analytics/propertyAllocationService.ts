
import { supabase } from "@/integrations/supabase/client";
import { PropertyTypeAllocation } from "./types";

/**
 * Fetches analytics data for property type allocation
 */
export async function getPropertyTypeAllocation(userId: string): Promise<PropertyTypeAllocation[]> {
  try {
    const { data, error } = await supabase
      .from('properties')
      .select(`
        price,
        type:property_types(name)
      `)
      .eq('user_id', userId);
      
    if (error) {
      console.error("Error fetching property type allocation:", error);
      return [];
    }
    
    // Calculate totals by property type
    const typeMap = new Map<string, number>();
    let totalInvestment = 0;
    
    if (data && Array.isArray(data)) {
      data.forEach(property => {
        // Add rigorous null and type checking
        if (!property.type || typeof property.type !== 'object') {
          return;
        }
        
        // Use type assertion to tell TypeScript that property.type is an object with a name property
        // and provide fallback for unknown types
        const typeObj = property.type as { name?: string };
        const typeName = typeObj.name ? String(typeObj.name) : 'Unknown';
                        
        const price = Number(property.price || 0);
        totalInvestment += price;
        
        if (typeMap.has(typeName)) {
          typeMap.set(typeName, (typeMap.get(typeName) || 0) + price);
        } else {
          typeMap.set(typeName, price);
        }
      });
    }
    
    // Convert to percentage
    const typeAllocation = Array.from(typeMap.entries()).map(([name, value]) => ({
      name,
      value: totalInvestment > 0 ? Number(((value) / totalInvestment * 100).toFixed(2)) : 0
    }));
    
    return typeAllocation;
  } catch (error) {
    console.error("Error in getPropertyTypeAllocation:", error);
    return [];
  }
}
