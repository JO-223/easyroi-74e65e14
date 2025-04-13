
// Chiavi di traduzione relative al profilo
export const profileKeys = [
  "myProfile",
  "viewEditProfile",
  "profileDetails",
  "accountInfo",
  "investorLevel",
  "investorSince",
  "portfolioOverview",
  "badges",
  "statistics",
  "notifications",
  "settings"
] as const;

export type ProfileKey = typeof profileKeys[number];
