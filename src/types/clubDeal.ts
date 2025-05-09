
export type ClubDealStatus = 
  'funding_in_progress' | 
  'property_acquired' | 
  'in_rental' | 
  'ready_for_sale' | 
  'completed';

export interface ClubDealImage {
  id: string;
  url: string;
  is_primary?: boolean;
}

export interface ClubDealLocation {
  address: string;
  city: string;
  zone: string;
  country: string;
}

export interface ClubDealTimelineEvent {
  id: string;
  title: string;
  date: string;
  description: string;
  completed: boolean;
  phase: 'acquisition' | 'rental' | 'exit';
}

export interface ClubDealDocument {
  id: string;
  title: string;
  description?: string;
  url: string;
  fileType: string;
  uploadDate: string;
  isRestricted: boolean;
}

export interface ClubDeal {
  id: string;
  name: string;
  description: string;
  location: ClubDealLocation;
  status: ClubDealStatus;
  images: ClubDealImage[];
  totalPrice: number;
  minInvestment: number;
  currentValue: number;
  expectedRentalROI: number;
  expectedTotalROI: number;
  fundingTarget: number;
  fundingCurrent: number;
  fundingDeadline: string;
  investorsCount: number;
  investorLevel: "bronze" | "silver" | "gold" | "platinum" | "diamond";
  rentalDuration?: number;
  purchaseDate?: string;
  documents: ClubDealDocument[];
  timeline: ClubDealTimelineEvent[];
  propertyTypeId?: string;
  type: {
    id: string;
    name: string;
  };
  totalShares: number;
  availableShares: number;
  projectCompletion: number;
  estimatedCompletion: string;
  amenities: {
    id: string;
    name: string;
    icon: string;
  }[];
}
