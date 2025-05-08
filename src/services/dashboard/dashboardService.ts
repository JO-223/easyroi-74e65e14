
import { supabase } from "@/integrations/supabase/client";

// Types for dashboard data
export interface DashboardStats {
  totalInvestment: number;
  properties: number;
  roi: number;
  events: number;
  investmentChange: number;
  propertiesChange: number;
  roiChange: number;
}

export interface InvestmentGrowth {
  name: string;
  value: number;
}

export interface PortfolioAllocation {
  name: string;
  value: number;
}

export interface Property {
  id: string;
  name: string;
  location: string;
  roi: string;
  value: string;
  currentEvaluation?: string;
  status: string;
  ownership: number;
}

export interface DashboardData {
  stats: DashboardStats;
  investmentGrowth: InvestmentGrowth[];
  portfolioAllocation: PortfolioAllocation[];
  properties: Property[];
  userLevel: string | null;
}

/**
 * Fetches all dashboard data for the current user
 */
export async function fetchDashboardData(): Promise<DashboardData | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return null;
    
    // Get user profile for level
    const { data: profileData } = await supabase
      .from('profiles')
      .select('level')
      .eq('id', user.id)
      .single();
    
    // Get user properties and calculate total investment directly from properties
    const { data: propertiesData } = await supabase
      .from('properties')
      .select('id, name, price, roi_percentage, status, location_id, ownership, Current_Evaluation')
      .eq('user_id', user.id);

    // Calculate total investment directly from properties
    const totalInvestment = propertiesData?.reduce((sum, property) => 
      sum + Number(property.price || 0), 0) || 0;
    
    // Get previous total investment for change calculation
    const { data: prevInvestmentData } = await supabase
      .from('user_investments')
      .select('total_investment, investment_change_percentage')
      .eq('user_id', user.id)
      .single();
    
    // Calculate investment change percentage
    let investmentChange = 0;
    if (prevInvestmentData && prevInvestmentData.total_investment > 0) {
      investmentChange = ((totalInvestment - Number(prevInvestmentData.total_investment)) / 
        Number(prevInvestmentData.total_investment)) * 100;
    }
    
    // Calculate average ROI directly from properties
    let totalRoi = 0;
    let propertiesWithRoi = 0;
    
    if (propertiesData && propertiesData.length > 0) {
      propertiesData.forEach(property => {
        if (property.roi_percentage !== null && property.roi_percentage !== undefined) {
          totalRoi += Number(property.roi_percentage);
          propertiesWithRoi++;
        }
      });
    }
    
    const averageRoi = propertiesWithRoi > 0 ? totalRoi / propertiesWithRoi : 0;
    
    // Get previous ROI for change calculation
    const { data: prevRoiData } = await supabase
      .from('user_roi')
      .select('average_roi, roi_change')
      .eq('user_id', user.id)
      .single();
    
    // Calculate ROI change
    let roiChange = 0;
    if (prevRoiData) {
      roiChange = averageRoi - Number(prevRoiData.average_roi || 0);
    }
    
    // Get property count change
    const { data: propertyData } = await supabase
      .from('user_properties')
      .select('count, change')
      .eq('user_id', user.id)
      .single();
    
    // Get investment growth data
    const { data: growthData } = await supabase
      .from('user_investment_growth')
      .select('month, value')
      .eq('user_id', user.id)
      .order('month_index', { ascending: true });
    
    // Calculate portfolio allocation by country directly from properties
    let portfolioAllocation: PortfolioAllocation[] = [];
    
    if (propertiesData && propertiesData.length > 0) {
      const locationIds = propertiesData.map(prop => prop.location_id);
      
      // Get location data for all properties
      const { data: locationsData } = await supabase
        .from('property_locations')
        .select('id, country')
        .in('id', locationIds);
      
      if (locationsData && locationsData.length > 0) {
        // Count properties by country
        const countryMap = new Map<string, number>();
        
        propertiesData.forEach(property => {
          const location = locationsData.find(loc => loc.id === property.location_id);
          if (location) {
            const country = location.country;
            countryMap.set(country, (countryMap.get(country) || 0) + 1);
          }
        });
        
        // Calculate percentage based on property count
        const totalProperties = propertiesData.length;
        portfolioAllocation = Array.from(countryMap.entries()).map(([country, count]) => ({
          name: country,
          value: (count / totalProperties) * 100
        }));
      }
    }
    
    // Get property locations for display
    const locationMap = new Map();
    if (propertiesData && propertiesData.length > 0) {
      const locationIds = propertiesData.map(prop => prop.location_id);
      const { data: locationsData } = await supabase
        .from('property_locations')
        .select('id, city, country')
        .in('id', locationIds);
      
      if (locationsData) {
        locationsData.forEach(loc => {
          locationMap.set(loc.id, `${loc.city}, ${loc.country}`);
        });
      }
    }
    
    // Get events count
    const { count: eventsCount, error: eventsError } = await supabase
      .from('events')
      .select('*', { count: 'exact', head: true });
      
    if (eventsError) {
      console.error("Error fetching events count:", eventsError);
    }
    
    // Format investment growth data
    const investmentGrowth: InvestmentGrowth[] = growthData?.map(item => ({
      name: String(item.month || ""),
      value: Number(item.value || 0),
    })) || [];
    
    // Format properties data
    const properties: Property[] = propertiesData?.map(item => {
      let roiValue = "0%";
      
      // Handle all possible types for roi_percentage
      if (typeof item.roi_percentage === 'number') {
        roiValue = `${item.roi_percentage.toFixed(2)}%`;
      } else if (typeof item.roi_percentage === 'string') {
        roiValue = `${parseFloat(item.roi_percentage).toFixed(2)}%`;
      }
      
      return {
        id: String(item.id || ""),
        name: String(item.name || ""),
        location: locationMap.get(item.location_id) || 'Unknown Location',
        roi: roiValue,
        value: formatCurrency(Number(item.price || 0)),
        currentEvaluation: item.Current_Evaluation ? formatCurrency(Number(item.Current_Evaluation)) : undefined,
        status: item.status === 'active' ? 'active' : 'development',
        ownership: Number(item.ownership || 100)
      };
    }) || [];
    
    // Create stats object
    const stats: DashboardStats = {
      totalInvestment: totalInvestment,
      properties: propertiesData?.length || 0,
      roi: parseFloat(averageRoi.toFixed(2)),
      events: eventsCount || 0,
      investmentChange: parseFloat(investmentChange.toFixed(2)),
      propertiesChange: Number(propertyData?.change || 0),
      roiChange: parseFloat(roiChange.toFixed(2))
    };
    
    // Update the user_investments table with the new calculated values
    await supabase
      .from('user_investments')
      .upsert({
        user_id: user.id,
        total_investment: totalInvestment,
        investment_change_percentage: investmentChange
      });
    
    // Update the user_roi table with the new calculated values
    await supabase
      .from('user_roi')
      .upsert({
        user_id: user.id,
        average_roi: averageRoi,
        roi_change: roiChange
      });
    
    return {
      stats,
      investmentGrowth,
      portfolioAllocation,
      properties,
      userLevel: profileData?.level as string | null
    };
    
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return null;
  }
}

/**
 * Format number to currency string
 */
export function formatCurrency(value: number): string {
  if (value >= 1000000) {
    // Format as X.YM (with one decimal place)
    return `AED${(value / 1000000).toFixed(1).replace('.0', '')}M`;
  } else if (value >= 1000) {
    // Format as X.Yk (with one decimal place)
    return `AED${(value / 1000).toFixed(1).replace('.0', '')}k`;
  } else {
    return `AED${value.toFixed(0)}`;
  }
}
