
// Chiavi di traduzione relative alla parte di analytics
export const analyticsKeys = [
  "comprehensiveAnalysis",
  "unableToLoadData",
  "pleaseTryRefreshingThePage",
  "portfolio",
  "allocation",
  "singleLocationAllocation",
  "portfolioROI",
  "noHistoricalData",
  "vsPreviousYear",
  "annualGrowth",
  "marketComparison",
  "aboveIndex",
  "marketVolatility",
  "vsMarketAverage",
  "assetAllocation",
  "noAssetAllocationData",
  "geographicDistribution",
  "noGeographicData",
  "yourPortfolio",
  "marketAverage",
  "roiPerformance",
  "noInvestmentDataAvailable"
] as const;

export type AnalyticsKey = typeof analyticsKeys[number];
