
import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { RefreshCw } from "lucide-react"; // Fix the ArrowClockwise import
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { PropertyList } from "@/components/dashboard/PropertyList";
import { EventList } from "@/components/dashboard/EventList";
import { PortfolioSummary } from "@/components/dashboard/PortfolioSummary";
import { PortfolioAllocation } from "@/components/dashboard/PortfolioAllocation";
import { PerformanceChart } from "@/components/dashboard/PerformanceChart";
import { PropertyAlerts } from "@/components/dashboard/PropertyAlerts";
import { MarketInsights } from "@/components/dashboard/MarketInsights";
import { fetchProperties } from "@/services/propertyService";
import { fetchEvents } from "@/services/eventService";
import { updateUserDashboardData } from "@/services/dashboard/dashboardUpdateService"; // Use the correct function name
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Property } from "@/types/property";
import { Portfolio } from "@/types/portfolio";

// Mock data for demonstration
const mockPortfolioData: Portfolio = {
  total_properties: 5,
  total_investment: 1250000,
  average_roi: 8.5,
  total_value: 1450000,
  portfolio_growth: 16,
  allocation: [
    { location: "Dubai", percentage: 40 },
    { location: "London", percentage: 30 },
    { location: "New York", percentage: 20 },
    { location: "Other", percentage: 10 }
  ],
  performance_data: [
    { name: "Residential", value: 65 },
    { name: "Commercial", value: 25 },
    { name: "Vacation", value: 10 }
  ],
  investment_growth: [
    { month: "Jan", month_index: 0, year: 2023, value: 100000 },
    { month: "Feb", month_index: 1, year: 2023, value: 110000 },
    { month: "Mar", month_index: 2, year: 2023, value: 115000 },
    { month: "Apr", month_index: 3, year: 2023, value: 120000 },
    { month: "May", month_index: 4, year: 2023, value: 125000 },
    { month: "Jun", month_index: 5, year: 2023, value: 130000 }
  ]
};

export default function Dashboard() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Fetch properties
  const { data: properties = [] } = useQuery<Property[]>({
    queryKey: ['properties'],
    queryFn: () => fetchProperties(),
    staleTime: 1000 * 60 * 5 // 5 minutes
  });
  
  // Fetch upcoming events
  const { data: events = [] } = useQuery({
    queryKey: ['events', 'upcoming'],
    queryFn: () => fetchEvents({ fromDate: new Date().toISOString() }),
    staleTime: 1000 * 60 * 5 // 5 minutes
  });
  
  // In a real app, we would fetch the portfolio data
  const portfolio = mockPortfolioData;
  
  const handleUpdateDashboard = async () => {
    try {
      await updateUserDashboardData();
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['properties'] }),
        queryClient.invalidateQueries({ queryKey: ['events'] })
      ]);
      
      toast({
        title: "Dashboard Updated",
        description: t("dashboardDataUpdated")
      });
    } catch (error) {
      toast({
        title: "Error",
        description: t("errorUpdatingDashboard"),
        variant: "destructive"
      });
    }
  };
  
  return (
    <DashboardLayout 
      title={t("dashboard")} 
      subtitle={t("overview")}
      headerAction={
        <Button variant="outline" size="sm" onClick={handleUpdateDashboard}>
          <RefreshCw className="h-4 w-4 mr-2" />
          {t("refresh")}
        </Button>
      }
    >
      <div className="space-y-6">
        {/* Summary Cards */}
        <PortfolioSummary />
        
        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <PerformanceChart />
          <PortfolioAllocation />
        </div>
        
        {/* Properties Section */}
        <div>
          <h2 className="text-lg font-medium mb-4">{t("properties")}</h2>
          <PropertyList properties={properties} />
        </div>
        
        {/* Alerts and Insights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <PropertyAlerts className="md:col-span-2" />
          <MarketInsights />
        </div>
        
        {/* Upcoming Events */}
        <div>
          <h2 className="text-lg font-medium mb-4">{t("upcomingEvents")}</h2>
          <EventList events={events} />
        </div>
      </div>
    </DashboardLayout>
  );
}
