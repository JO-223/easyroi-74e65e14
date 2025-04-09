
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export type DashboardStats = {
  totalInvestment: number;
  investmentChange: number; // percentage
  propertiesCount: number;
  propertiesChange: number; // can be +1, -1, etc.
  averageRoi: number;
  roiChange: number; // percentage
  eventsCount: number;
};

export type InvestmentGrowthData = {
  name: string;
  value: number;
}[];

export type PortfolioAllocation = {
  name: string;
  value: number;
}[];

export type PropertyListItem = {
  id: string;
  name: string;
  location: string;
  roi: string;
  value: string;
  status: string;
};

/**
 * Fetches all dashboard data for the current authenticated user
 */
export const fetchDashboardData = async (): Promise<{
  stats: DashboardStats;
  investmentGrowth: InvestmentGrowthData;
  portfolioAllocation: PortfolioAllocation;
  properties: PropertyListItem[];
} | null> => {
  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.error("No authenticated user found");
      return null;
    }
    
    // Fetch user investment data
    const { data: investmentData, error: investmentError } = await supabase
      .from('user_investments')
      .select('total_investment, investment_change_percentage')
      .eq('user_id', user.id)
      .single();
    
    if (investmentError) {
      console.error("Error fetching investment data:", investmentError);
    }
    
    // Fetch properties data
    const { data: propertiesData, error: propertiesError } = await supabase
      .from('user_properties')
      .select('count, change')
      .eq('user_id', user.id)
      .single();
      
    if (propertiesError) {
      console.error("Error fetching properties count:", propertiesError);
    }
    
    // Fetch ROI data
    const { data: roiData, error: roiError } = await supabase
      .from('user_roi')
      .select('average_roi, roi_change')
      .eq('user_id', user.id)
      .single();
      
    if (roiError) {
      console.error("Error fetching ROI data:", roiError);
    }
    
    // Fetch events count
    const { data: eventsData, error: eventsError } = await supabase
      .from('user_events')
      .select('count')
      .eq('user_id', user.id)
      .single();
      
    if (eventsError) {
      console.error("Error fetching events count:", eventsError);
    }
    
    // Fetch investment growth data
    const { data: growthData, error: growthError } = await supabase
      .from('user_investment_growth')
      .select('month, value')
      .eq('user_id', user.id)
      .order('month_index', { ascending: true });
      
    if (growthError) {
      console.error("Error fetching investment growth:", growthError);
    }
    
    // Fetch portfolio allocation
    const { data: allocationData, error: allocationError } = await supabase
      .from('user_portfolio_allocation')
      .select('location, percentage')
      .eq('user_id', user.id);
      
    if (allocationError) {
      console.error("Error fetching portfolio allocation:", allocationError);
    }
    
    // Fetch properties list
    const { data: propertyList, error: propertyListError } = await supabase
      .from('properties')
      .select('id, name, location_id, roi_percentage, price, status')
      .eq('user_id', user.id)
      .limit(4);
      
    if (propertyListError) {
      console.error("Error fetching properties list:", propertyListError);
    }
    
    // Get locations for properties
    const locationIds = propertyList?.map(property => property.location_id) || [];
    let locations: Record<string, string> = {};
    
    if (locationIds.length > 0) {
      const { data: locationData, error: locationError } = await supabase
        .from('property_locations')
        .select('id, city, country')
        .in('id', locationIds);
        
      if (locationError) {
        console.error("Error fetching locations:", locationError);
      } else if (locationData) {
        locations = locationData.reduce((acc, loc) => {
          // Fix: Convert the id to a string to ensure it's a valid key type
          return {
            ...acc,
            [loc.id.toString()]: `${loc.city}, ${loc.country}`
          };
        }, {} as Record<string, string>);
      }
    }
    
    // Format property list with location data
    const formattedProperties: PropertyListItem[] = propertyList?.map(property => ({
      id: property.id as string,
      name: property.name as string,
      location: locations[property.location_id?.toString() || ''] || 'Unknown',
      roi: `${property.roi_percentage}%`,
      value: `€${Number(property.price).toLocaleString()}`,
      status: property.status as string
    })) || [];
    
    // Format investment growth data
    const formattedGrowthData: InvestmentGrowthData = growthData?.map(item => ({
      name: item.month as string,
      value: Number(item.value)
    })) || [];
    
    // Format portfolio allocation data
    const formattedAllocationData: PortfolioAllocation = allocationData?.map(item => ({
      name: item.location as string,
      value: Number(item.percentage)
    })) || [];

    return {
      stats: {
        totalInvestment: Number(investmentData?.total_investment || 0),
        investmentChange: Number(investmentData?.investment_change_percentage || 0),
        propertiesCount: Number(propertiesData?.count || 0),
        propertiesChange: Number(propertiesData?.change || 0),
        averageRoi: Number(roiData?.average_roi || 0),
        roiChange: Number(roiData?.roi_change || 0),
        eventsCount: Number(eventsData?.count || 0)
      },
      investmentGrowth: formattedGrowthData,
      portfolioAllocation: formattedAllocationData,
      properties: formattedProperties
    };
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return null;
  }
};

/**
 * Hook for easy integration of dashboard data
 */
export const useDashboardService = () => {
  const { toast } = useToast();
  
  const getDashboardData = async () => {
    try {
      const dashboardData = await fetchDashboardData();
      if (!dashboardData) {
        toast({
          title: "Errore",
          description: "Non è stato possibile recuperare i dati della dashboard",
          variant: "destructive"
        });
      }
      return dashboardData;
    } catch (error) {
      console.error("Error in dashboard service:", error);
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante il recupero dei dati",
        variant: "destructive"
      });
      return null;
    }
  };
  
  return { getDashboardData };
};
