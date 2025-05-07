
import { supabase } from "@/integrations/supabase/client";

export interface CashflowFilters {
  year: number;
  month: number | null;
  propertyId: string | null;
}

export interface CashflowData {
  month: string;
  bookingsTotal: number;
  portalFees: number;
  cleaningCosts: number;
  touristTax: number;
  forecastedGrossTotal: number;
  actualGrossTotal: number;
  utilityCosts: number;
  maintenanceCosts: number;
  forecastedNetTotal: number;
  actualNetTotal: number;
}

// Months in order
const months = [
  'January', 'February', 'March', 'April', 'May', 'June', 
  'July', 'August', 'September', 'October', 'November', 'December'
];

export async function fetchCashflowData(filters: CashflowFilters): Promise<CashflowData[]> {
  try {
    // In the real implementation, this would fetch data from Supabase
    // For now, we'll return mock data
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    // Get actual property data from the database if specified
    let propertyName = "All Properties";
    if (filters.propertyId) {
      const { data: property } = await supabase
        .from('properties')
        .select('name')
        .eq('id', filters.propertyId)
        .single();
      
      if (property) {
        propertyName = property.name;
      }
    }
    
    // For now, generate mock data
    const mockData: CashflowData[] = [];
    
    // If a specific month is selected, only return data for that month
    const monthsToShow = filters.month ? [months[filters.month - 1]] : months;
    
    for (const month of monthsToShow) {
      // Create consistent but random-looking data based on the month name
      const seed = month.length + filters.year % 100;
      const bookingsBase = 5000 + (seed * 300);
      
      const bookingsTotal = bookingsBase + Math.floor(Math.random() * 2000);
      const portalFees = Math.floor(bookingsTotal * 0.15); // 15% of bookings
      const cleaningCosts = 300 + Math.floor(Math.random() * 200);
      const touristTax = Math.floor(bookingsTotal * 0.05); // 5% of bookings
      
      const forecastedGrossTotal = bookingsTotal - portalFees - cleaningCosts - touristTax;
      // Actual is close to forecast but has some variation
      const actualGrossTotal = Math.floor(forecastedGrossTotal * (0.9 + Math.random() * 0.3)); 
      
      const utilityCosts = 150 + Math.floor(Math.random() * 100);
      const maintenanceCosts = 100 + Math.floor(Math.random() * 300);
      
      const forecastedNetTotal = forecastedGrossTotal - utilityCosts - maintenanceCosts;
      const actualNetTotal = actualGrossTotal - utilityCosts - maintenanceCosts;

      mockData.push({
        month,
        bookingsTotal,
        portalFees,
        cleaningCosts,
        touristTax,
        forecastedGrossTotal,
        actualGrossTotal,
        utilityCosts,
        maintenanceCosts,
        forecastedNetTotal,
        actualNetTotal
      });
    }
    
    return mockData;
    
  } catch (error) {
    console.error('Error fetching cashflow data:', error);
    throw error;
  }
}
