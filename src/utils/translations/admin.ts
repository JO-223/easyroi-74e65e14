
// Admin-related translation keys
export const adminKeys = [
  // Original admin keys
  "adminDashboard",
  "userManagement",
  "propertyManagement",
  "addNewInvestor",
  "addNewProperty",
  "addPropertyForSale",
  "addDevelopmentProject",
  "addEvent",
  "resetDemoAccount",
  "confirmReset",
  "demoAccountReset",
  "errorResettingDemoAccount",
  
  // Admin dashboard keys
  "adminPanel",
  "adminPanelSubtitle",
  "investors",
  "properties",
  "forSaleProperties",
  "developmentProjects",
  "events",
  "demoAccount",
  
  // Property form keys
  "addPropertyForUser",
  "propertyAddedSuccessfully",
  "errorAddingProperty",
  "errorFetchingFormData",
  
  // For sale property form keys
  "propertyForSaleAddedSuccessfully",
  "errorAddingPropertyForSale",
  "errorFetchingPropertyTypes",
  
  // Demo account keys
  "demoAccountManagement",
  "demoAccountDescription",
  "checking",
  "notConfigured",
  "accountType",
  "note",
  "demoAccountNote",
  "lastReset",
  "resetting",
  "resettingDemoAccount",
  
  // Investor form keys
  "firstName",
  "lastName",
  "email",
  "password",
  "firstNameTooltip",
  "lastNameTooltip",
  "emailTooltip",
  "passwordTooltip",
  "enterFirstName",
  "enterLastName",
  "enterPassword",
  "validation_error",
  "addInvestor",
  "investorAddedSuccessfully",
  "errorAddingInvestor",
  
  // Property fields keys
  "percentageExample",
  "serviceChargesDescription",
  
  // Additional property keys
  "selectProperty",
  
  // Project keys
  "expectedRoi"
] as const;

export type AdminKey = typeof adminKeys[number];
