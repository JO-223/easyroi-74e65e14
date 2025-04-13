
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
  'serviceChargesTooltip',
  'investorTooltip',
  // Tooltip keys as nested structure
  'tooltip',
  'propertyName',
  'address',
  'city',
  'zone',
  'country',
  'price',
  'currency',
  'propertyType',
  'sizeSqm',
  'bedrooms',
  'bathrooms',
  'occupationStatus',
  'status',
  'listingStatus',
  'roiPercentage',
  'serviceCharges',
  'investor'
] as const;

export type TooltipKey = typeof tooltipKeys[number];

// Add nested tooltips structure
export type TooltipKeys = {
  propertyName: string;
  address: string;
  city: string;
  zone: string;
  country: string;
  price: string;
  currency: string;
  propertyType: string;
  sizeSqm: string;
  bedrooms: string;
  bathrooms: string;
  occupationStatus: string;
  status: string;
  listingStatus: string;
  roiPercentage: string;
  serviceCharges: string;
  investor: string;
};
