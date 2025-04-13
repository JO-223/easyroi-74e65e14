
import { supabase } from "@/integrations/supabase/client";
import { Portfolio, PortfolioSummaryData } from "@/types/portfolio";

export const fetchPortfolioSummary = async (): Promise<PortfolioSummaryData> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("No user found");

    const { data, error } = await supabase.rpc("get_user_portfolio_summary", {
      p_user_id: user.id,
    });

    if (error) {
      console.error("Error fetching portfolio summary:", error);
      throw new Error(error.message);
    }

    // Return with the correct structure
    return {
      total_properties: data.total_properties || 0,
      total_investment: data.total_investment || 0, 
      average_roi: data.average_roi || 0
    };
  } catch (error) {
    console.error("Error in fetchPortfolioSummary:", error);
    // Return default values
    return {
      total_properties: 0,
      total_investment: 0,
      average_roi: 0
    };
  }
};

export const fetchPortfolioData = async (): Promise<Portfolio> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("No user found");

    // Fetch basic portfolio data
    const { data: summary, error: summaryError } = await supabase.rpc(
      "get_user_portfolio_summary",
      { p_user_id: user.id }
    );

    if (summaryError) {
      console.error("Error fetching portfolio summary:", summaryError);
      throw new Error(summaryError.message);
    }

    // Fetch portfolio allocation
    const { data: allocation, error: allocationError } = await supabase
      .from("user_portfolio_allocation")
      .select("location, percentage")
      .eq("user_id", user.id);

    if (allocationError) {
      console.error("Error fetching portfolio allocation:", allocationError);
      throw new Error(allocationError.message);
    }

    // Fetch investment growth over time
    const { data: growth, error: growthError } = await supabase
      .from("user_investment_growth")
      .select("month, month_index, year, value")
      .eq("user_id", user.id)
      .order("year, month_index", { ascending: true });

    if (growthError) {
      console.error("Error fetching investment growth:", growthError);
      throw new Error(growthError.message);
    }

    // Calculate performance data (placeholder)
    const performance = [
      { name: "ROI", value: summary.average_roi || 0 },
      { name: "Capital Growth", value: summary.capital_growth || 0 },
      { name: "Rental Yield", value: summary.rental_yield || 0 },
    ];

    return {
      total_properties: summary.total_properties || 0,
      total_investment: summary.total_investment || 0,
      average_roi: summary.average_roi || 0,
      total_value: summary.total_value || 0,
      portfolio_growth: summary.portfolio_growth || 0,
      allocation: allocation || [],
      performance_data: performance,
      investment_growth: growth || [],
    };
  } catch (error) {
    console.error("Error in fetchPortfolioData:", error);
    // Return default/empty values
    return {
      total_properties: 0,
      total_investment: 0,
      average_roi: 0,
      total_value: 0,
      portfolio_growth: 0,
      allocation: [],
      performance_data: [],
      investment_growth: [],
    };
  }
};
