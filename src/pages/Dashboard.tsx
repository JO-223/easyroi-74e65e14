
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowClockwise } from 'lucide-react';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { PropertyList } from '@/components/dashboard/PropertyList';
import { EventList } from '@/components/dashboard/EventList';
import { PortfolioSummary } from '@/components/dashboard/PortfolioSummary';
import { PortfolioAllocation } from '@/components/dashboard/PortfolioAllocation';
import { PerformanceChart } from '@/components/dashboard/PerformanceChart';
import { PropertyAlerts } from '@/components/dashboard/PropertyAlerts';
import { MarketInsights } from '@/components/dashboard/MarketInsights';

import { fetchProperties } from '@/services/propertyService';
import { fetchEvents } from '@/services/eventService';
import { fetchPortfolioData } from '@/services/portfolioService';
import { updateDashboardData } from '@/services/dashboard/dashboardUpdateService';

import { Portfolio } from '@/types/portfolio';
import { useLanguage } from '@/contexts/LanguageContext';
import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Property } from '@/types/property';
import { Event } from '@/types/event';

export default function Dashboard() {
  const { t } = useLanguage();
  const { toast } = useToast();
  
  // Fetch properties
  const { data: properties = [] } = useQuery<Property[]>({
    queryKey: ['properties'],
    queryFn: () => fetchProperties()
  });
  
  // Fetch events
  const { data: events = [] } = useQuery<Event[]>({
    queryKey: ['events'],
    queryFn: () => fetchEvents()
  });
  
  // Fetch portfolio data
  const { data: portfolio } = useQuery<Portfolio>({
    queryKey: ['portfolio'],
    queryFn: fetchPortfolioData
  });
  
  // Update dashboard data mutation
  const { mutate: updateDashboard, isPending: isUpdating } = useMutation({
    mutationFn: updateDashboardData,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['portfolio'] });
      
      toast({
        title: t('dashboardDataUpdated'),
        description: "Your dashboard data has been refreshed successfully"
      });
    },
    onError: (error) => {
      toast({
        title: t('errorUpdatingDashboard'),
        description: error.message,
        variant: "destructive"
      });
    }
  });
  
  const RefreshButton = () => (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={() => updateDashboard()}
      disabled={isUpdating}
    >
      <ArrowClockwise className="mr-2 h-4 w-4" />
      {isUpdating ? "Refreshing..." : "Refresh Data"}
    </Button>
  );
  
  return (
    <DashboardLayout 
      title={t('dashboard')} 
      subtitle={"Your investment overview"} 
      headerAction={<RefreshButton />}
    >
      <div className="space-y-8">
        <PortfolioSummary portfolio={portfolio} />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <PerformanceChart data={portfolio?.performance_data} />
          <PortfolioAllocation data={portfolio?.allocation} />
        </div>
        
        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">Properties</h2>
          <PropertyList properties={properties} />
        </div>
        
        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">Upcoming Events</h2>
          <EventList events={events} />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <PropertyAlerts />
          <MarketInsights />
        </div>
      </div>
    </DashboardLayout>
  );
}
