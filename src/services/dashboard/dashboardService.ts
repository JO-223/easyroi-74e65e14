
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
 * Format number to currency string with proper formatting
 */
export function formatCurrency(value: number): string {
  // For exact display without rounding to millions
  if (value >= 1000000) {
    const millions = value / 1000000;
    // Check if it's a round million
    if (millions === Math.floor(millions)) {
      return `€${millions.toFixed(0)}M`;
    } else {
      // Format with correct precision to 2 decimals if needed
      const precision = millions.toFixed(2).endsWith('.00') ? 0 : 2;
      return `€${millions.toFixed(precision)}M`;
    }
  } else if (value >= 1000) {
    return `€${(value / 1000).toFixed(0)}k`;
  } else {
    return `€${value.toFixed(0)}`;
  }
}

/**
 * Format exact value for detailed display
 */
export function formatExactCurrency(value: number): string {
  return new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0
  }).format(value);
}

/**
 * Maps property status to localization keys
 */
export function getPropertyStatusKey(status: string): string {
  const statusMap: Record<string, string> = {
    'available': 'available',
    'active': 'active', 
    'sold': 'sold',
    'development': 'development',
    'in_development': 'development'
  };
  
  return statusMap[status] || 'unknown';
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
    
    // Get user properties directly from properties table
    const { data: propertiesData } = await supabase
      .from('properties')
      .select('id, name, price, roi_percentage, status, location_id')
      .eq('user_id', user.id);
    
    // Calculate total investment based on properties
    const totalInvestment = propertiesData?.reduce((sum, property) => sum + Number(property.price), 0) || 0;
    
    // Calculate average ROI from properties
    let averageROI = 0;
    if (propertiesData && propertiesData.length > 0) {
      averageROI = propertiesData.reduce((sum, prop) => sum + Number(prop.roi_percentage), 0) / propertiesData.length;
    }
    
    // Get property locations
    const locationMap = new Map();
    const countryMap = new Map();
    if (propertiesData && propertiesData.length > 0) {
      const locationIds = propertiesData.map(prop => prop.location_id);
      const { data: locationsData } = await supabase
        .from('property_locations')
        .select('id, city, country')
        .in('id', locationIds);
      
      if (locationsData) {
        locationsData.forEach(loc => {
          locationMap.set(loc.id, `${loc.city}, ${loc.country}`);
          
          // Track investment by country for portfolio allocation
          const property = propertiesData.find(p => p.location_id === loc.id);
          if (property) {
            const currentValue = countryMap.get(loc.country) || 0;
            countryMap.set(loc.country, currentValue + Number(property.price));
          }
        });
      }
    }
    
    // Update user_investments table with new calculated investment amount
    await supabase.rpc(
      'update_user_investment',
      {
        p_user_id: user.id,
        p_investment_amount: totalInvestment
      }
    );
    
    // Update user_roi table 
    const { data: existingRoi } = await supabase
      .from('user_roi')
      .select('average_roi')
      .eq('user_id', user.id)
      .maybeSingle();
    
    const roiChange = existingRoi ? (averageROI - Number(existingRoi.average_roi)) : 0;
    
    await supabase
      .from('user_roi')
      .upsert({
        user_id: user.id,
        average_roi: averageROI,
        roi_change: roiChange
      }, { onConflict: 'user_id' });
    
    // Update user_properties count
    const propertiesCount = propertiesData?.length || 0;
    
    const { data: existingProps } = await supabase
      .from('user_properties')
      .select('count')
      .eq('user_id', user.id)
      .maybeSingle();
    
    const propsChange = existingProps ? (propertiesCount - Number(existingProps.count)) : 0;
    
    await supabase
      .from('user_properties')
      .upsert({
        user_id: user.id,
        count: propertiesCount,
        change: propsChange
      }, { onConflict: 'user_id' });
    
    // Generate portfolio allocation data based on property countries
    const portfolioAllocation: PortfolioAllocation[] = [];
    if (totalInvestment > 0) {
      countryMap.forEach((value, country) => {
        portfolioAllocation.push({
          name: country,
          value: Math.round((value / totalInvestment) * 100)
        });
      });
    }
    
    // Update portfolio allocation in database
    // First delete existing allocations
    await supabase
      .from('user_portfolio_allocation')
      .delete()
      .eq('user_id', user.id);
    
    // Then insert new ones if we have any
    if (portfolioAllocation.length > 0) {
      const allocationsToInsert = portfolioAllocation.map(item => ({
        user_id: user.id,
        location: item.name,
        percentage: item.value
      }));
      
      await supabase
        .from('user_portfolio_allocation')
        .insert(allocationsToInsert);
    }
    
    // Get actual investment growth data from database
    const { data: investmentGrowthData } = await supabase
      .from('user_investment_growth')
      .select('month, value')
      .eq('user_id', user.id)
      .order('month_index', { ascending: true });
    
    let investmentGrowth: InvestmentGrowth[] = [];
    
    if (investmentGrowthData && investmentGrowthData.length > 0) {
      // Use actual data from the database, ensuring month is cast to string
      investmentGrowth = investmentGrowthData.map(item => ({
        name: String(item.month),
        value: Number(item.value)
      }));
    } else {
      // If no data exists, create placeholder data
      // Generate the last 12 months for the timeline
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const currentMonth = new Date().getMonth();
      
      // Create placeholder data with the total investment value
      for (let i = 0; i < 12; i++) {
        const monthIndex = (currentMonth - 11 + i) % 12;
        const monthName = months[monthIndex >= 0 ? monthIndex : monthIndex + 12];
        
        investmentGrowth.push({
          name: monthName,
          value: totalInvestment
        });
      }
      
      // Insert this placeholder data into the database
      const growthToInsert = investmentGrowth.map((item, index) => {
        const monthIndex = (currentMonth - 11 + index) % 12;
        return {
          user_id: user.id,
          month: item.name,
          month_index: monthIndex >= 0 ? monthIndex : monthIndex + 12,
          value: item.value
        };
      });
      
      await supabase
        .from('user_investment_growth')
        .insert(growthToInsert);
    }
    
    // Get events count
    const { count: eventsCount } = await supabase
      .from('events')
      .select('*', { count: 'exact', head: true });
    
    // Format properties data
    const properties: Property[] = propertiesData?.map(item => ({
      id: item.id as string,
      name: item.name as string,
      location: locationMap.get(item.location_id) || 'Unknown Location',
      roi: `${item.roi_percentage}%`,
      value: formatExactCurrency(Number(item.price)),
      status: item.status as string
    })) || [];
    
    // Get the investment change percentage
    const { data: investmentData } = await supabase
      .from('user_investments')
      .select('investment_change_percentage')
      .eq('user_id', user.id)
      .maybeSingle();
    
    // Create stats object
    const stats: DashboardStats = {
      totalInvestment: totalInvestment,
      properties: propertiesCount,
      roi: averageROI,
      events: eventsCount || 0,
      investmentChange: Number(investmentData?.investment_change_percentage || 0),
      propertiesChange: propsChange,
      roiChange: roiChange
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
