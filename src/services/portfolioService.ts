
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

    // Type assertion for safety
    return {
      total_properties: Number(data?.total_properties) || 0,
      total_investment: Number(data?.total_investment) || 0,
      average_roi: Number(data?.average_roi) || 0
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

    // Map performance metrics to the expected format
    const performanceMetrics: PerformanceData[] = [
      { name: 'ROI', value: Number(performanceData?.average_roi) || 0 },
      { name: 'Capital Growth', value: Number(performanceData?.capital_growth) || 0 },
      { name: 'Rental Yield', value: Number(performanceData?.rental_yield) || 0 }
    ];

    // Construct the portfolio object
    const portfolio: Portfolio = {
      total_properties: Number(summaryData?.total_properties) || 0,
      total_investment: Number(summaryData?.total_investment) || 0,
      average_roi: Number(summaryData?.average_roi) || 0,
      total_value: Number(summaryData?.total_value) || 0,
      portfolio_growth: Number(summaryData?.portfolio_growth) || 0,
      allocation: allocationData?.map(item => ({
        location: String(item.location),
        percentage: Number(item.percentage)
      })) || [],
      performance_data: performanceMetrics,
      investment_growth: growthData?.map(item => ({
        month: String(item.month),
        month_index: Number(item.month_index),
        year: Number(item.year),
        value: Number(item.value)
      })) || []
    };

    return portfolio;
  } catch (error) {
    console.error('Error fetching portfolio data:', error);
    throw error;
  }
}
