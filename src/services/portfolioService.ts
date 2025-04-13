
import { supabase } from '@/integrations/supabase/client';
import { PortfolioSummaryData, PortfolioAllocation, InvestmentGrowth } from '@/types/portfolio';

export const fetchPortfolioSummary = async (): Promise<PortfolioSummaryData> => {
  // Get current user
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }
  
  try {
    // Fetch investment data
    const { data: investment } = await supabase
      .from('user_investments')
      .select('total_investment, investment_change_percentage')
      .eq('user_id', user.id)
      .single();
    
    // Fetch ROI data
    const { data: roi } = await supabase
      .from('user_roi')
      .select('average_roi, roi_change')
      .eq('user_id', user.id)
      .single();
    
    // Fetch property count
    const { data: properties } = await supabase
      .from('user_properties')
      .select('count, change')
      .eq('user_id', user.id)
      .single();
    
    return {
      totalInvestment: investment?.total_investment || 0,
      portfolioROI: roi?.average_roi || 0,
      totalProperties: properties?.count || 0,
      investmentChange: investment?.investment_change_percentage || 0,
      roiChange: roi?.roi_change || 0,
      propertyChange: properties?.change || 0
    };
  } catch (error) {
    console.error('Error fetching portfolio summary:', error);
    throw error;
  }
};

export const fetchPortfolioAllocation = async (): Promise<PortfolioAllocation[]> => {
  // Get current user
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }
  
  try {
    const { data, error } = await supabase
      .from('user_portfolio_allocation')
      .select('location, percentage')
      .eq('user_id', user.id)
      .order('percentage', { ascending: false });
    
    if (error) {
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error('Error fetching portfolio allocation:', error);
    throw error;
  }
};

export const fetchInvestmentGrowth = async (): Promise<InvestmentGrowth[]> => {
  // Get current user
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }
  
  try {
    const { data, error } = await supabase
      .from('user_investment_growth')
      .select('month, month_index, year, value')
      .eq('user_id', user.id)
      .order('year')
      .order('month_index');
    
    if (error) {
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error('Error fetching investment growth:', error);
    throw error;
  }
};
