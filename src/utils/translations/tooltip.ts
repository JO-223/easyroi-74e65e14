
// Translation keys for tooltips and other similar contextual help texts
export const tooltipKeys = [
  "tooltip.propertyName",
  "tooltip.address",
  "tooltip.city",
  "tooltip.zone",
  "tooltip.country",
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
  "tooltip.investor",
  "tooltip"
] as const;

export type TooltipKey = typeof tooltipKeys[number];
