
// Chiavi di traduzione relative ai club deal
export const clubDealKeys = [
  "clubDeals",
  "exploreClubDealOpportunities",
  "clubDealStatus_fundraising",
  "clubDealStatus_purchased",
  "clubDealStatus_rented",
  "clubDealStatus_readyForSale",
  "clubDealDetails",
  "totalPrice",
  "minInvestment",
  "expectedAnnualRoi",
  "expectedTotalRoi",
  "currentValue",
  "rentalPeriodYears",
  "acquisitionDate",
  "fundraisingProgress",
  "investorsParticipating",
  "fundraisingDeadline",
  "documents",
  "businessPlans",
  "legalDocuments",
  "financialReports",
  "dealTimeline",
  "joinClubDeal",
  "downloadBusinessPlan",
  "contactDealManager",
  "dealManager",
  "noClubDealsFound",
  "tryDifferentFilters",
  "filterClubDeals",
  "investmentAmount",
  "enterAmount",
  "roiRange",
  "selectLocation"
] as const;

export type ClubDealKey = typeof clubDealKeys[number];
