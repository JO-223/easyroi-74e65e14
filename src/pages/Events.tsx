
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchEvents } from "@/services/eventService";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { EventList } from "@/components/events/EventList";
import { EventFilters } from "@/components/events/EventFilters";
import { Separator } from "@/components/ui/separator";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { EventFilter } from "@/types/event";

export default function Events() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [activeFilters, setActiveFilters] = useState<EventFilter>({});
  
  // In a real application, we would get the user's badge from the authentication context
  // For now, we use a hardcoded value to demonstrate the functionality
  const userBadge = "silver"; // Simulate a user with silver badge
  
  const { data: events = [], isLoading, error } = useQuery({
    queryKey: ['events'],
    queryFn: () => fetchEvents(),
    meta: {
      onError: () => {
        toast({
          title: t('error'),
          description: t('error'),
          variant: "destructive",
        });
      },
    },
  });
  
  // Apply filters to events
  const filteredEvents = applyFilters(events, activeFilters);
  
  const handleApplyFilters = (filters: EventFilter) => {
    setActiveFilters(filters);
  };

  // Local filter function
  function applyFilters(events: any[], filters: EventFilter) {
    return events.filter(event => {
      // Filter by event type
      if (filters.eventType && event.event_type !== filters.eventType) {
        return false;
      }
      
      // Filter by location
      if (filters.location && 
          !event.location.toLowerCase().includes(filters.location.toLowerCase())) {
        return false;
      }
      
      // Filter by date range
      if (filters.fromDate) {
        const fromDate = new Date(filters.fromDate);
        const eventDate = new Date(event.date);
        if (eventDate < fromDate) return false;
      }
      
      if (filters.toDate) {
        const toDate = new Date(filters.toDate);
        const eventDate = new Date(event.date);
        if (eventDate > toDate) return false;
      }
      
      // Filter by availability
      if (filters.onlyAvailable && 
          event.max_attendees && 
          event.current_attendees >= event.max_attendees) {
        return false;
      }
      
      // Filter by event format
      if (filters.eventFormat === 'online' && !event.is_online) {
        return false;
      }
      
      if (filters.eventFormat === 'in-person' && event.is_online) {
        return false;
      }
      
      // Filter by badge level
      if (filters.badge && 
          event.required_badges && 
          !event.required_badges.includes(filters.badge)) {
        return false;
      }
      
      return true;
    });
  }
  
  return (
    <DashboardLayout title={t('upcomingEvents')} subtitle={t('events')}>
      <div className="container mx-auto py-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Upcoming Events</h1>
            <p className="text-muted-foreground">Discover events and networking opportunities</p>
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
              userBadge={userBadge}
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
