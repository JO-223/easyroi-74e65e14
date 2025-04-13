
// Chiavi di traduzione relative alle pagine di landing
export const landingKeys = [
  "scheduleMeeting",
  "scroll",
  "curated",
  "curatedDesc",
  "premiumProperties",
  "premiumPropertiesDesc",
  "portfolioAnalytics",
  "portfolioAnalyticsDesc",
  "securePlatform",
  "securePlatformDesc",
  "featuredLocations",
  "readyToMaximize",
  "premiumRealEstate",
  "exceptionalReturns",
  "exclusiveAccess"
] as const;

export type LandingKey = typeof landingKeys[number];
