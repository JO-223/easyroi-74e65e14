export type TranslationKey =
  | "dashboard"
  | "analytics"
  | "profile"
  | "logout"
  | "login"
  | "register"
  | "email"
  | "password"
  | "confirmPassword"
  | "firstName"
  | "lastName"
  | "address"
  | "city"
  | "country"
  | "postalCode"
  | "phone"
  | "saveChanges"
  | "cancel"
  | "totalInvestment"
  | "properties"
  | "roi"
  | "events"
  | "investmentGrowth"
  | "portfolioAllocation"
  | "property"
  | "value"
  | "status"
  | "location"
  | "minInvestment"
  | "expectedROI"
  | "contactUs"
  | "tbd"
  | "exploreCurrentProjectsInProgress"
  | "developmentProjects"
  | "filterProjects"
  | "constructionProgress"
  | "selectInvestorLevel"
  | "enterLocation"
  | "constructionStage"
  | "selectStage"
  | "clearAll"
  | "applyFilters"
  | "noProjectsFound"
  | "tryDifferentFilters"
  | "projectDetails"
  | "loading"
  | "projectNotFound"
  | "errorLoadingProject"
  | "back"
  | "projectMayHaveBeenRemoved"
  | "projectDescription"
  | "projectGallery"
  | "investmentDetails"
  | "projectDetails"
  | "expectedCompletion"
  | "totalUnits"
  | "availableUnits"
  | "completionPercentage"
  | "requestInformation"
  | "addDevelopmentProject"
  | "projectName"
  | "enterProjectName"
  | "description"
  | "enterProjectDescription"
  | "address"
  | "enterAddress"
  | "zone"
  | "enterZone"
  | "city"
  | "enterCity"
  | "country"
  | "enterCountry"
  | "progressPercentage"
  | "totalUnits"
  | "availableUnits"
  | "expectedCompletion"
  | "constructionStage"
  | "planning"
  | "foundation"
  | "framing"
  | "interior"
  | "finishing"
  | "completed"
  | "imageUrl"
  | "optionalField"
  | "processing"
  | "starterInvestor"
  | "bronzeInvestor"
  | "silverInvestor"
  | "goldInvestor"
  | "rubyInvestor"
  | "emeraldInvestor"
  | "platinumInvestor"
  | "diamondInvestor"
  | "minimumLevelRequired"
  | "developmentProjectAddedSuccessfully"
  | "errorAddingDevelopmentProject"
  | "errorFetchingProjects"
  | "pleaseTryAgainLater"
  | "investorLevel"
  | "nextLevel"
  | "memberSince"
  | "totalInvestment"
  | "properties"
  | "roi"
  | "events"
  | "starter"
  | "bronze"
  | "silver"
  | "gold"
  | "ruby"
  | "emerald"
  | "platinum"
  | "diamond";

export const isValidTranslationKey = (key: string): key is TranslationKey => {
  const validKeys: string[] = [
    "dashboard",
    "analytics",
    "profile",
    "logout",
    "login",
    "register",
    "email",
    "password",
    "confirmPassword",
    "firstName",
    "lastName",
    "address",
    "city",
    "country",
    "postalCode",
    "phone",
    "saveChanges",
    "cancel",
    "totalInvestment",
    "properties",
    "roi",
    "events",
    "investmentGrowth",
    "portfolioAllocation",
    "property",
    "value",
    "status",
    "location",
    "minInvestment",
    "expectedROI",
    "contactUs",
    "tbd",
    "exploreCurrentProjectsInProgress",
    "developmentProjects",
    "filterProjects",
    "constructionProgress",
    "selectInvestorLevel",
    "enterLocation",
    "constructionStage",
    "selectStage",
    "clearAll",
    "applyFilters",
    "noProjectsFound",
    "tryDifferentFilters",
    "projectDetails",
    "loading",
    "projectNotFound",
    "errorLoadingProject",
    "back",
    "projectMayHaveBeenRemoved",
    "projectDescription",
    "projectGallery",
    "investmentDetails",
    "projectDetails",
    "expectedCompletion",
    "totalUnits",
    "availableUnits",
    "completionPercentage",
    "requestInformation",
    "addDevelopmentProject",
    "projectName",
    "enterProjectName",
    "description",
    "enterProjectDescription",
    "address",
    "enterAddress",
    "zone",
    "enterZone",
    "city",
    "enterCity",
    "country",
    "enterCountry",
    "progressPercentage",
    "totalUnits",
    "availableUnits",
    "expectedCompletion",
    "constructionStage",
    "planning",
    "foundation",
    "framing",
    "interior",
    "finishing",
    "completed",
    "imageUrl",
    "optionalField",
    "processing",
    "starterInvestor",
    "bronzeInvestor",
    "silverInvestor",
    "goldInvestor",
    "rubyInvestor",
    "emeraldInvestor",
    "platinumInvestor",
    "diamondInvestor",
    "minimumLevelRequired",
    "developmentProjectAddedSuccessfully",
    "errorAddingDevelopmentProject",
    "errorFetchingProjects",
    "pleaseTryAgainLater",
    "investorLevel",
    "nextLevel",
    "memberSince",
    "totalInvestment",
    "properties",
    "roi",
    "events",
    "starter",
    "bronze",
    "silver",
    "gold",
    "ruby",
    "emerald",
    "platinum",
    "diamond",
  ];
  return validKeys.includes(key);
};
