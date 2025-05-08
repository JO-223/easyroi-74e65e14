
import { Consultant, ExpertType } from "@/types/consultation";

// Mock data for consultants
const MOCK_CONSULTANTS: Record<ExpertType, Consultant[]> = {
  investment: [
    {
      id: "inv-1",
      name: "Marco Rossi",
      role: "Senior Investment Advisor",
      description: "Specializzato in investimenti immobiliari commerciali con oltre 15 anni di esperienza nei mercati europei.",
      type: "investment",
      bookingUrl: "https://calendly.com/example/investment-consultation",
    },
    {
      id: "inv-2",
      name: "Laura Bianchi",
      role: "Real Estate Analyst",
      description: "Esperta in analisi di mercato e valutazione di opportunità di investimento nel settore residenziale di lusso.",
      type: "investment",
      bookingUrl: "https://calendly.com/example/investment-consultation",
    },
    {
      id: "inv-3",
      name: "Alessandro Verdi",
      role: "Portfolio Manager",
      description: "Gestisce portafogli immobiliari diversificati con focus su massimizzazione del ROI e strategie di exit.",
      type: "investment",
      bookingUrl: "https://calendly.com/example/investment-consultation",
    },
  ],
  legal: [
    {
      id: "leg-1",
      name: "Giulia Romano",
      role: "Avvocato Immobiliare",
      description: "Specializzata in contrattualistica immobiliare e due diligence per transazioni nazionali e internazionali.",
      type: "legal",
      bookingUrl: "https://calendly.com/example/legal-consultation",
    },
    {
      id: "leg-2",
      name: "Roberto Esposito",
      role: "Consulente Legale",
      description: "Esperto in normative urbanistiche e risoluzione di controversie immobiliari tra proprietari e locatari.",
      type: "legal",
      bookingUrl: "https://calendly.com/example/legal-consultation",
    },
  ],
  tax: [
    {
      id: "tax-1",
      name: "Francesca Marino",
      role: "Commercialista",
      description: "Consulente fiscale specializzata in ottimizzazione delle imposte per investitori immobiliari e society immobiliari.",
      type: "tax",
      bookingUrl: "https://calendly.com/example/tax-consultation",
    },
    {
      id: "tax-2",
      name: "Antonio Ferrari",
      role: "Tax Advisor",
      description: "Esperto in fiscalità internazionale e pianificazione fiscale per investimenti immobiliari cross-border.",
      type: "tax",
      bookingUrl: "https://calendly.com/example/tax-consultation",
    },
    {
      id: "tax-3",
      name: "Claudia Ricci",
      role: "Financial Planner",
      description: "Specializzata in pianificazione finanziaria e ottimizzazione fiscale per patrimoni immobiliari familiari.",
      type: "tax",
      bookingUrl: "https://calendly.com/example/tax-consultation",
    },
  ],
};

// In a real application, this would fetch from an API or database
export async function fetchConsultants(type: ExpertType): Promise<Consultant[]> {
  // Simulate API delay
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(MOCK_CONSULTANTS[type] || []);
    }, 800);
  });
}

// New function to fetch all consultants
export async function fetchAllConsultants(): Promise<Consultant[]> {
  // Simulate API delay
  return new Promise(resolve => {
    setTimeout(() => {
      const allConsultants = Object.values(MOCK_CONSULTANTS).flat();
      resolve(allConsultants);
    }, 800);
  });
}
