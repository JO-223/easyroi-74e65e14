
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
    let locations: Record<string, any> = {};
    
    if (locationIds.length > 0) {
      const { data: locationData, error: locationError } = await supabase
        .from('property_locations')
        .select('id, city, country')
        .in('id', locationIds);
        
      if (locationError) {
        console.error("Error fetching locations:", locationError);
      } else if (locationData) {
        locations = locationData.reduce((acc, loc) => ({
          ...acc,
          [loc.id]: `${loc.city}, ${loc.country}`
        }), {});
      }
    }
    
    // Format property list with location data
    const formattedProperties = propertyList?.map(property => ({
      id: property.id,
      name: property.name,
      location: locations[property.location_id] || 'Unknown',
      roi: `${property.roi_percentage}%`,
      value: `€${Number(property.price).toLocaleString()}`,
      status: property.status
    })) || [];
    
    // Format investment growth data
    const formattedGrowthData = growthData?.map(item => ({
      name: item.month,
      value: item.value
    })) || [];
    
    // Format portfolio allocation data
    const formattedAllocationData = allocationData?.map(item => ({
      name: item.location,
      value: item.percentage
    })) || [];

    return {
      stats: {
        totalInvestment: investmentData?.total_investment || 0,
        investmentChange: investmentData?.investment_change_percentage || 0,
        propertiesCount: propertiesData?.count || 0,
        propertiesChange: propertiesData?.change || 0,
        averageRoi: roiData?.average_roi || 0,
        roiChange: roiData?.roi_change || 0,
        eventsCount: eventsData?.count || 0
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
