
/**
 * Analytics data types and interfaces
 */

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

export interface PropertyTypeAllocation {
  name: string;
  value: number;
}

export interface MonthlyROIData {
  month: string;
  month_index: number;
  roi_value: number | string;
}

export interface MonthlyGrowthData {
  month: string;
  month_index: number;
  value: number | string;
}
