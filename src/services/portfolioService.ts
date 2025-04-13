
import { supabase } from "@/integrations/supabase/client";
import { Portfolio, PortfolioAllocation, InvestmentGrowth, PerformanceData, PortfolioSummaryData } from "@/types/portfolio";

export async function fetchPortfolioSummary(userId: string): Promise<PortfolioSummaryData> {
  try {
    const { data, error } = await supabase.rpc('get_user_portfolio_summary', {
      p_user_id: userId
    });

    if (error) {
      console.error('Error fetching portfolio summary:', error);
      throw error;
    }

    // Safe type conversion with fallbacks
    return {
      total_properties: data && typeof data.total_properties !== 'undefined' ? Number(data.total_properties) : 0,
      total_investment: data && typeof data.total_investment !== 'undefined' ? Number(data.total_investment) : 0,
      average_roi: data && typeof data.average_roi !== 'undefined' ? Number(data.average_roi) : 0
    };
  } catch (error) {
    console.error('Error fetching portfolio summary:', error);
    throw error;
  }
}

export async function fetchPortfolioData(userId: string): Promise<Portfolio> {
  try {
    // Get portfolio allocation
    const { data: allocationData, error: allocationError } = await supabase
      .from('user_portfolio_allocation')
      .select('location, percentage')
      .eq('user_id', userId);

    if (allocationError) {
      console.error('Error fetching portfolio allocation:', allocationError);
      throw allocationError;
    }

    // Get investment growth data
    const { data: growthData, error: growthError } = await supabase
      .from('user_investment_growth')
      .select('month, month_index, year, value')
      .eq('user_id', userId)
      .order('year', { ascending: true })
      .order('month_index', { ascending: true });

    if (growthError) {
      console.error('Error fetching investment growth:', growthError);
      throw growthError;
    }

    // Get performance metrics
    const { data: performanceData, error: performanceError } = await supabase.rpc('get_user_performance_metrics', {
      p_user_id: userId
    });

    if (performanceError) {
      console.error('Error fetching performance metrics:', performanceError);
      throw performanceError;
    }

    // Get portfolio summary
    const { data: summaryData, error: summaryError } = await supabase.rpc('get_user_portfolio_data', {
      p_user_id: userId
    });

    if (summaryError) {
      console.error('Error fetching portfolio data:', summaryError);
      throw summaryError;
    }

    // Map performance metrics to the expected format with safe type conversions
    const performanceMetrics: PerformanceData[] = [
      { name: 'ROI', value: performanceData && typeof performanceData.average_roi !== 'undefined' ? Number(performanceData.average_roi) : 0 },
      { name: 'Capital Growth', value: performanceData && typeof performanceData.capital_growth !== 'undefined' ? Number(performanceData.capital_growth) : 0 },
      { name: 'Rental Yield', value: performanceData && typeof performanceData.rental_yield !== 'undefined' ? Number(performanceData.rental_yield) : 0 }
    ];

    // Construct the portfolio object with safe type conversions
    const portfolio: Portfolio = {
      total_properties: summaryData && typeof summaryData.total_properties !== 'undefined' ? Number(summaryData.total_properties) : 0,
      total_investment: summaryData && typeof summaryData.total_investment !== 'undefined' ? Number(summaryData.total_investment) : 0,
      average_roi: summaryData && typeof summaryData.average_roi !== 'undefined' ? Number(summaryData.average_roi) : 0,
      total_value: summaryData && typeof summaryData.total_value !== 'undefined' ? Number(summaryData.total_value) : 0,
      portfolio_growth: summaryData && typeof summaryData.portfolio_growth !== 'undefined' ? Number(summaryData.portfolio_growth) : 0,
      allocation: (allocationData || []).map(item => ({
        location: String(item.location || ''),
        percentage: Number(item.percentage || 0)
      })),
      performance_data: performanceMetrics,
      investment_growth: (growthData || []).map(item => ({
        month: String(item.month || ''),
        month_index: Number(item.month_index || 0),
        year: Number(item.year || 0),
        value: Number(item.value || 0)
      }))
    };

    return portfolio;
  } catch (error) {
    console.error('Error fetching portfolio data:', error);
    throw error;
  }
}
