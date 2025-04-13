
// Chiavi di traduzione relative agli investitori
export const investorKeys = [
  "investorLevel",
  "nextLevel",
  "memberSince",
  "starter",
  "bronze",
  "silver",
  "gold",
  "ruby",
  "emerald",
  "platinum",
  "diamond",
  "investor",
  "selectInvestor",
  "noInvestorsAvailable",
  "addNewInvestor",
  "addInvestor",
  "investorAddedSuccessfully",
  "errorAddingInvestor",
  "requiredInvestorLevels",
  "selectInvestorLevelsEvent",
  "investorNetwork",
  "connectInvestors",
  "privateProfileNetworkRestricted",
  "privateProfileNetworkMessage",
  "noBioAvailable",
  "premiumRealEstate",
  "exceptionalReturns",
  "exclusiveAccess",
  "investorPortal",
  "investorPortalDesc",
  "privatePortalAlert"
] as const;

export type InvestorKey = typeof investorKeys[number];
