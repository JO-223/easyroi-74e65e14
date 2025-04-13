
export interface AnalyticsData {
  totalUsers: number;
  totalProperties: number;
  averageInvestmentPerUser: number;
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
