
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
    
    // Type-cast data to Record<string, any> to avoid 'unknown' type errors
    const typedData = data as Record<string, any>;
    
    return {
      total_properties: typeof typedData.total_properties === 'number' ? typedData.total_properties : 0,
      total_investment: typeof typedData.total_investment === 'number' ? typedData.total_investment : 0,
      average_roi: typeof typedData.average_roi === 'number' ? typedData.average_roi : 0,
      portfolio_value: typeof typedData.portfolio_value === 'number' ? typedData.portfolio_value : 0,
      monthly_income: typeof typedData.monthly_income === 'number' ? typedData.monthly_income : 0,
      yearly_income: typeof typedData.yearly_income === 'number' ? typedData.yearly_income : 0,
      total_cities: typeof typedData.total_cities === 'number' ? typedData.total_cities : 0,
      total_countries: typeof typedData.total_countries === 'number' ? typedData.total_countries : 0,
      growth_percentage: typeof typedData.growth_percentage === 'number' ? typedData.growth_percentage : 0,
      yield_percentage: typeof typedData.yield_percentage === 'number' ? typedData.yield_percentage : 0
    };
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
    return data.map(item => {
      // Type-cast item to Record<string, any> to avoid 'unknown' type errors
      const typedItem = item as Record<string, any>;
      return {
        location: String(typedItem?.location || ''),
        percentage: Number(typedItem?.percentage || 0)
      };
    });
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
    return data.map(item => {
      // Type-cast item to Record<string, any> to avoid 'unknown' type errors
      const typedItem = item as Record<string, any>;
      return {
        month: String(typedItem?.month || ''),
        month_index: Number(typedItem?.month_index || 0),
        year: Number(typedItem?.year || new Date().getFullYear()),
        value: Number(typedItem?.value || 0)
      };
    });
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
    
    // Type-cast data to Record<string, any> to avoid 'unknown' type errors
    const typedData = data as Record<string, any>;
    
    return {
      average_roi: typeof typedData.average_roi === 'number' ? typedData.average_roi : 0,
      capital_growth: typeof typedData.capital_growth === 'number' ? typedData.capital_growth : 0,
      rental_yield: typeof typedData.rental_yield === 'number' ? typedData.rental_yield : 0
    };
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
