
export const tooltipKeys = [
  'propertyNameTooltip',
  'addressTooltip',
  'cityTooltip',
  'zoneTooltip',
  'countryTooltip',
  'priceTooltip',
  'currencyTooltip',
  'propertyTypeTooltip',
  'sizeSqmTooltip',
  'bedroomsTooltip',
  'bathroomsTooltip',
  'occupationStatusTooltip',
  'statusTooltip',
  'listingStatusTooltip',
  'roiPercentageTooltip',
  'serviceChargesTooltip'
] as const;

export type TooltipKey = typeof tooltipKeys[number];
