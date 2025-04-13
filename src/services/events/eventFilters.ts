
import { SupabaseClient } from '@supabase/supabase-js';
import { EventFilter } from '@/types/property';

export const applyEventFilters = (query: any, filter: EventFilter): any => {
  // If event type is specified, filter by it
  if (filter.eventType) {
    query = query.eq('event_type', filter.eventType);
  }
  
  // If location is specified, filter by it (using ilike for partial matches)
  if (filter.location) {
    query = query.ilike('location', `%${filter.location}%`);
  }
  
  // If date range is specified, filter by it
  if (filter.dateFrom) {
    const dateFromStr = filter.dateFrom.toISOString().split('T')[0];
    query = query.gte('date', dateFromStr);
  }
  
  if (filter.dateTo) {
    const dateToStr = filter.dateTo.toISOString().split('T')[0];
    query = query.lte('date', dateToStr);
  }
  
  // If online/in-person preference is specified
  if (filter.isOnline !== undefined) {
    query = query.eq('is_online', filter.isOnline);
  }
  
  // If only available events are requested
  if (filter.hasAvailability === true) {
    query = query.or('max_attendees.is.null,current_attendees.lt.max_attendees');
  }
  
  // If badge filter is specified
  if (filter.badge) {
    query = query.contains('required_badges', [filter.badge]);
  }
  
  return query;
};
