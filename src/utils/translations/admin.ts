
// Admin-related translation keys
export const adminKeys = [
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
  "errorResettingDemoAccount"
] as const;

export type AdminKey = typeof adminKeys[number];
