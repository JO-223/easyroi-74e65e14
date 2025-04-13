
import { supabase } from "@/integrations/supabase/client";
import { PortfolioSummaryData, PortfolioAllocation, InvestmentGrowth } from "@/types/portfolio";

// Define the PerformanceMetrics type directly here since it's missing from the portfolio types
export interface PerformanceMetrics {
  average_roi: number;
  capital_growth: number;
  rental_yield: number;
}

export async function fetchPortfolioSummary(userId: string): Promise<PortfolioSummaryData> {
  try {
    const { data, error } = await supabase
      .rpc('get_portfolio_summary', { user_id_param: userId });
      
    if (error) throw error;
    
    if (!data) {
      throw new Error("No portfolio data found");
    }
    
    // Create typed object with safe type checking and default values
    const typedData: PortfolioSummaryData = {
      total_properties: typeof data.total_properties === 'number' ? data.total_properties : 0,
      total_investment: typeof data.total_investment === 'number' ? data.total_investment : 0,
      average_roi: typeof data.average_roi === 'number' ? data.average_roi : 0,
      portfolio_value: typeof data.portfolio_value === 'number' ? data.portfolio_value : 0,
      monthly_income: typeof data.monthly_income === 'number' ? data.monthly_income : 0,
      yearly_income: typeof data.yearly_income === 'number' ? data.yearly_income : 0,
      total_cities: typeof data.total_cities === 'number' ? data.total_cities : 0,
      total_countries: typeof data.total_countries === 'number' ? data.total_countries : 0,
      growth_percentage: typeof data.growth_percentage === 'number' ? data.growth_percentage : 0,
      yield_percentage: typeof data.yield_percentage === 'number' ? data.yield_percentage : 0
    };
    
    return typedData;
  } catch (error) {
    console.error("Error fetching portfolio summary:", error);
    // Return default values on error
    return {
      total_properties: 0,
      total_investment: 0,
      average_roi: 0,
      portfolio_value: 0,
      monthly_income: 0,
      yearly_income: 0,
      total_cities: 0,
      total_countries: 0,
      growth_percentage: 0,
      yield_percentage: 0
    };
  }
}

export async function fetchPortfolioAllocation(userId: string): Promise<PortfolioAllocation[]> {
  try {
    const { data, error } = await supabase
      .rpc('get_portfolio_allocation', { user_id_param: userId });
      
    if (error) throw error;
    
    if (!data || !Array.isArray(data)) {
      return [];
    }
    
    // Safely map data with type checking
    return data.map(item => ({
      location: String(item?.location || ''),
      percentage: Number(item?.percentage || 0)
    }));
  } catch (error) {
    console.error("Error fetching portfolio allocation:", error);
    return [];
  }
}

export async function fetchInvestmentGrowth(userId: string): Promise<InvestmentGrowth[]> {
  try {
    const { data, error } = await supabase
      .rpc('get_investment_growth', { user_id_param: userId });
      
    if (error) throw error;
    
    if (!data || !Array.isArray(data)) {
      return [];
    }
    
    // Safely map data with type checking
    return data.map(item => ({
      month: String(item?.month || ''),
      month_index: Number(item?.month_index || 0),
      year: Number(item?.year || new Date().getFullYear()),
      value: Number(item?.value || 0)
    }));
  } catch (error) {
    console.error("Error fetching investment growth:", error);
    return [];
  }
}

export async function fetchPerformanceMetrics(userId: string): Promise<PerformanceMetrics> {
  try {
    const { data, error } = await supabase
      .rpc('get_performance_metrics', { user_id_param: userId });
      
    if (error) throw error;
    
    if (!data) {
      throw new Error("No metrics data found");
    }
    
    // Create typed object with safe type checking
    const typedData: PerformanceMetrics = {
      average_roi: typeof data.average_roi === 'number' ? data.average_roi : 0,
      capital_growth: typeof data.capital_growth === 'number' ? data.capital_growth : 0,
      rental_yield: typeof data.rental_yield === 'number' ? data.rental_yield : 0
    };
    
    return typedData;
  } catch (error) {
    console.error("Error fetching performance metrics:", error);
    return {
      average_roi: 0,
      capital_growth: 0,
      rental_yield: 0
    };
  }
}

export async function fetchDashboardData(userId: string) {
  try {
    const summaryPromise = fetchPortfolioSummary(userId);
    const allocationPromise = fetchPortfolioAllocation(userId);
    const growthPromise = fetchInvestmentGrowth(userId);
    const metricsPromise = fetchPerformanceMetrics(userId);
    
    const [summary, allocation, growth, metrics] = await Promise.all([
      summaryPromise, allocationPromise, growthPromise, metricsPromise
    ]);
    
    return {
      total_properties: summary.total_properties,
      total_investment: summary.total_investment,
      average_roi: summary.average_roi,
      total_value: summary.portfolio_value,
      portfolio_growth: summary.growth_percentage,
      allocation,
      growth
    };
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    throw error;
  }
}
