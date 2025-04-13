
// Chiavi di traduzione relative all'autenticazione
export const authKeys = [
  "loginSuccessTitle",
  "loginSuccessMsg",
  "investorPortal",
  "investorPortalDesc",
  "privatePortalAlert",
  "forgotPassword",
  "signingIn",
  "signIn",
  "needAssistance",
  "loginCta"
] as const;

export type AuthKey = typeof authKeys[number];
