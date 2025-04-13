
import { EventFilter } from "@/types/property";
import { Event } from "@/types/event";

/**
 * Build a query string from an event filter object
 */
export const buildEventFilterQuery = (filter: EventFilter): URLSearchParams => {
  const params = new URLSearchParams();
  
  if (filter.eventType) {
    params.append('eventType', filter.eventType);
  }
  
  if (filter.location) {
    params.append('location', filter.location);
  }
  
  if (filter.fromDate) {
    params.append('fromDate', filter.fromDate);
  }
  
  if (filter.toDate) {
    params.append('toDate', filter.toDate);
  }
  
  if (filter.eventFormat) {
    params.append('eventFormat', filter.eventFormat);
  }
  
  if (filter.onlyAvailable) {
    params.append('onlyAvailable', 'true');
  }
  
  if (filter.badge) {
    params.append('badge', filter.badge);
  }
  
  return params;
};

/**
 * Apply filters to an array of events in memory
 */
export const filterEventsInMemory = (events: Event[], filter: EventFilter): Event[] => {
  if (!filter) return events;
  
  return events.filter(event => {
    // Event type filter
    if (filter.eventType && event.event_type !== filter.eventType) {
      return false;
    }
    
    // Location filter
    if (filter.location && !event.location.toLowerCase().includes(filter.location.toLowerCase())) {
      return false;
    }
    
    // Date range filters
    if (filter.fromDate && new Date(event.date) < new Date(filter.fromDate)) {
      return false;
    }
    
    if (filter.toDate && new Date(event.date) > new Date(filter.toDate)) {
      return false;
    }
    
    // Online/In-person format
    if (filter.eventFormat === 'online' && !event.is_online) {
      return false;
    }
    
    if (filter.eventFormat === 'in-person' && event.is_online) {
      return false;
    }
    
    // Availability filter
    if (filter.onlyAvailable && 
        event.max_attendees !== null && 
        event.current_attendees >= event.max_attendees) {
      return false;
    }
    
    // Badge/level filter
    if (filter.badge && 
        (!event.required_badges || 
         !event.required_badges.includes(filter.badge))) {
      return false;
    }
    
    return true;
  });
};

/**
 * Parse query parameters into an event filter object
 */
export const parseEventFilterFromQuery = (searchParams: URLSearchParams): EventFilter => {
  const filter: EventFilter = {};
  
  if (searchParams.has('eventType')) {
    filter.eventType = searchParams.get('eventType') || undefined;
  }
  
  if (searchParams.has('location')) {
    filter.location = searchParams.get('location') || undefined;
  }
  
  if (searchParams.has('fromDate')) {
    filter.fromDate = searchParams.get('fromDate') || undefined;
  }
  
  if (searchParams.has('toDate')) {
    filter.toDate = searchParams.get('toDate') || undefined;
  }
  
  if (searchParams.has('eventFormat')) {
    filter.eventFormat = searchParams.get('eventFormat') || undefined;
  }
  
  if (searchParams.has('onlyAvailable')) {
    filter.onlyAvailable = searchParams.get('onlyAvailable') === 'true';
  }
  
  if (searchParams.has('badge')) {
    filter.badge = searchParams.get('badge') || undefined;
  }
  
  return filter;
};
