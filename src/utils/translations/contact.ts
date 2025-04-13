
// Chiavi di traduzione relative alla pagina Contatti
export const contactKeys = [
  "contactDescription",
  "contactInfo",
  "visitUs",
  "emailUs",
  "callUs",
  "businessHours",
  "mondayToFriday",
  "sendMessage"
] as const;

export type ContactKey = typeof contactKeys[number];
