import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchEvents, filterEvents } from "@/services/eventService";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { EventList } from "@/components/events/EventList";
import { EventFilters } from "@/components/events/EventFilters";
import { Separator } from "@/components/ui/separator";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { EventFilter } from "@/types/property";
export default function Events() {
  const {
    t
  } = useLanguage();
  const {
    toast
  } = useToast();
  const [activeFilters, setActiveFilters] = useState<EventFilter>({});

  // In a real application, we would get the user's badge from the authentication context
  // For now, we use a hardcoded value to demonstrate the functionality
  const userBadge = "silver"; // Simulate a user with silver badge

  const {
    data: events = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['events'],
    queryFn: fetchEvents,
    meta: {
      onError: () => {
        toast({
          title: t('errorFetchingEvents'),
          description: t('pleaseTryAgainLater'),
          variant: "destructive"
        });
      }
    }
  });

  // Apply filters to events
  const filteredEvents = filterEvents(events, activeFilters);
  const handleApplyFilters = (filters: EventFilter) => {
    setActiveFilters(filters);
  };
  return <DashboardLayout title={t('upcomingEvents')} subtitle={t('discoverEventsAndNetworkingOpportunities')}>
      <div className="container mx-auto py-6">
        
        
        
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-1">
            <EventFilters onApplyFilters={handleApplyFilters} />
          </div>
          
          <div className="md:col-span-3">
            <EventList events={filteredEvents} isLoading={isLoading} userBadge={userBadge} />
          </div>
        </div>
      </div>
    </DashboardLayout>;
}