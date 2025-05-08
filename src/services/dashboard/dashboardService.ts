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
    
    // Get user properties to calculate investments and ROI directly
    const { data: propertiesData } = await supabase
      .from('properties')
      .select('id, name, price, roi_percentage, status, location_id, ownership, Current_Evaluation')
      .eq('user_id', user.id);
    
    // Calculate total investment directly from properties
    const totalInvestment = propertiesData ? propertiesData.reduce((sum, property) => 
      sum + Number(property.price || 0), 0) : 0;
    
    // Calculate average ROI as sum of percentages divided by number of properties
    let totalROI = 0;
    let propertiesWithROI = 0;
    
    if (propertiesData && propertiesData.length > 0) {
      propertiesData.forEach(property => {
        const roi = Number(property.roi_percentage || 0);
        if (!isNaN(roi)) {
          totalROI += roi;
          propertiesWithROI++;
        }
      });
    }
    
    const averageROI = propertiesWithROI > 0 ? totalROI / propertiesWithROI : 0;
    
    // Get previous investment data to calculate change
    const { data: investmentData } = await supabase
      .from('user_investments')
      .select('investment_change_percentage')
      .eq('user_id', user.id)
      .single();
    
    // Get property count change
    const { data: propertyData } = await supabase
      .from('user_properties')
      .select('change')
      .eq('user_id', user.id)
      .single();
    
    // Get ROI change
    const { data: roiData } = await supabase
      .from('user_roi')
      .select('roi_change')
      .eq('user_id', user.id)
      .single();
    
    // Get investment growth data
    const { data: growthData } = await supabase
      .from('user_investment_growth')
      .select('month, value')
      .eq('user_id', user.id)
      .order('month_index', { ascending: true });
    
    // Calculate portfolio allocation by country
    let countryAllocation = {};
    let totalProperties = 0;
    
    if (propertiesData && propertiesData.length > 0) {
      // Get locations for all properties
      const locationIds = propertiesData.map(prop => prop.location_id);
      const { data: locationsData } = await supabase
        .from('property_locations')
        .select('id, country')
        .in('id', locationIds);
      
      if (locationsData) {
        // Create a map of location IDs to countries
        const locationMap = new Map();
        locationsData.forEach(loc => {
          locationMap.set(loc.id, loc.country);
        });
        
        // Count properties by country
        propertiesData.forEach(property => {
          const country = locationMap.get(property.location_id);
          if (country) {
            if (!countryAllocation[country]) {
              countryAllocation[country] = 0;
            }
            countryAllocation[country]++;
            totalProperties++;
          }
        });
      }
    }
    
    // Convert country allocation to percentages
    const portfolioAllocation: PortfolioAllocation[] = Object.entries(countryAllocation).map(([country, count]) => ({
      name: country,
      value: totalProperties > 0 ? Number((Number(count) / totalProperties * 100).toFixed(2)) : 0
    }));
    
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
    
    // Get property locations for displaying properties
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
    
    // Format properties data with rounded ROI percentages
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
    
    // Create stats object with rounded percentages
    const stats: DashboardStats = {
      totalInvestment: totalInvestment,
      properties: propertiesData?.length || 0,
      roi: parseFloat(Number(averageROI || 0).toFixed(2)),
      events: eventsCount || 0,
      investmentChange: parseFloat(Number(investmentData?.investment_change_percentage || 0).toFixed(2)),
      propertiesChange: Number(propertyData?.change || 0),
      roiChange: parseFloat(Number(roiData?.roi_change || 0).toFixed(2))
    };
    
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
