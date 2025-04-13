
// Chiavi di traduzione che non rientrano in altre categorie
export const miscKeys = [
  "home",
  "aboutUs",
  "login",
  "contact"
] as const;

export type MiscKey = typeof miscKeys[number];
