
// Chiavi di traduzione relative ai Club Deal
export const clubDealKeys = [
  "clubDeal",
  "exploreClubDeals",
  "dealStatus",
  "fundingInProgress",
  "propertyAcquired",
  "inRental",
  "readyForSale",
  "completedDeal",
  "investorsParticipating",
  "fundingTarget",
  "fundingProgress",
  "fundingDeadline",
  "daysRemaining",
  "estimatedRentalROI",
  "estimatedTotalROI",
  "estimatedRentalDuration",
  "joinClubDeal",
  "downloadBusinessPlan",
  "contactDealManager",
  "dealDocuments",
  "dealTimeline",
  "acquisitionPhase",
  "rentalPhase",
  "exitPhase",
  "currentPropertyValue",
  "totalPrice",
  "purchaseDate",
  "login",
  "please",
  "toViewDocuments",
  "filterByPropertyType"
] as const;

export type ClubDealKey = typeof clubDealKeys[number];
