
import { supabase } from "@/integrations/supabase/client";
import { PortfolioSummaryData, PerformanceMetrics, PortfolioAllocation, InvestmentGrowth } from "@/types/portfolio";

export async function fetchPortfolioSummary(userId: string): Promise<PortfolioSummaryData> {
  try {
    const { data, error } = await supabase
      .rpc('get_portfolio_summary', { user_id_param: userId });
      
    if (error) throw error;
    
    if (!data) {
      throw new Error("No portfolio data found");
    }
    
    return {
      total_properties: data && typeof data.total_properties === 'number' ? data.total_properties : 0,
      total_investment: data && typeof data.total_investment === 'number' ? data.total_investment : 0,
      average_roi: data && typeof data.average_roi === 'number' ? data.average_roi : 0,
      portfolio_value: data && typeof data.portfolio_value === 'number' ? data.portfolio_value : 0,
      monthly_income: data && typeof data.monthly_income === 'number' ? data.monthly_income : 0,
      yearly_income: data && typeof data.yearly_income === 'number' ? data.yearly_income : 0,
      total_cities: data && typeof data.total_cities === 'number' ? data.total_cities : 0,
      total_countries: data && typeof data.total_countries === 'number' ? data.total_countries : 0,
      growth_percentage: data && typeof data.growth_percentage === 'number' ? data.growth_percentage : 0,
      yield_percentage: data && typeof data.yield_percentage === 'number' ? data.yield_percentage : 0
    };
  } catch (error) {
    console.error("Error fetching portfolio summary:", error);
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
    
    return (data || []).map(item => ({
      location: String(item.location || ''),
      percentage: Number(item.percentage || 0)
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
    
    return (data || []).map(item => ({
      month: String(item.month || ''),
      month_index: Number(item.month_index || 0),
      year: Number(item.year || new Date().getFullYear()),
      value: Number(item.value || 0)
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
    
    return {
      average_roi: data && typeof data.average_roi === 'number' ? data.average_roi : 0,
      capital_growth: data && typeof data.capital_growth === 'number' ? data.capital_growth : 0,
      rental_yield: data && typeof data.rental_yield === 'number' ? data.rental_yield : 0
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
      total_properties: summary && typeof summary.total_properties === 'number' ? summary.total_properties : 0,
      total_investment: summary && typeof summary.total_investment === 'number' ? summary.total_investment : 0,
      average_roi: summary && typeof summary.average_roi === 'number' ? summary.average_roi : 0,
      total_value: summary && typeof summary.portfolio_value === 'number' ? summary.portfolio_value : 0,
      portfolio_growth: summary && typeof summary.growth_percentage === 'number' ? summary.growth_percentage : 0,
      allocation,
      growth
    };
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    throw error;
  }
}
