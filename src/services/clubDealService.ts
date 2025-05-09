
import { supabase } from "@/integrations/supabase/client";
import { ClubDeal } from "@/types/clubDeal";

// Mock data for demonstration purposes
const mockClubDeals: ClubDeal[] = [
  {
    id: "1",
    name: "Luxury Villa Marina",
    description: "Splendida villa di lusso con 5 camere da letto e piscina privata, situata in una delle zone più esclusive di Dubai. La proprietà offre una vista mozzafiato sul mare e accesso diretto alla spiaggia. Costruita nel 2020, la villa è in condizioni impeccabili e presenta finiture di alta qualità.",
    location: {
      address: "Palm Jumeirah, Villa 42",
      city: "Dubai",
      zone: "Palm Jumeirah",
      country: "Emirati Arabi Uniti"
    },
    status: "funding_in_progress",
    images: [
      {
        id: "img1",
        url: "/lovable-uploads/f030c164-2df3-4c76-bc3d-6c506d59a005.png",
        is_primary: true
      },
      {
        id: "img2",
        url: "/lovable-uploads/c6fb964a-ed49-478a-88c3-5d395e52f920.png"
      }
    ],
    totalPrice: 2500000,
    minInvestment: 50000,
    currentValue: 2500000,
    expectedRentalROI: 5.8,
    expectedTotalROI: 32,
    fundingTarget: 2500000,
    fundingCurrent: 1750000,
    fundingDeadline: "2023-12-31",
    investorsCount: 12,
    investorLevel: "silver",
    documents: [
      {
        id: "doc1",
        title: "Business Plan",
        description: "Piano di investimento dettagliato",
        url: "#",
        fileType: "pdf",
        uploadDate: "2023-05-15",
        isRestricted: true
      },
      {
        id: "doc2",
        title: "Documentazione Legale",
        description: "Contratti e accordi legali",
        url: "#",
        fileType: "pdf",
        uploadDate: "2023-05-20",
        isRestricted: true
      }
    ],
    timeline: [
      {
        id: "t1",
        title: "Inizio Raccolta Fondi",
        date: "2023-05-01",
        description: "Avvio della raccolta capitali per l'acquisto dell'immobile",
        completed: true,
        phase: "acquisition"
      },
      {
        id: "t2",
        title: "Chiusura Raccolta Fondi",
        date: "2023-12-31",
        description: "Data prevista per il raggiungimento dell'obiettivo di raccolta",
        completed: false,
        phase: "acquisition"
      },
      {
        id: "t3",
        title: "Acquisto Immobile",
        date: "2024-01-15",
        description: "Finalizzazione dell'acquisto dell'immobile",
        completed: false,
        phase: "acquisition"
      },
      {
        id: "t4",
        title: "Inizio Affitto",
        date: "2024-02-01",
        description: "Inizio del periodo di affitto",
        completed: false,
        phase: "rental"
      },
      {
        id: "t5",
        title: "Valutazione Vendita",
        date: "2027-02-01",
        description: "Valutazione dell'immobile per potenziale vendita",
        completed: false,
        phase: "exit"
      }
    ]
  },
  {
    id: "2",
    name: "Urban Apartment Complex",
    description: "Complesso residenziale moderno nel cuore di Milano con 20 appartamenti di lusso. Posizione ottimale vicino ai principali punti di interesse e trasporti pubblici. Edificio di recente costruzione con certificazione energetica A+.",
    location: {
      address: "Via Monte Napoleone 12",
      city: "Milano",
      zone: "Centro",
      country: "Italia"
    },
    status: "property_acquired",
    images: [
      {
        id: "img3",
        url: "/lovable-uploads/8f62e7e7-e2ac-4ee6-bfee-3019052700d0.png",
        is_primary: true
      },
      {
        id: "img4",
        url: "/lovable-uploads/9496436e-cc5e-4188-9411-1dea4b718fc3.png"
      }
    ],
    totalPrice: 4500000,
    minInvestment: 100000,
    currentValue: 4650000,
    expectedRentalROI: 4.5,
    expectedTotalROI: 28,
    fundingTarget: 4500000,
    fundingCurrent: 4500000,
    fundingDeadline: "2023-03-31",
    purchaseDate: "2023-04-15",
    rentalDuration: 36,
    investorsCount: 18,
    investorLevel: "gold",
    documents: [
      {
        id: "doc3",
        title: "Rapporto Mensile",
        description: "Rapporto sulle performance mensili",
        url: "#",
        fileType: "pdf",
        uploadDate: "2023-09-01",
        isRestricted: true
      }
    ],
    timeline: [
      {
        id: "t6",
        title: "Inizio Raccolta Fondi",
        date: "2022-11-01",
        description: "Avvio della raccolta capitali",
        completed: true,
        phase: "acquisition"
      },
      {
        id: "t7",
        title: "Chiusura Raccolta Fondi",
        date: "2023-03-31",
        description: "Raggiunto obiettivo di raccolta",
        completed: true,
        phase: "acquisition"
      },
      {
        id: "t8",
        title: "Acquisto Immobile",
        date: "2023-04-15",
        description: "Finalizzazione dell'acquisto dell'immobile",
        completed: true,
        phase: "acquisition"
      },
      {
        id: "t9",
        title: "Inizio Affitto",
        date: "2023-06-01",
        description: "Inizio del periodo di affitto",
        completed: true,
        phase: "rental"
      },
      {
        id: "t10",
        title: "Termine Affitto",
        date: "2026-06-01",
        description: "Fine prevista del periodo di affitto",
        completed: false,
        phase: "rental"
      },
      {
        id: "t11",
        title: "Vendita Immobile",
        date: "2026-09-01",
        description: "Vendita dell'immobile e distribuzione dei profitti",
        completed: false,
        phase: "exit"
      }
    ]
  }
];

export const fetchClubDeals = async (): Promise<ClubDeal[]> => {
  // In a real-world scenario, we would fetch this data from Supabase
  // For now, we'll return mock data
  
  // Example of how the Supabase fetch would look:
  // const { data, error } = await supabase
  //   .from('club_deals')
  //   .select(`
  //     *,
  //     location:location_id(*),
  //     images:club_deal_images(*)
  //   `)
  //   .order('created_at', { ascending: false });
  
  // if (error) {
  //   console.error('Error fetching club deals:', error);
  //   throw error;
  // }
  
  // return data;
  
  return mockClubDeals;
};

export const fetchClubDeal = async (id: string): Promise<ClubDeal> => {
  // In a real-world scenario, we would fetch this data from Supabase
  // For now, we'll return mock data
  
  const deal = mockClubDeals.find(deal => deal.id === id);
  
  if (!deal) {
    throw new Error(`Club deal with ID ${id} not found`);
  }
  
  return deal;
};
