import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { useTranslation } from '@/hooks/useTranslation';
import { PropertyList } from '@/components/dashboard/PropertyList';
import { EventList } from '@/components/dashboard/EventList';
import { PortfolioSummary } from '@/components/dashboard/PortfolioSummary';
import { PortfolioAllocation } from '@/components/dashboard/PortfolioAllocation';
import { PerformanceChart } from '@/components/dashboard/PerformanceChart';
import { PropertyAlerts } from '@/components/dashboard/PropertyAlerts';
import { MarketInsights } from '@/components/dashboard/MarketInsights';
import { useNavigate } from 'react-router-dom';
import { fetchUserProperties } from '@/services/propertyService';
import { fetchUpcomingEvents } from '@/services/eventService';
import { fetchPortfolioSummary } from '@/services/portfolioService';
import { Property, Event } from '@/types/property';
import { PortfolioSummaryData } from '@/types/portfolio';
import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

const Dashboard = () => {
  const t = useTranslation();
  const navigate = useNavigate();
  
  const [properties, setProperties] = useState<Property[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [portfolioSummary, setPortfolioSummary] = useState<PortfolioSummaryData | null>(null);
  const [isLoadingProperties, setIsLoadingProperties] = useState(true);
  const [isLoadingEvents, setIsLoadingEvents] = useState(true);
  const [isLoadingPortfolio, setIsLoadingPortfolio] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const fetchDashboardData = async () => {
    try {
      setIsLoadingProperties(true);
      setIsLoadingEvents(true);
      setIsLoadingPortfolio(true);
      
      // Fetch user properties
      const userProperties = await fetchUserProperties();
      setProperties(userProperties.slice(0, 3)); // Show only first 3
      setIsLoadingProperties(false);
      
      // Fetch upcoming events
      const upcomingEvents = await fetchUpcomingEvents();
      setEvents(upcomingEvents.slice(0, 3)); // Show only first 3
      setIsLoadingEvents(false);
      
      // Fetch portfolio summary
      const summary = await fetchPortfolioSummary();
      setPortfolioSummary(summary);
      setIsLoadingPortfolio(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setIsLoadingProperties(false);
      setIsLoadingEvents(false);
      setIsLoadingPortfolio(false);
    }
  };
  
  const refreshDashboard = async () => {
    setIsRefreshing(true);
    try {
      await fetchDashboardData();
      toast({
        title: t('success'),
        description: t('dashboardDataUpdated'),
      });
    } catch (error) {
      toast({
        title: t('error'),
        description: t('errorUpdatingDashboard'),
        variant: 'destructive',
      });
    } finally {
      setIsRefreshing(false);
    }
  };
  
  useEffect(() => {
    fetchDashboardData();
  }, []);
  
  // Fix for line 67 - we need to wrap the JSX element in a function
  const viewAllPropertiesAction = () => {
    navigate('/dashboard/properties');
  };
  
  const viewAllEventsAction = () => {
    navigate('/dashboard/events');
  };
  
  return (
    <DashboardLayout title={t('dashboard')} subtitle={t('yourInvestmentOverview')}>
      <div className="flex justify-end mb-4">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={refreshDashboard} 
          disabled={isRefreshing}
          className="flex items-center gap-1"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          {t('refresh')}
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <PortfolioSummary 
          data={portfolioSummary} 
          isLoading={isLoadingPortfolio} 
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <PortfolioAllocation isLoading={isLoadingPortfolio} />
        <PerformanceChart isLoading={isLoadingPortfolio} />
      </div>
      
      <div className="mb-6">
        <PropertyList 
          properties={properties}
          isLoading={isLoadingProperties}
          actionLabel={t('viewAllProperties')}
          action={viewAllPropertiesAction} // This should be a function reference, not a JSX element
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <EventList 
            events={events}
            isLoading={isLoadingEvents}
            actionLabel={t('viewAllEvents')}
            action={viewAllEventsAction}
          />
        </div>
        <div className="space-y-6">
          <PropertyAlerts />
          <MarketInsights />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
