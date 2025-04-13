import { supabase } from "@/integrations/supabase/client";
import { Event } from "@/types/event";
import { EventFilter } from "@/types/property";

// Add the filterEvents function
export function filterEvents(events: Event[], filter?: EventFilter): Event[] {
  if (!filter) return events;
  
  return events.filter((event) => {
    // Filter by event type
    if (filter.eventType && filter.eventType !== 'all' && event.event_type !== filter.eventType) {
      return false;
    }
    
    // Filter by format (online/in-person)
    if (filter.eventFormat && filter.eventFormat !== 'all') {
      if (filter.eventFormat === 'online' && !event.is_online) return false;
      if (filter.eventFormat === 'inPerson' && event.is_online) return false;
    }
    
    // Filter by location
    if (filter.location && !event.location.toLowerCase().includes(filter.location.toLowerCase())) {
      return false;
    }
    
    // Filter by date range
    if (filter.fromDate) {
      const eventDate = new Date(event.date);
      const fromDate = new Date(filter.fromDate);
      if (eventDate < fromDate) return false;
    }
    
    if (filter.toDate) {
      const eventDate = new Date(event.date);
      const toDate = new Date(filter.toDate);
      if (eventDate > toDate) return false;
    }
    
    // Filter by availability
    if (filter.onlyAvailable && event.max_attendees && event.current_attendees >= event.max_attendees) {
      return false;
    }
    
    return true;
  });
}

export async function fetchEvents(): Promise<Event[]> {
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .order("date", { ascending: true });
  
  if (error) {
    console.error("Error fetching events:", error);
    throw new Error(error.message);
  }
  
  return data as Event[];
}

// Add fetchEvent function
export async function fetchEvent(id: string): Promise<Event> {
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("id", id)
    .single();
  
  if (error) {
    console.error("Error fetching event:", error);
    throw new Error(error.message);
  }
  
  return data as Event;
}

// Add submitEventReview function
export async function submitEventReview(review: any, userId: string): Promise<any> {
  const { data, error } = await supabase
    .from("event_reviews")
    .insert([
      {
        ...review,
        user_id: userId,
        created_at: new Date().toISOString(),
      },
    ])
    .select()
    .single();
  
  if (error) {
    console.error("Error submitting event review:", error);
    throw new Error(error.message);
  }
  
  return data as Event;
}

// Add fetchUpcomingEvents function
export async function fetchUpcomingEvents(filter?: EventFilter): Promise<Event[]> {
  let query = supabase
    .from("events")
    .select("*")
    .order("date", { ascending: true });
  
  if (filter?.badge) {
    query = query.eq("required_level", filter.badge);
  }
  
  const { data, error } = await query;
  
  if (error) {
    console.error("Error fetching upcoming events:", error);
    throw new Error(error.message);
  }
  
  return data as Event[];
}
