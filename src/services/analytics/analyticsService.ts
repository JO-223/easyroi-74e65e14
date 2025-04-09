
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

    // 1. Get Portfolio ROI data
    const { data: roiData } = await supabase
      .from('user_roi')
      .select('average_roi, roi_change')
      .eq('user_id', user.id)
      .maybeSingle(); // Use maybeSingle instead of single to avoid errors

    // 2. Get Annual Growth data from investment growth
    const { data: userInvestment } = await supabase
      .from('user_investments')
      .select('investment_change_percentage')
      .eq('user_id', user.id)
      .maybeSingle();

    // 3. ROI Performance data (monthly)
    const { data: growthData } = await supabase
      .from('user_investment_growth')
      .select('month, month_index, value')
      .eq('user_id', user.id)
      .order('month_index', { ascending: true });

    // 4. Asset Allocation
    const { data: allocationData } = await supabase
      .from('user_portfolio_allocation')
      .select('location, percentage')
      .eq('user_id', user.id);

    // 5. Geographic Distribution (reusing the same data for now)
    const { data: geoDistribution } = await supabase
      .from('user_portfolio_allocation')
      .select('location, percentage')
      .eq('user_id', user.id);

    // 6. Events attended count
    const { data: eventsData } = await supabase
      .from('user_events')
      .select('count')
      .eq('user_id', user.id)
      .maybeSingle();

    // Format ROI Performance data with proper type casting - handle nulls
    const roiPerformance = growthData?.map(item => ({
      month: String(item.month || ''),
      roi: Number(item.value) || 0,
      benchmark: MARKET_AVERAGE_ROI
    })) || [];

    // Format Asset Allocation with proper type casting - handle nulls
    const assetAllocation = allocationData?.map(item => ({
      name: String(item.location || ''),
      value: Number(item.percentage) || 0
    })) || [];

    // Format Geographic Distribution with proper type casting - handle nulls
    const geographicDistribution = geoDistribution?.map(item => ({
      name: String(item.location || ''),
      value: Number(item.percentage) || 0
    })) || [];

    // Calculate market comparison
    const averageRoi = Number(roiData?.average_roi || 0);
    const marketDifference = averageRoi - MARKET_AVERAGE_ROI;

    return {
      portfolioROI: {
        value: Number(roiData?.average_roi || 0),
        change: roiData?.roi_change !== null && roiData?.roi_change !== undefined ? 
          Number(roiData.roi_change) : null
      },
      annualGrowth: {
        value: Number(userInvestment?.investment_change_percentage || 0),
        change: userInvestment?.investment_change_percentage !== null && 
          userInvestment?.investment_change_percentage !== undefined ? 
          Number(userInvestment.investment_change_percentage) : null
      },
      marketComparison: {
        value: Math.abs(marketDifference),
        status: marketDifference >= 0 ? 'above' : 'below'
      },
      roiPerformance,
      assetAllocation,
      geographicDistribution,
      eventsAttended: Number(eventsData?.count || 0)
    };
  } catch (error) {
    console.error("Error fetching analytics data:", error);
    throw error; // Let React Query handle this error
  }
}

// Generate default ROI performance data if none exists
function generateDefaultRoiPerformance() {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return months.map(month => ({
    month,
    roi: 0,
    benchmark: MARKET_AVERAGE_ROI
  }));
}
