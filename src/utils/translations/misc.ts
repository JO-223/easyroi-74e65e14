
// Chiavi di traduzione miscellanee e di errore
export const miscKeys = [
  "error",
  "errorLoadingData",
  "errorFetchingFormData",
  "errorFetchingPropertyTypes",
  "errorFetchingRelatedData",
  "errorAddingEvent",
  "eventAddedSuccessfully",
  "optionalField",
  "minimumLevelRequired",
  "starterInvestor",
  "bronzeInvestor",
  "silverInvestor",
  "goldInvestor",
  "rubyInvestor",
  "emeraldInvestor",
  "platinumInvestor",
  "diamondInvestor",
  "validation_error",
  "success",
  "processing",
  "noData",
  "refreshOrContactSupport",
  "edit"
] as const;

export type MiscKey = typeof miscKeys[number];
