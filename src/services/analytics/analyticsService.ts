
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
    console.log("Fetching analytics data from Supabase...");
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.log("No authenticated user found");
      return null;
    }

    // 1. Get Portfolio ROI data
    const { data: roiData, error: roiError } = await supabase
      .from('user_roi')
      .select('average_roi, roi_change')
      .eq('user_id', user.id)
      .maybeSingle();
      
    if (roiError) console.error("Error fetching ROI data:", roiError);

    // 2. Get Annual Growth data from investment growth
    const { data: userInvestment, error: investmentError } = await supabase
      .from('user_investments')
      .select('investment_change_percentage')
      .eq('user_id', user.id)
      .maybeSingle();
      
    if (investmentError) console.error("Error fetching investment data:", investmentError);

    // 3. ROI Performance data (monthly)
    const { data: growthData, error: growthError } = await supabase
      .from('user_investment_growth')
      .select('month, month_index, value')
      .eq('user_id', user.id)
      .order('month_index', { ascending: true });
      
    if (growthError) console.error("Error fetching growth data:", growthError);
    console.log("Growth data from Supabase:", growthData);

    // 4. Asset Allocation
    const { data: allocationData, error: allocationError } = await supabase
      .from('user_portfolio_allocation')
      .select('location, percentage')
      .eq('user_id', user.id);
      
    if (allocationError) console.error("Error fetching allocation data:", allocationError);
    console.log("Allocation data from Supabase:", allocationData);

    // 5. Geographic Distribution (reusing the same data for now)
    const { data: geoDistribution, error: geoError } = await supabase
      .from('user_portfolio_allocation')
      .select('location, percentage')
      .eq('user_id', user.id);
      
    if (geoError) console.error("Error fetching geo distribution data:", geoError);

    // 6. Events attended count
    const { data: eventsData, error: eventsError } = await supabase
      .from('user_events')
      .select('count')
      .eq('user_id', user.id)
      .maybeSingle();
      
    if (eventsError) console.error("Error fetching events data:", eventsError);

    // Format ROI Performance data with proper type casting - handle nulls
    const roiPerformance = growthData?.map(item => {
      const roiValue = parseFloat(String(item.value || 0));
      // For demo purposes, add some variation to ROI values
      return {
        month: String(item.month || ''),
        roi: Number(roiValue.toFixed(2)),
        benchmark: Number(MARKET_AVERAGE_ROI.toFixed(2))
      };
    }) || [];

    // Format Asset Allocation with proper type casting - handle nulls
    const assetAllocation = allocationData?.map(item => ({
      name: String(item.location || ''),
      value: Number(parseFloat(String(item.percentage || 0)).toFixed(2))
    })) || [];

    // Format Geographic Distribution with proper type casting - handle nulls
    const geographicDistribution = geoDistribution?.map(item => ({
      name: String(item.location || ''),
      value: Number(parseFloat(String(item.percentage || 0)).toFixed(2))
    })) || [];

    // Calculate market comparison
    const averageRoi = Number(parseFloat(String(roiData?.average_roi || 0)).toFixed(2));
    const marketDifference = averageRoi - MARKET_AVERAGE_ROI;

    const result: AnalyticsData = {
      portfolioROI: {
        value: averageRoi,
        change: roiData?.roi_change !== null && roiData?.roi_change !== undefined ? 
          Number(parseFloat(String(roiData.roi_change)).toFixed(2)) : null
      },
      annualGrowth: {
        value: Number(parseFloat(String(userInvestment?.investment_change_percentage || 0)).toFixed(2)),
        change: userInvestment?.investment_change_percentage !== null && 
          userInvestment?.investment_change_percentage !== undefined ? 
          Number(parseFloat(String(userInvestment.investment_change_percentage)).toFixed(2)) : null
      },
      marketComparison: {
        value: Number(Math.abs(marketDifference).toFixed(2)),
        status: marketDifference >= 0 ? 'above' : 'below'
      },
      roiPerformance,
      assetAllocation,
      geographicDistribution,
      eventsAttended: Number(eventsData?.count || 0)
    };
    
    console.log("Formatted analytics data:", result);
    return result;
  } catch (error) {
    console.error("Error fetching analytics data:", error);
    throw error; // Let React Query handle this error
  }
}
