
import { Event, EventFilter } from "@/types/event";

export function applyEventFilters(events: Event[], filters: EventFilter): Event[] {
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
