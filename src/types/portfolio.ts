
export interface PortfolioSummaryData {
  totalInvestment: number;
  portfolioROI: number;
  totalProperties: number;
  investmentChange: number;
  roiChange: number;
  propertyChange: number;
}

export interface PortfolioAllocation {
  location: string;
  percentage: number;
}

export interface InvestmentGrowth {
  month: string;
  month_index: number;
  year: number;
  value: number;
}
