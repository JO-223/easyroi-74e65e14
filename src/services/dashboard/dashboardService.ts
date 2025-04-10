
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
      name: item.month as string,
      value: Number(item.value),
    })) || [];
    
    // Format portfolio allocation data
    const portfolioAllocation: PortfolioAllocation[] = allocationData?.map(item => ({
      name: item.location as string,
      value: Number(item.percentage),
    })) || [];
    
    // Format properties data
    const properties: Property[] = propertiesData?.map(item => ({
      id: item.id as string,
      name: item.name as string,
      location: locationMap.get(item.location_id) || 'Unknown Location',
      roi: `${item.roi_percentage}%`,
      value: `€${(Number(item.price) / 1000).toFixed(0)}k`,
      status: item.status === 'active' ? 'active' : 'development'
    })) || [];
    
    // Create stats object
    const stats: DashboardStats = {
      totalInvestment: Number(investmentData?.total_investment || 0),
      properties: Number(propertyData?.count || 0),
      roi: Number(roiData?.average_roi || 0),
      events: eventsCount || 0, // Use actual count from database
      investmentChange: Number(investmentData?.investment_change_percentage || 0),
      propertiesChange: Number(propertyData?.change || 0),
      roiChange: Number(roiData?.roi_change || 0)
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
    return `€${(value / 1000000).toFixed(1)}M`;
  } else if (value >= 1000) {
    return `€${(value / 1000).toFixed(0)}k`;
  } else {
    return `€${value.toFixed(0)}`;
  }
}
