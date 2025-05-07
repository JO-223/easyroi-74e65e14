
// Keys for help center translations
export const helpKeys = [
  "faqCategories",
  "payments",
  "contracts",
  "maintenance",
  "investments",
  "taxes",
  "userAccounts",
  "searchPlaceholder",
  "noResultsFound",
  "popularTopics",
  "relatedArticles",
  "needMoreHelp",
  "contactSupport"
] as const;

export type HelpKey = typeof helpKeys[number];
