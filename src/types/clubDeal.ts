
export type ClubDealStatus = 
  | 'fundraising'   // Raccolta fondi in corso
  | 'purchased'     // Immobili acquistati
  | 'rented'        // In affitto
  | 'readyForSale'; // Pronto alla rivendita

export interface ClubDealDocument {
  id: string;
  name: string;
  type: 'business_plan' | 'legal' | 'financial' | 'other';
  url: string;
  uploadDate: string;
  size: string;
}

export interface ClubDealEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  type: 'milestone' | 'update' | 'financial';
}

export interface ClubDeal {
  id: string;
  name: string;
  description: string;
  location: {
    city: string;
    country: string;
    address?: string;
    zone?: string;
  };
  status: ClubDealStatus;
  totalPrice: number;
  minInvestment: number;
  expectedAnnualRoi: number;
  expectedTotalRoi: number;
  currentValue: number;
  rentalPeriodYears?: number;
  acquisitionDate?: string;
  fundraising: {
    goal: number;
    raised: number;
    investors: number;
    deadline: string;
  };
  documents: ClubDealDocument[];
  timeline: ClubDealEvent[];
  images: {
    id: string;
    url: string;
    is_primary: boolean;
  }[];
  dealManager: {
    id: string;
    name: string;
    email: string;
    phone?: string;
  };
}
