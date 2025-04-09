
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
      .select(`
        id,
        name,
        price,
        roi_percentage,
        status,
        property_locations:location_id (
          city,
          country
        )
      `)
      .eq('user_id', user.id);
    
    // Get events count (using a placeholder until we have events data)
    const eventsCount = 3;
    
    // Format investment growth data
    const investmentGrowth = growthData?.map(item => ({
      name: item.month,
      value: Number(item.value),
    })) || [];
    
    // Format portfolio allocation data
    const portfolioAllocation = allocationData?.map(item => ({
      name: item.location,
      value: Number(item.percentage),
    })) || [];
    
    // Format properties data
    const properties = propertiesData?.map(item => ({
      id: item.id,
      name: item.name,
      location: `${item.property_locations.city}, ${item.property_locations.country}`,
      roi: `${item.roi_percentage}%`,
      value: `€${(item.price / 1000).toFixed(0)}k`,
      status: item.status === 'active' ? 'active' : 'development'
    })) || [];
    
    // Create stats object
    const stats: DashboardStats = {
      totalInvestment: Number(investmentData?.total_investment || 0),
      properties: Number(propertyData?.count || 0),
      roi: Number(roiData?.average_roi || 0),
      events: eventsCount,
      investmentChange: Number(investmentData?.investment_change_percentage || 0),
      propertiesChange: Number(propertyData?.change || 0),
      roiChange: Number(roiData?.roi_change || 0)
    };
    
    return {
      stats,
      investmentGrowth,
      portfolioAllocation,
      properties,
      userLevel: profileData?.level || null
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
