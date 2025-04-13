
export const eventKeys = [
  'eventDetail',
  'errorLoadingEventDescription',
  'date',
  'time',
  'eventsInLastYear',
  'portfolioPerformance',
  'monthlyReturns',
  'yearlyGrowth',
  'investmentByCountry',
  'yourInvestmentOverview',
  'lastUpdated',
  'fromLastMonth',
  'noEventsFound',
  'tryDifferentFilters',
  'unitsAvailable',
  'expectedRoi',
  'constructionProgress',
  'minInvestment',
  'viewDetails'
] as const;

export type EventKey = typeof eventKeys[number];
