
/**
 * Export all analytics services and types from a single entry point
 */

export { fetchAnalyticsData, getPropertyTypeAllocation } from "./analyticsService";
export type { AnalyticsData, PropertyTypeAllocation, MonthlyROIData, MonthlyGrowthData, MonthlyROIResult } from "./types";
export { MARKET_AVERAGE_ROI } from "./constants";

// Export individual services if needed elsewhere
export { fetchRoiData } from "./services/roiService";
export { fetchInvestmentData } from "./services/investmentService";
export { fetchMonthlyRoiData } from "./services/monthlyDataService";
export { fetchGeographicDistribution } from "./services/geoDistributionService";
export { fetchEventsAttendedData } from "./services/eventsService";
export { processRoiPerformanceData } from "./services/performanceDataService";
