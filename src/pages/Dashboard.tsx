
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";
import { SkeletonCard } from "@/components/ui/skeleton-card";
import { DashboardError } from "@/components/dashboard/DashboardError";
import { PropertyList } from "@/components/dashboard/PropertyList";
import { EventList } from "@/components/dashboard/EventList";
import { PortfolioSummary } from "@/components/dashboard/PortfolioSummary";
import { PortfolioAllocation } from "@/components/dashboard/PortfolioAllocation";
import { PerformanceChart } from "@/components/dashboard/PerformanceChart";
import { PropertyAlerts } from "@/components/dashboard/PropertyAlerts";
import { MarketInsights } from "@/components/dashboard/MarketInsights";
import { fetchProperties } from "@/services/propertyService";
import { fetchEvents } from "@/services/eventService";

export default function Dashboard() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);
  
  const {
    data: properties,
    isLoading: isLoadingProperties,
    error: propertiesError,
    refetch: refetchProperties,
  } = useQuery({
    queryKey: ["userProperties", user?.id],
    queryFn: () => fetchProperties(),
    enabled: !!user?.id,
  });

  const {
    data: events,
    isLoading: isLoadingEvents,
    error: eventsError,
    refetch: refetchEvents,
  } = useQuery({
    queryKey: ["upcomingEvents"],
    queryFn: () => fetchEvents(),
  });

  // Placeholder for updating dashboard data
  const handleUpdateDashboard = async () => {
    setIsUpdating(true);
    try {
      // Refetch data
      await Promise.all([refetchProperties(), refetchEvents()]);
      
      toast({
        title: t("success"),
        description: "Dashboard data updated",
      });
    } catch (error) {
      console.error("Error updating dashboard:", error);
      toast({
        title: t("error"),
        description: "Error updating dashboard",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  // For demo purposes only - using hardcoded data
  const hasSummaryData = true;
  
  return (
    <DashboardLayout
      title={t("dashboard")}
      subtitle={t("dashboard")}
      headerAction={
        <Button 
          onClick={handleUpdateDashboard} 
          variant="outline"
          disabled={isUpdating}
          className="ml-auto"
        >
          <RefreshCcw className={`mr-2 h-4 w-4 ${isUpdating ? "animate-spin" : ""}`} />
          {t("refreshDashboard")}
        </Button>
      }
    >
      <div className="grid gap-6">
        {/* Dashboard Main Content */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {hasSummaryData ? (
            <>
              <PortfolioSummary isLoading={isLoadingProperties} />
              
              <div className="grid gap-6">
                <PortfolioAllocation isLoading={isLoadingProperties} />
                <PropertyAlerts />
              </div>
              
              <MarketInsights />
            </>
          ) : (
            <DashboardError />
          )}
        </div>

        {/* Properties Section */}
        <div>
          <h2 className="text-xl font-semibold tracking-tight mb-4">Your Properties</h2>
          
          {isLoadingProperties ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map(i => <SkeletonCard key={i} />)}
            </div>
          ) : propertiesError ? (
            <DashboardError />
          ) : (
            properties && properties.length > 0 ? (
              <PropertyList properties={properties.slice(0, 3)} />
            ) : (
              <DashboardError />
            )
          )}
        </div>

        {/* Performance Chart */}
        <div>
          <h2 className="text-xl font-semibold tracking-tight mb-4">Performance</h2>
          <PerformanceChart isLoading={isLoadingProperties} />
        </div>

        {/* Upcoming Events Section */}
        <div>
          <h2 className="text-xl font-semibold tracking-tight mb-4">Upcoming Events</h2>
          
          {isLoadingEvents ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map(i => <SkeletonCard key={i} />)}
            </div>
          ) : eventsError ? (
            <DashboardError />
          ) : (
            events && events.length > 0 ? (
              <EventList events={events.slice(0, 3)} />
            ) : (
              <DashboardError />
            )
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
