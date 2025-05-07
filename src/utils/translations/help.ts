
// Help center related translation keys
export const helpKeys = [
  "helpCenter",
  "helpCenterDescription",
  "searchHelp",
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
  "contactSupport",
  "help",
  "faq",
  "frequentQuestions",
  "moreInfo",
  "readMore"
] as const;

export type HelpKey = typeof helpKeys[number];
