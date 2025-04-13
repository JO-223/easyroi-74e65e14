
import { supabase } from "@/integrations/supabase/client";
import { PortfolioSummaryData, PortfolioAllocation, InvestmentGrowth } from "@/types/portfolio";

export async function fetchPortfolioSummary(userId: string): Promise<PortfolioSummaryData> {
  const { data, error } = await supabase
    .from("portfolio_summary")
    .select("*")
    .eq("user_id", userId)
    .single();
  
  if (error) {
    console.error("Error fetching portfolio summary:", error);
    throw new Error(error.message);
  }
  
  // Return typed data with explicit type conversion
  return {
    totalInvestment: Number(data.total_investment),
    portfolioROI: Number(data.portfolio_roi),
    totalProperties: Number(data.total_properties),
    investmentChange: Number(data.investment_change),
    roiChange: Number(data.roi_change),
    propertyChange: Number(data.property_change)
  };
}

export async function fetchPortfolioAllocation(userId: string): Promise<PortfolioAllocation[]> {
  const { data, error } = await supabase
    .from("portfolio_allocation")
    .select("location, percentage")
    .eq("user_id", userId)
    .order("percentage", { ascending: false });
  
  if (error) {
    console.error("Error fetching portfolio allocation:", error);
    throw new Error(error.message);
  }
  
  // Return typed data with explicit type conversion
  return data.map(item => ({
    location: String(item.location),
    percentage: Number(item.percentage)
  }));
}

export async function fetchInvestmentGrowth(userId: string): Promise<InvestmentGrowth[]> {
  const { data, error } = await supabase
    .from("investment_growth")
    .select("month, month_index, year, value")
    .eq("user_id", userId)
    .order("year")
    .order("month_index");
  
  if (error) {
    console.error("Error fetching investment growth:", error);
    throw new Error(error.message);
  }
  
  // Return typed data with explicit type conversion
  return data.map(item => ({
    month: String(item.month),
    month_index: Number(item.month_index),
    year: Number(item.year),
    value: Number(item.value)
  }));
}
