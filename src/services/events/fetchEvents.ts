
import { supabase } from "@/integrations/supabase/client";
import { Event } from "@/types/event";

export const fetchEvents = async () => {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .order('date', { ascending: true });
  
  if (error) {
    console.error('Error fetching events:', error);
    throw error;
  }
  
  // Transform data to match Event type
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
};

export const fetchEvent = async (id: string) => {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error(`Error fetching event with id ${id}:`, error);
    throw error;
  }
  
  // Transform data to match Event type
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
  } as Event;
};
