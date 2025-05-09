
import { supabase } from "@/integrations/supabase/client";
import { ClubDeal } from "@/types/clubDeal";

// Mock data for demonstration purposes
const mockClubDeals: ClubDeal[] = [
  {
    id: "1",
    name: "Tempio Degli Dei",
    description: "Splendida proprietà con 32 camere da letto e 32 bagni, situata in una delle zone più esclusive di Roma. La proprietà è immersa nel verde e vicina al Vaticano. La villa è in condizioni impeccabili e presenta finiture di alta qualità.",
    location: {
      address: "Via San Pancrazio, 17",
      city: "Roma",
      zone: "Villa Pamphili",
      country: "Italia"
    },
    status: "funding_in_progress",
    images: [
      {
        id: "img1",
        url: "https://gqsetnzdaocxmutrbisp.supabase.co/storage/v1/object/public/property-images/Tempio%20degli%20dei%20property/tempio%20palazzo.jpg",
        is_primary: true
      },
      {
        id: "img2",
        url: "https://gqsetnzdaocxmutrbisp.supabase.co/storage/v1/object/public/property-images/Tempio%20degli%20dei%20property/tempio%202.jpg"
      }
    ],
    totalPrice: 1150000,
    minInvestment: 50000,
    currentValue: 1150000,
    expectedRentalROI: 18.85,
    expectedTotalROI: 32,
    fundingTarget: 1150000,
    fundingCurrent: 900000,
    fundingDeadline: "2025-05-15",
    investorsCount: 7,
    investorLevel: "starter",
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
        date: "2025-05-01",
        description: "Avvio della raccolta capitali per l'acquisto dell'immobile",
        completed: true,
        phase: "acquisition"
      },
      {
        id: "t2",
        title: "Chiusura Raccolta Fondi",
        date: "2025-05-01",
        description: "Data prevista per il raggiungimento dell'obiettivo di raccolta",
        completed: false,
        phase: "acquisition"
      },
      {
        id: "t3",
        title: "Acquisto Immobile",
        date: "2025-05-01",
        description: "Finalizzazione dell'acquisto dell'immobile",
        completed: false,
        phase: "acquisition"
      },
      {
        id: "t4",
        title: "Inizio Affitto",
        date: "2025-05-01",
        description: "Inizio del periodo di affitto",
        completed: false,
        phase: "rental"
      },
      {
        id: "t5",
        title: "Valutazione Vendita",
        date: "2025-05-01",
        description: "Valutazione dell'immobile per potenziale vendita",
        completed: false,
        phase: "exit"
      }
    ],
    propertyTypeId: "d7a92651-0c7e-4432-9ea0-90f16f2a6038" // Added property type ID
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
    ],
    propertyTypeId: "some-other-id" // Different property type ID
  }
];

export const fetchClubDeals = async (): Promise<ClubDeal[]> => {
  // In a real-world scenario with Supabase, we would use:
  // const { data, error } = await supabase
  //   .from('properties')
  //   .select(`
  //     *,
  //     location:location_id(*),
  //     images:property_images(*)
  //   `)
  //   .eq('type_id', 'd7a92651-0c7e-4432-9ea0-90f16f2a6038') // Filter by specific type ID
  //   .order('created_at', { ascending: false });
  
  // For now, we'll filter our mock data
  return mockClubDeals.filter(deal => deal.propertyTypeId === 'd7a92651-0c7e-4432-9ea0-90f16f2a6038');
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
