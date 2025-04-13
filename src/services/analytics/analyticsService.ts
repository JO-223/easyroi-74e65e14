
import { supabase } from "@/integrations/supabase/client";
import { AnalyticsData } from "./types";
import { getPropertyTypeAllocation } from "./propertyAllocationService";
import { fetchRoiData } from "./services/roiService";
import { fetchInvestmentData } from "./services/investmentService";
import { fetchMonthlyRoiData } from "./services/monthlyDataService";
import { fetchGeographicDistribution } from "./services/geoDistributionService";
import { fetchEventsAttendedData } from "./services/eventsService";
import { processRoiPerformanceData } from "./services/performanceDataService";
import { MARKET_AVERAGE_ROI } from "./constants";

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

    // Fetch portfolio data in parallel for better performance
    const [
      roiData,
      userInvestment,
      monthlyRoiData,
      geoDistribution,
      eventsData
    ] = await Promise.all([
      fetchRoiData(user.id),
      fetchInvestmentData(user.id),
      fetchMonthlyRoiData(user.id),
      fetchGeographicDistribution(user.id),
      fetchEventsAttendedData(user.id)
    ]);

    // Get property type allocation using the helper function
    const typeAllocationData = await getPropertyTypeAllocation(user.id);

    // Process ROI performance data - await the result since it's now an async function
    const roiPerformanceData = await processRoiPerformanceData(
      user.id, 
      monthlyRoiData, 
      // Convert potentially unknown value to number or undefined
      typeof roiData?.average_roi === 'number' ? roiData.average_roi : undefined
    );

    // Calculate market comparison
    const averageRoi = Number(parseFloat(String(roiData?.average_roi || 0)).toFixed(2));
    const marketDifference = averageRoi - MARKET_AVERAGE_ROI;

    // Format geographic distribution with proper type casting - handle nulls
    const formattedGeoDistribution = geoDistribution && Array.isArray(geoDistribution) ? 
      geoDistribution.map(item => ({
        name: String(item.location || ''),
        value: Number(parseFloat(String(item.percentage || 0)).toFixed(2))
      })) : [];

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
      roiPerformance: roiPerformanceData,
      assetAllocation: typeAllocationData,
      geographicDistribution: formattedGeoDistribution,
      eventsAttended: Number(eventsData?.count || 0)
    };
    
    console.log("Formatted analytics data:", result);
    return result;
  } catch (error) {
    console.error("Error fetching analytics data:", error);
    throw error; // Let React Query handle this error
  }
}

// Re-export for backward compatibility
export { getPropertyTypeAllocation } from "./propertyAllocationService";
export type { AnalyticsData } from "./types";
