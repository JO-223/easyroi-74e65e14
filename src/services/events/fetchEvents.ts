
import { supabase } from "@/integrations/supabase/client";
import { Event } from "@/types/property";

export const fetchEvents = async () => {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .order('date', { ascending: true });
  
  if (error) {
    console.error('Error fetching events:', error);
    throw error;
  }
  
  // Assicuriamoci che ogni evento abbia un'immagine predefinita di fallback se manca l'URL
  const eventsWithImages = data?.map(event => ({
    ...event,
    image_url: event.image_url || getFallbackImageForEventType(event.event_type as string)
  })) || [];
  
  return eventsWithImages as Event[];
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
  
  // Assicuriamoci che l'evento abbia un'immagine predefinita di fallback se manca l'URL
  const eventWithImage = {
    ...data,
    image_url: data.image_url || getFallbackImageForEventType(data.event_type as string)
  };
  
  return eventWithImage as Event;
};

// Funzione per fornire un'immagine predefinita in base al tipo di evento
const getFallbackImageForEventType = (eventType: string): string => {
  const fallbackImages = {
    networking: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=2074&auto=format&fit=crop',
    presentation: 'https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?q=80&w=2074&auto=format&fit=crop',
    workshop: 'https://images.unsplash.com/photo-1507537297725-24a1c029d3ca?q=80&w=2087&auto=format&fit=crop',
    propertyTour: 'https://images.unsplash.com/photo-1628744448840-b38439a148a3?q=80&w=2080&auto=format&fit=crop',
    investmentSeminar: 'https://images.unsplash.com/photo-1560523160-754a9e25c68f?q=80&w=2036&auto=format&fit=crop',
    webinar: 'https://images.unsplash.com/photo-1542744173-05336fcc7ad4?q=80&w=2102&auto=format&fit=crop'
  } as Record<string, string>;
  
  return fallbackImages[eventType] || 'https://images.unsplash.com/photo-1618044733300-9472054094ee?q=80&w=2071&auto=format&fit=crop';
};

