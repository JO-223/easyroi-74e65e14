
import { supabase } from '@/integrations/supabase/client';
import { Event, EventFilter } from '@/types/property';
import { applyEventFilters } from './events/eventFilters';

export const fetchEvents = async (filter?: EventFilter): Promise<Event[]> => {
  try {
    let query = supabase
      .from('events')
      .select('*')
      .order('date', { ascending: true });
    
    if (filter) {
      query = applyEventFilters(query, filter);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching events:', error);
      throw new Error('Failed to fetch events');
    }
    
    return data as Event[];
  } catch (error) {
    console.error('Error in fetchEvents:', error);
    throw error;
  }
};

export const fetchUpcomingEvents = async (): Promise<Event[]> => {
  const today = new Date().toISOString().split('T')[0];
  
  try {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .gte('date', today)
      .order('date', { ascending: true })
      .limit(3);
    
    if (error) {
      console.error('Error fetching upcoming events:', error);
      throw new Error('Failed to fetch upcoming events');
    }
    
    return data as Event[];
  } catch (error) {
    console.error('Error in fetchUpcomingEvents:', error);
    throw error;
  }
};

export const fetchEventById = async (id: string): Promise<Event | null> => {
  try {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        return null; // No event found
      }
      console.error('Error fetching event:', error);
      throw new Error('Failed to fetch event');
    }
    
    return data as Event;
  } catch (error) {
    console.error('Error in fetchEventById:', error);
    throw error;
  }
};

export const fetchSimilarEvents = async (eventId: string): Promise<Event[]> => {
  try {
    // Get the event first to find similar ones
    const { data: event, error: eventError } = await supabase
      .from('events')
      .select('*')
      .eq('id', eventId)
      .single();
    
    if (eventError) {
      console.error('Error fetching event for similar events:', eventError);
      return [];
    }
    
    // Now find similar events based on event_type
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('event_type', event.event_type)
      .neq('id', eventId)
      .order('date', { ascending: true })
      .limit(3);
    
    if (error) {
      console.error('Error fetching similar events:', error);
      return [];
    }
    
    return data as Event[];
  } catch (error) {
    console.error('Error in fetchSimilarEvents:', error);
    return [];
  }
};
