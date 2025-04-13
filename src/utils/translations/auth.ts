
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
  "login",
  "authInitError",
  "signOutError",
  "authRequired",
  "redirectingToLogin",
  "invalidCredentials",
  "demoLoginSuccess",
  "demoLoginError",
  "sessionExpired"
] as const;

export type AuthKey = typeof authKeys[number];
