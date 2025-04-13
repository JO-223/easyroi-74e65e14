
// Chiavi di traduzione relative agli elementi UI generici
export const uiKeys = [
  "loading",
  "errorLoadingData",
  "success",
  "error",
  "refresh"
] as const;

export type UiKey = typeof uiKeys[number];
