
export type InvestmentType = 'secondary' | 'offPlan' | 'clubDeal';

export interface Investment {
  id: string;
  name: string;
  location: string;
  type: InvestmentType;
  currentValue: number;
  purchaseDate: string;
  propertyId: string;
  
  // Club Deal specific properties
  percentageOwned?: number;
  investedCapital?: number;
  contractYears?: number;
  expectedYield?: number;
  actualYield?: number;
}
