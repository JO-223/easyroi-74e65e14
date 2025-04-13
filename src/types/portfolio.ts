
export interface Portfolio {
  total_properties: number;
  total_investment: number;
  average_roi: number;
  total_value: number;
  portfolio_growth: number;
  allocation: PortfolioAllocation[];
  performance_data: PerformanceData[];
  investment_growth: InvestmentGrowth[];
}

export interface PortfolioAllocation {
  location: string;
  percentage: number;
}

export interface PerformanceData {
  name: string;
  value: number;
}

export interface InvestmentGrowth {
  month: string;
  month_index: number;
  year: number;
  value: number;
}

export interface PortfolioSummaryData {
  total_properties: number;
  total_investment: number;
  average_roi: number;
  portfolio_value: number;
  monthly_income: number;
  yearly_income: number;
  total_cities: number;
  total_countries: number;
  growth_percentage: number;
  yield_percentage: number;
}

export interface PerformanceMetrics {
  average_roi: number;
  capital_growth: number;
  rental_yield: number;
}
