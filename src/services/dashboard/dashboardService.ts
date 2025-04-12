
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
  status: string;
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
    
    // Get user investment data
    const { data: investmentData } = await supabase
      .from('user_investments')
      .select('total_investment, investment_change_percentage')
      .eq('user_id', user.id)
      .single();
    
    // Get user ROI data
    const { data: roiData } = await supabase
      .from('user_roi')
      .select('average_roi, roi_change')
      .eq('user_id', user.id)
      .single();
    
    // Get user properties count
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
    
    // Get portfolio allocation
    const { data: allocationData } = await supabase
      .from('user_portfolio_allocation')
      .select('location, percentage')
      .eq('user_id', user.id);
    
    // Get user properties
    const { data: propertiesData } = await supabase
      .from('properties')
      .select('id, name, price, roi_percentage, status, location_id')
      .eq('user_id', user.id);
    
    // Get property locations
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
    
    // Get events count - fetch actual count from events table
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
    
    // Format portfolio allocation data - ensure percentage is a number and formatted to 2 decimal places
    const portfolioAllocation: PortfolioAllocation[] = allocationData?.map(item => ({
      name: String(item.location || ""),
      value: Number(parseFloat(String(item.percentage || "0")).toFixed(2)), // Format to 2 decimal places
    })) || [];
    
    // Format properties data with rounded ROI percentages
    const properties: Property[] = propertiesData?.map(item => ({
      id: String(item.id || ""),
      name: String(item.name || ""),
      location: locationMap.get(item.location_id) || 'Unknown Location',
      roi: `${parseFloat(String(item.roi_percentage || "0")).toFixed(2)}%`, // Format ROI to 2 decimal places
      value: formatCurrency(Number(item.price || 0)),
      status: item.status === 'active' ? 'active' : 'development'
    })) || [];
    
    // Create stats object with rounded percentages
    const stats: DashboardStats = {
      totalInvestment: Number(investmentData?.total_investment || 0),
      properties: Number(propertyData?.count || 0),
      roi: parseFloat((roiData?.average_roi || 0).toFixed(2)), // Format ROI to 2 decimal places
      events: eventsCount || 0,
      investmentChange: parseFloat(String(investmentData?.investment_change_percentage || "0").toFixed(2)), // Format to 2 decimal places
      propertiesChange: Number(propertyData?.change || 0),
      roiChange: parseFloat(String(roiData?.roi_change || "0").toFixed(2)) // Format to 2 decimal places
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
    return `€${(value / 1000000).toFixed(1).replace('.0', '')}M`;
  } else if (value >= 1000) {
    // Format as X.Yk (with one decimal place)
    return `€${(value / 1000).toFixed(1).replace('.0', '')}k`;
  } else {
    return `€${value.toFixed(0)}`;
  }
}
