
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
  const { t } = useLanguage();
  const { toast } = useToast();
  const [activeFilters, setActiveFilters] = useState<EventFilter>({});
  
  const { data: events = [], isLoading, error } = useQuery({
    queryKey: ['events'],
    queryFn: fetchEvents,
    meta: {
      onError: () => {
        toast({
          title: t('errorFetchingEvents'),
          description: t('pleaseTryAgainLater'),
          variant: "destructive",
        });
      },
    },
  });
  
  // Apply filters to events
  const filteredEvents = filterEvents(events, activeFilters);
  
  const handleApplyFilters = (filters: EventFilter) => {
    setActiveFilters(filters);
  };
  
  return (
    <DashboardLayout>
      <div className="container mx-auto py-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">{t('upcomingEvents')}</h1>
            <p className="text-muted-foreground">{t('discoverEventsAndNetworkingOpportunities')}</p>
          </div>
        </div>
        
        <Separator className="my-6" />
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-1">
            <EventFilters onApplyFilters={handleApplyFilters} />
          </div>
          
          <div className="md:col-span-3">
            <EventList 
              events={filteredEvents} 
              isLoading={isLoading} 
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
