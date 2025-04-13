
// Chiavi di traduzione relative agli elementi UI generici
export const uiKeys = [
  "loading",
  "errorLoadingData",
  "success",
  "error"
] as const;

export type UiKey = typeof uiKeys[number];
