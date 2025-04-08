
import { Event, EventFilter } from "@/types/property";
import { format } from "date-fns";

export const filterEvents = (events: Event[], filters: EventFilter) => {
  return events.filter(event => {
    // Filter by event type
    if (filters.eventType && event.event_type !== filters.eventType) {
      return false;
    }
    
    // Filter by date range
    if (filters.dateFrom || filters.dateTo) {
      const eventDate = new Date(event.date);
      
      if (filters.dateFrom && eventDate < filters.dateFrom) {
        return false;
      }
      
      if (filters.dateTo) {
        const dateTo = new Date(filters.dateTo);
        dateTo.setHours(23, 59, 59); // Set to end of day
        if (eventDate > dateTo) {
          return false;
        }
      }
    }
    
    // Filter by location
    if (filters.location && !event.location.toLowerCase().includes(filters.location.toLowerCase())) {
      return false;
    }
    
    // Filter by availability
    if (filters.hasAvailability === true && 
        event.max_attendees !== null && 
        event.current_attendees >= event.max_attendees) {
      return false;
    }
    
    // Filter by online/offline events
    if (filters.isOnline !== undefined && event.is_online !== filters.isOnline) {
      return false;
    }
    
    // Filter by badge requirement
    if (filters.badge && 
        event.required_badges && 
        event.required_badges.length > 0 &&
        !event.required_badges.includes(filters.badge)) {
      return false;
    }
    
    return true;
  });
};

// Function to verify if a user has the required badge for an event
export const checkUserEligibility = (event: Event, userBadge: string = 'bronze'): boolean => {
  if (!event.required_badges || event.required_badges.length === 0) {
    return true;
  }
  
  return event.required_badges.includes(userBadge.toLowerCase());
};
