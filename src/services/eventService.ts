
import { supabase } from "@/integrations/supabase/client";
import { Event } from "@/types/event";
import { EventFilter } from "@/types/property";

export const fetchEvents = async (filter?: EventFilter): Promise<Event[]> => {
  try {
    let query = supabase
      .from("events")
      .select("*")
      .order("date", { ascending: true });

    if (filter) {
      if (filter.eventType) {
        query = query.eq("event_type", filter.eventType);
      }
      
      if (filter.location) {
        query = query.ilike("location", `%${filter.location}%`);
      }
      
      if (filter.fromDate) {
        query = query.gte("date", filter.fromDate);
      }
      
      if (filter.toDate) {
        query = query.lte("date", filter.toDate);
      }
      
      if (filter.onlyAvailable) {
        query = query.or('max_attendees.is.null,max_attendees.gt.current_attendees');
      }
      
      if (filter.eventFormat === 'online') {
        query = query.eq("is_online", true);
      } else if (filter.eventFormat === 'in-person') {
        query = query.eq("is_online", false);
      }
      
      if (filter.badge) {
        query = query.contains("required_badges", [filter.badge]);
      }
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error("Error fetching events:", error);
      throw new Error(error.message);
    }
    
    // Add proper type casting
    return data as Event[];
  } catch (error) {
    console.error("Error in fetchEvents:", error);
    throw error;
  }
};

export const fetchEvent = async (eventId: string): Promise<Event> => {
  try {
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .eq("id", eventId)
      .single();
    
    if (error) {
      console.error("Error fetching event:", error);
      throw new Error(error.message);
    }
    
    // Add proper type casting
    return data as Event;
  } catch (error) {
    console.error("Error in fetchEvent:", error);
    throw error;
  }
};

export const registerForEvent = async (eventId: string, userId: string): Promise<Event> => {
  try {
    // First check if already registered
    const { data: existingRegistration } = await supabase
      .from("event_attendees")
      .select("*")
      .eq("event_id", eventId)
      .eq("user_id", userId)
      .single();
    
    if (existingRegistration) {
      throw new Error("Already registered for this event");
    }
    
    // Get user badge/level
    const { data: userProfile } = await supabase
      .from("profiles")
      .select("level")
      .eq("id", userId)
      .single();
    
    // Create registration
    const { error: registrationError } = await supabase
      .from("event_attendees")
      .insert({
        event_id: eventId,
        user_id: userId,
        user_badge: userProfile?.level || "bronze"
      });
    
    if (registrationError) {
      console.error("Error registering for event:", registrationError);
      throw new Error(registrationError.message);
    }
    
    // Update event attendee count
    const { data, error } = await supabase
      .from("events")
      .update({ current_attendees: supabase.rpc("increment", { row_id: eventId, table_name: "events", column_name: "current_attendees" }) })
      .eq("id", eventId)
      .select()
      .single();
    
    if (error) {
      console.error("Error updating event attendee count:", error);
      throw new Error(error.message);
    }
    
    // Add proper type casting
    return data as Event;
  } catch (error) {
    console.error("Error in registerForEvent:", error);
    throw error;
  }
};

export const fetchSimilarEvents = async (eventId: string, limit = 3): Promise<Event[]> => {
  try {
    // Get the current event details
    const { data: event, error: eventError } = await supabase
      .from("events")
      .select("event_type, is_online, required_badges")
      .eq("id", eventId)
      .single();
    
    if (eventError) {
      console.error("Error fetching event for similar events:", eventError);
      throw new Error(eventError.message);
    }
    
    // Get similar events based on type
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .eq("event_type", event.event_type)
      .eq("is_online", event.is_online)
      .neq("id", eventId) // Exclude the current event
      .gte("date", new Date().toISOString().split('T')[0]) // Only future events
      .order("date", { ascending: true })
      .limit(limit);
    
    if (error) {
      console.error("Error fetching similar events:", error);
      throw new Error(error.message);
    }
    
    // Add proper type casting
    return data as Event[];
  } catch (error) {
    console.error("Error in fetchSimilarEvents:", error);
    throw error;
  }
};
