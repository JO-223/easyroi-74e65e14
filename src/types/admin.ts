
import { PropertyType } from "./property";

export interface Investor {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  level: string | null;
}

export interface AdminProperty {
  id: string;
  name: string;
}

export interface AdminDevelopmentProject {
  id: string;
  name: string;
}

export interface NewInvestorData {
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  location?: string;
  bio?: string;
  level?: string;
  avatar_url?: string;
  password: string;
  initialInvestment?: number;
}

export interface NewPropertyData {
  name: string;
  address: string;
  city: string;
  country: string;
  zone: string;
  typeId: string;
  price: number;
  sizeSqm: number;
  bedrooms: number;
  bathrooms: number;
  occupationStatus: string;
  status: string;
  roiPercentage?: number;
  serviceCharges?: number;
}

export interface NewForSalePropertyData {
  name: string;
  address: string;
  city: string;
  country: string;
  zone: string;
  typeId: string;
  price: number;
  sizeSqm: number;
  bedrooms: number;
  bathrooms: number;
  minInvestment?: number;
  roiPercentage?: number;
  investorLevel?: string;
}

export interface NewDevelopmentProjectData {
  name: string;
  description: string;
  address: string;
  city: string;
  country: string;
  zone: string;
  expectedCompletion: string;
  constructionStage: string;
  progressPercentage: number;
  totalUnits: number;
  availableUnits: number;
  minInvestment?: number;
  expectedRoi?: number;
  investorLevel: string;
  imageUrl?: string;
}

export interface NewEventData {
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  eventType: string;
  maxAttendees?: number;
  propertyId?: string;
  projectId?: string;
  imageUrl?: string;
  isOnline: boolean;
  requiredBadges?: string[];
}
