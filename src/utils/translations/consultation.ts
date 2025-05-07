
// Keys for consultation-related translations
export const consultationKeys = [
  "consultations",
  "consultationsDescription",
  "investmentExperts",
  "legalAssistance",
  "taxConsulting",
  "bookConsultation",
  "noConsultantsAvailable",
] as const;

export type ConsultationKey = typeof consultationKeys[number];
