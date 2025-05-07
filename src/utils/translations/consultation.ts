
// Consultation related translation keys
export const consultationKeys = [
  "consultations",
  "consultationsDescription",
  "investmentExperts",
  "legalAssistance",
  "taxConsulting",
  "bookConsultation",
  "noConsultantsAvailable",
  "consultant",
  "bookNow",
  "availability",
  "expertise",
  "rating",
  "reviews",
  "contactInfo",
  "consultation",
  "consultationTypes"
] as const;

export type ConsultationKey = typeof consultationKeys[number];
