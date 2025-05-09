
import { supabase } from "@/integrations/supabase/client";
import { ClubDeal } from "@/types/clubDeal";

// Temporary mock data generator until backend is implemented
const generateMockClubDeals = (): ClubDeal[] => {
  return [
    {
      id: "cd-001",
      name: "Milano Centro Luxury Apartments",
      description: "Un complesso di 5 appartamenti di lusso nel cuore di Milano, a pochi passi dal Duomo. Ristrutturazione completa di un palazzo storico con finiture di pregio.",
      location: {
        city: "Milano",
        country: "Italia",
        address: "Via Montenapoleone 8",
        zone: "Centro",
      },
      status: "fundraising",
      totalPrice: 3500000,
      minInvestment: 100000,
      expectedAnnualRoi: 5.8,
      expectedTotalRoi: 42,
      currentValue: 3500000,
      rentalPeriodYears: 7,
      fundraising: {
        goal: 3500000,
        raised: 2450000,
        investors: 14,
        deadline: "2025-08-30",
      },
      documents: [
        {
          id: "doc-001",
          name: "Business Plan Milano Centro",
          type: "business_plan",
          url: "#",
          uploadDate: "2025-04-10",
          size: "2.4MB",
        },
        {
          id: "doc-002",
          name: "Documenti Legali",
          type: "legal",
          url: "#",
          uploadDate: "2025-04-12",
          size: "3.1MB",
        }
      ],
      timeline: [
        {
          id: "ev-001",
          date: "2025-03-15",
          title: "Apertura Club Deal",
          description: "Inizio della raccolta fondi per il progetto Milano Centro",
          type: "milestone"
        },
        {
          id: "ev-002",
          date: "2025-04-10",
          title: "Sopralluogo tecnico",
          description: "Completata l'ispezione tecnica dell'immobile",
          type: "update"
        },
        {
          id: "ev-003",
          date: "2025-08-30",
          title: "Chiusura raccolta fondi",
          description: "Termine previsto per il completamento della raccolta",
          type: "milestone"
        }
      ],
      images: [
        {
          id: "img-001",
          url: "/public/bayz soggiorno.jpg",
          is_primary: true
        },
        {
          id: "img-002",
          url: "/public/bayz camera.jpg",
          is_primary: false
        },
        {
          id: "img-003",
          url: "/public/bayz rooftop.jpg",
          is_primary: false
        }
      ],
      dealManager: {
        id: "dm-001",
        name: "Marco Rossi",
        email: "m.rossi@easyroi.com",
        phone: "+39 333 1234567"
      }
    },
    {
      id: "cd-002",
      name: "Roma Historical Residence",
      description: "Prestigioso palazzo del XVIII secolo situato nel centro storico di Roma, suddiviso in 8 unità abitative di alto livello per affitti turistici di lusso.",
      location: {
        city: "Roma",
        country: "Italia",
        zone: "Centro Storico",
      },
      status: "purchased",
      totalPrice: 5200000,
      minInvestment: 150000,
      expectedAnnualRoi: 6.2,
      expectedTotalRoi: 38,
      currentValue: 5400000,
      rentalPeriodYears: 5,
      acquisitionDate: "2025-02-15",
      fundraising: {
        goal: 5200000,
        raised: 5200000,
        investors: 18,
        deadline: "2025-01-30",
      },
      documents: [
        {
          id: "doc-003",
          name: "Report Finanziario Q1",
          type: "financial",
          url: "#",
          uploadDate: "2025-04-15",
          size: "1.8MB",
        }
      ],
      timeline: [
        {
          id: "ev-004",
          date: "2024-11-10",
          title: "Apertura Club Deal",
          description: "Inizio della raccolta fondi per il progetto Roma Historical",
          type: "milestone"
        },
        {
          id: "ev-005",
          date: "2025-01-30",
          title: "Completamento raccolta fondi",
          description: "Raggiunto l'obiettivo di 5.2M€",
          type: "milestone"
        },
        {
          id: "ev-006",
          date: "2025-02-15",
          title: "Acquisizione immobile",
          description: "Finalizzato l'acquisto del palazzo storico",
          type: "milestone"
        },
        {
          id: "ev-007",
          date: "2025-03-20",
          title: "Inizio ristrutturazione",
          description: "Avviati i lavori di ristrutturazione",
          type: "update"
        }
      ],
      images: [
        {
          id: "img-004",
          url: "/public/rove facciata.jpg",
          is_primary: true
        },
        {
          id: "img-005",
          url: "/public/rove lobby.jpg",
          is_primary: false
        }
      ],
      dealManager: {
        id: "dm-002",
        name: "Giulia Bianchi",
        email: "g.bianchi@easyroi.com",
        phone: "+39 333 7654321"
      }
    },
    {
      id: "cd-003",
      name: "Barcelona Seaside Complex",
      description: "Complesso residenziale fronte mare nella zona esclusiva di Barceloneta, con 12 appartamenti di lusso e vista panoramica sul Mediterraneo.",
      location: {
        city: "Barcelona",
        country: "Spagna",
        zone: "Barceloneta",
      },
      status: "rented",
      totalPrice: 6800000,
      minInvestment: 200000,
      expectedAnnualRoi: 7.5,
      expectedTotalRoi: 45,
      currentValue: 7400000,
      rentalPeriodYears: 6,
      acquisitionDate: "2024-09-10",
      fundraising: {
        goal: 6800000,
        raised: 6800000,
        investors: 22,
        deadline: "2024-08-15",
      },
      documents: [
        {
          id: "doc-004",
          name: "Rendiconto Affitti Q1-2025",
          type: "financial",
          url: "#",
          uploadDate: "2025-04-05",
          size: "3.2MB",
        }
      ],
      timeline: [
        {
          id: "ev-008",
          date: "2024-06-01",
          title: "Apertura Club Deal",
          description: "Inizio della raccolta fondi per il progetto Barcelona Seaside",
          type: "milestone"
        },
        {
          id: "ev-009",
          date: "2024-08-15",
          title: "Completamento raccolta fondi",
          description: "Raggiunto l'obiettivo di 6.8M€",
          type: "milestone"
        },
        {
          id: "ev-010",
          date: "2024-09-10",
          title: "Acquisizione immobile",
          description: "Finalizzato l'acquisto del complesso residenziale",
          type: "milestone"
        },
        {
          id: "ev-011",
          date: "2024-11-20",
          title: "Inizio locazioni",
          description: "Primi appartamenti affittati a clienti di lusso",
          type: "update"
        },
        {
          id: "ev-012",
          date: "2025-03-15",
          title: "Prima distribuzione dividendi",
          description: "Distribuito il primo dividendo agli investitori",
          type: "financial"
        }
      ],
      images: [
        {
          id: "img-007",
          url: "/public/bayz vista alto.jpg",
          is_primary: true
        },
        {
          id: "img-008",
          url: "/public/bayz piscina.jpg",
          is_primary: false
        }
      ],
      dealManager: {
        id: "dm-003",
        name: "Carlos Rodriguez",
        email: "c.rodriguez@easyroi.com",
        phone: "+34 612 345 678"
      }
    }
  ];
};

export const fetchClubDeals = async (): Promise<ClubDeal[]> => {
  try {
    // In the future, replace this with actual API call to Supabase
    // const { data, error } = await supabase.from('club_deals').select('*...')
    
    // For now, return mock data
    return generateMockClubDeals();
  } catch (error) {
    console.error('Error fetching club deals:', error);
    throw error;
  }
};

export const fetchClubDeal = async (id: string): Promise<ClubDeal> => {
  try {
    // In the future, replace with actual API call
    // const { data, error } = await supabase.from('club_deals').select('*...').eq('id', id).single()
    
    // For now, find in mock data
    const deals = generateMockClubDeals();
    const deal = deals.find(d => d.id === id);
    
    if (!deal) {
      throw new Error(`Club deal with id ${id} not found`);
    }
    
    return deal;
  } catch (error) {
    console.error(`Error fetching club deal with id ${id}:`, error);
    throw error;
  }
};
