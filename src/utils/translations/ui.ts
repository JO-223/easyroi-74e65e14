
// Chiavi di traduzione relative all'UI
export const uiKeys = [
  "tooltip",
  "tooltip.propertyName",
  "tooltip.address",
  "tooltip.city",
  "tooltip.country",
  "tooltip.zone",
  "tooltip.price",
  "tooltip.currency",
  "tooltip.propertyType",
  "tooltip.sizeSqm",
  "tooltip.bedrooms",
  "tooltip.bathrooms",
  "tooltip.occupationStatus",
  "tooltip.status",
  "tooltip.listingStatus",
  "tooltip.roiPercentage",
  "tooltip.serviceCharges",
  "firstNameTooltip",
  "enterFirstName",
  "lastNameTooltip",
  "enterLastName",
  "emailTooltip",
  "passwordTooltip",
  "enterPassword",
  "percentageExample",
  "serviceChargesDescription",
  "footerDescription",
  "quickLinks",
  "about",
  "contact"
] as const;

export type UiKey = typeof uiKeys[number];
