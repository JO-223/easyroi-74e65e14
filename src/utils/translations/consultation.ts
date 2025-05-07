
// Consultation related translation keys
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
