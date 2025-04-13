
// Chiavi di traduzione relative alla pagina di contatto
export const contactKeys = [
  "contactDescription",
  "visitUs",
  "emailUs",
  "callUs",
  "businessHours",
  "mondayToFriday",
  "fullName",
  "fullNamePlaceholder",
  "emailPlaceholder",
  "subject",
  "subjectPlaceholder",
  "messagePlaceholder",
  "contactInfo",
  "contactUs"
] as const;

export type ContactKey = typeof contactKeys[number];
