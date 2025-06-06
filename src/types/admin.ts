
import { PropertyType } from "./property";

export interface Investor {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  level: string | null;
  is_active?: boolean;
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
  user_id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  location?: string;
  bio?: string;
  level?: string;
  avatar_url?: string;
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
  price_currency?: string;
  listing_status?: string;
  roiPercentage?: number | null;
  serviceCharges?: number | null;
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

// Add the missing InvestorRpcResponse interface
export interface InvestorRpcResponse {
  success: boolean;
  message: string;
  user_id?: string;
}

export interface PropertyRpcResponse {
  property_id?: string;
  success: boolean;
  message: string;
}

export interface RpcResponse {
  success: boolean;
  message: string;
  [key: string]: any;
}
