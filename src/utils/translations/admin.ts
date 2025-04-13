
// Chiavi di traduzione relative all'amministrazione
export const adminKeys = [
  "adminPanel",
  "adminPanelSubtitle",
  "investors",
  "forSaleProperties",
  "operationSuccessful",
  "operationFailed",
  "accessDenied",
  "importPropertiesAdminOnly",
  "propertyForSaleAddedSuccessfully",
  "errorAddingPropertyForSale",
  "addPropertyForSale",
  "errorFetchingPropertyTypes",
  "propertyAddedSuccessfully",
  "errorAddingProperty",
  "dashboardDataUpdated",
  "errorUpdatingDashboard",
  "developmentProjects"
] as const;

export type AdminKey = typeof adminKeys[number];
