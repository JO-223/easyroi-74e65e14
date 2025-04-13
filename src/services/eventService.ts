
import { supabase } from "@/integrations/supabase/client";
import { Event, EventFilter } from "@/types/event";

export async function fetchEvents(): Promise<Event[]> {
  try {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('date', { ascending: true });

    if (error) {
      console.error('Error fetching events:', error);
      throw error;
    }

    return (data || []).map(event => ({
      id: String(event.id),
      title: String(event.title),
      description: String(event.description),
      date: String(event.date),
      time: String(event.time),
      location: String(event.location),
      event_type: String(event.event_type),
      is_online: Boolean(event.is_online),
      image_url: event.image_url ? String(event.image_url) : undefined,
      max_attendees: event.max_attendees ? Number(event.max_attendees) : undefined,
      current_attendees: Number(event.current_attendees),
      property_id: event.property_id ? String(event.property_id) : undefined,
      project_id: event.project_id ? String(event.project_id) : undefined,
      average_rating: event.average_rating ? Number(event.average_rating) : undefined,
      required_badges: Array.isArray(event.required_badges) 
        ? event.required_badges.map(String)
        : undefined,
      created_at: event.created_at ? String(event.created_at) : undefined
    }));
  } catch (error) {
    console.error('Error fetching events:', error);
    throw error;
  }
}

export async function fetchEvent(id: string): Promise<Event> {
  try {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error(`Error fetching event with ID ${id}:`, error);
      throw error;
    }

    if (!data) {
      throw new Error(`Event with ID ${id} not found`);
    }

    return {
      id: String(data.id),
      title: String(data.title),
      description: String(data.description),
      date: String(data.date),
      time: String(data.time),
      location: String(data.location),
      event_type: String(data.event_type),
      is_online: Boolean(data.is_online),
      image_url: data.image_url ? String(data.image_url) : undefined,
      max_attendees: data.max_attendees ? Number(data.max_attendees) : undefined,
      current_attendees: Number(data.current_attendees),
      property_id: data.property_id ? String(data.property_id) : undefined,
      project_id: data.project_id ? String(data.project_id) : undefined,
      average_rating: data.average_rating ? Number(data.average_rating) : undefined,
      required_badges: Array.isArray(data.required_badges) 
        ? data.required_badges.map(String)
        : undefined,
      created_at: data.created_at ? String(data.created_at) : undefined
    };
  } catch (error) {
    console.error(`Error fetching event with ID ${id}:`, error);
    throw error;
  }
}

export async function registerForEvent(eventId: string, userId: string) {
  try {
    // First check if the user is already registered
    const { data: existingRegistration, error: checkError } = await supabase
      .from('event_attendees')
      .select('*')
      .eq('event_id', eventId)
      .eq('user_id', userId)
      .single();
    
    if (existingRegistration) {
      return { success: false, message: 'User already registered for this event' };
    }
    
    // Register the user for the event
    const { error } = await supabase
      .from('event_attendees')
      .insert({
        event_id: eventId,
        user_id: userId,
      });

    if (error) {
      console.error('Error registering for event:', error);
      throw error;
    }

    // Update the current_attendees count
    const { error: updateError } = await supabase.rpc('increment_event_attendees', {
      event_id: eventId
    });

    if (updateError) {
      console.error('Error updating event attendee count:', updateError);
    }

    return { success: true, message: 'Successfully registered for event' };
  } catch (error) {
    console.error('Error registering for event:', error);
    throw error;
  }
}

export async function fetchSimilarEvents(eventId: string): Promise<Event[]> {
  try {
    // First get details of the current event
    const { data: currentEvent, error: eventError } = await supabase
      .from('events')
      .select('event_type, date')
      .eq('id', eventId)
      .single();

    if (eventError) {
      console.error(`Error fetching event with ID ${eventId}:`, eventError);
      throw eventError;
    }

    // Fetch events with same type but not including the current event
    // and that are upcoming (not in the past)
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('event_type', currentEvent.event_type)
      .neq('id', eventId)
      .gte('date', new Date().toISOString().split('T')[0]) // Only future events
      .order('date', { ascending: true })
      .limit(6);

    if (error) {
      console.error('Error fetching similar events:', error);
      throw error;
    }

    return (data || []).map(event => ({
      id: String(event.id),
      title: String(event.title),
      description: String(event.description),
      date: String(event.date),
      time: String(event.time),
      location: String(event.location),
      event_type: String(event.event_type),
      is_online: Boolean(event.is_online),
      image_url: event.image_url ? String(event.image_url) : undefined,
      max_attendees: event.max_attendees ? Number(event.max_attendees) : undefined,
      current_attendees: Number(event.current_attendees),
      property_id: event.property_id ? String(event.property_id) : undefined,
      project_id: event.project_id ? String(event.project_id) : undefined,
      average_rating: event.average_rating ? Number(event.average_rating) : undefined,
      required_badges: Array.isArray(event.required_badges) 
        ? event.required_badges.map(String)
        : undefined,
      created_at: event.created_at ? String(event.created_at) : undefined
    }));
  } catch (error) {
    console.error('Error fetching similar events:', error);
    throw error;
  }
}
