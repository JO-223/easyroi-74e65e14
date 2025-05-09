
// Chiavi di traduzione relative alla dashboard
export const dashboardKeys = [
  "totalInvestment",
  "yourPerformance",
  "yourProperties",
  "portfolio",
  "investmentsOverview",
  "recentTransactions",
  "upcomingEvents", 
  "marketNews",
  "totalValue",
  "totalROI",
  "investmentPeriod",
  "transactions",
  "eventsAttended",
  "portfolioAllocation",
  "investmentGrowth",
  "propertyValue",
  "recentActivity",
  "allocation",
  "progress",
  "expectedCompletion",
  "totalUnits",
  "availableUnits",
  "dashboardDataUpdated",
  "errorUpdatingDashboard",
  "noData",
  "refreshOrContactSupport",
  "nextLevel",
  'currentEvaluation',
  "eventsInLastYear"
] as const;

export type DashboardKey = typeof dashboardKeys[number];
