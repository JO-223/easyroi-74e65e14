
import { supabase } from "@/integrations/supabase/client";

export interface AnalyticsData {
  portfolioROI: {
    value: number;
    change: number | null;
  };
  annualGrowth: {
    value: number;
    change: number | null;
  };
  marketComparison: {
    value: number;
    status: 'above' | 'below';
  };
  roiPerformance: Array<{
    month: string;
    roi: number;
    benchmark: number;
  }>;
  assetAllocation: Array<{
    name: string;
    value: number;
  }>;
  geographicDistribution: Array<{
    name: string;
    value: number;
  }>;
  eventsAttended: number;
}

const MARKET_AVERAGE_ROI = 3.2; // Fixed benchmark value

/**
 * Fetches all analytics data for the current user
 */
export async function fetchAnalyticsData(): Promise<AnalyticsData | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return null;

    // Get user properties directly
    const { data: properties } = await supabase
      .from('properties')
      .select('price, roi_percentage, location_id')
      .eq('user_id', user.id);

    // Calculate ROI from properties
    let averageRoi = 0;
    if (properties && properties.length > 0) {
      averageRoi = properties.reduce((sum, property) => 
        sum + Number(property.roi_percentage || 0), 0) / properties.length;
    }

    // Calculate total investment from properties
    const totalInvestment = properties?.reduce((sum, property) => 
      sum + Number(property.price || 0), 0) || 0;
    
    // Get previous ROI data for change calculation
    const { data: roiData } = await supabase
      .from('user_roi')
      .select('average_roi, roi_change')
      .eq('user_id', user.id)
      .maybeSingle();

    // Get locations for geographic distribution
    const locationIds = properties?.map(prop => prop.location_id) || [];
    const locationMap = new Map();
    
    if (locationIds.length > 0) {
      const { data: locationsData } = await supabase
        .from('property_locations')
        .select('id, city, country')
        .in('id', locationIds);
      
      if (locationsData) {
        locationsData.forEach(loc => {
          locationMap.set(loc.id, { city: loc.city, country: loc.country });
        });
      }
    }

    // Calculate geographic distribution
    const geoDistribution = new Map();
    if (properties && properties.length > 0) {
      properties.forEach(property => {
        const location = locationMap.get(property.location_id);
        if (location) {
          const city = location.city;
          const currentValue = geoDistribution.get(city) || 0;
          geoDistribution.set(city, currentValue + Number(property.price));
        }
      });
    }
    
    // Calculate percentages
    const geographicDistributionData = [];
    if (totalInvestment > 0) {
      geoDistribution.forEach((value, city) => {
        geographicDistributionData.push({
          name: city,
          value: Math.round((value / totalInvestment) * 100)
        });
      });
    }

    // Get investment change data
    const { data: userInvestment } = await supabase
      .from('user_investments')
      .select('investment_change_percentage')
      .eq('user_id', user.id)
      .maybeSingle();

    // Generate ROI performance data (monthly)
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentMonth = new Date().getMonth();
    const roiPerformance = [];
    
    // Generate synthetic ROI performance data
    if (averageRoi > 0) {
      for (let i = 0; i < 12; i++) {
        const monthIndex = (currentMonth - 11 + i) % 12;
        const monthName = months[monthIndex >= 0 ? monthIndex : monthIndex + 12];
        
        // Generate a realistic ROI curve with some randomness
        const trendFactor = 0.7 + (i * 0.05);
        const randomFactor = 0.9 + (Math.random() * 0.2);
        const monthRoi = averageRoi * trendFactor * randomFactor;
        
        roiPerformance.push({
          month: monthName,
          roi: parseFloat(monthRoi.toFixed(1)),
          benchmark: MARKET_AVERAGE_ROI
        });
      }
    } else {
      // Default empty data
      for (let i = 0; i < 12; i++) {
        const monthIndex = (currentMonth - 11 + i) % 12;
        const monthName = months[monthIndex >= 0 ? monthIndex : monthIndex + 12];
        
        roiPerformance.push({
          month: monthName,
          roi: 0,
          benchmark: MARKET_AVERAGE_ROI
        });
      }
    }

    // Calculate asset allocation (same as geographic for now, but could be different types of assets)
    const assetAllocation = geographicDistributionData.length > 0 ? geographicDistributionData : [];

    // Calculate market comparison
    const marketDifference = averageRoi - MARKET_AVERAGE_ROI;

    // Get events attended count
    const { data: eventsData } = await supabase
      .from('user_events')
      .select('count')
      .eq('user_id', user.id)
      .maybeSingle();

    // Update analytics tables with the new data
    // Update user_roi table
    await supabase
      .from('user_roi')
      .upsert({
        user_id: user.id,
        average_roi: averageRoi,
        roi_change: roiData?.roi_change || 0
      }, { onConflict: 'user_id' });

    // Update user_investments table
    await supabase.rpc(
      'update_user_investment',
      {
        p_user_id: user.id,
        p_investment_amount: totalInvestment
      }
    );

    return {
      portfolioROI: {
        value: averageRoi,
        change: roiData?.roi_change !== null && roiData?.roi_change !== undefined ? 
          Number(roiData.roi_change) : 0
      },
      annualGrowth: {
        value: Number(userInvestment?.investment_change_percentage || 0),
        change: userInvestment?.investment_change_percentage !== null && 
          userInvestment?.investment_change_percentage !== undefined ? 
          Number(userInvestment.investment_change_percentage) : 0
      },
      marketComparison: {
        value: Math.abs(marketDifference),
        status: marketDifference >= 0 ? 'above' : 'below'
      },
      roiPerformance,
      assetAllocation,
      geographicDistribution: geographicDistributionData,
      eventsAttended: Number(eventsData?.count || 0)
    };
  } catch (error) {
    console.error("Error fetching analytics data:", error);
    throw error; // Let React Query handle this error
  }
}
