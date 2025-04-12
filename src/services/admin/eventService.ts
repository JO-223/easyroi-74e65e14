
import { supabase } from "@/integrations/supabase/client";
import { NewEventData } from "@/types/admin";

export const addNewEvent = async (eventData: NewEventData): Promise<void> => {
  const { error } = await supabase.rpc('add_new_event', {
    p_title: eventData.title,
    p_description: eventData.description,
    p_date: eventData.date,
    p_time: eventData.time,
    p_location: eventData.location,
    p_event_type: eventData.eventType,
    p_max_attendees: eventData.maxAttendees,
    p_property_id: eventData.propertyId,
    p_project_id: eventData.projectId,
    p_image_url: eventData.imageUrl,
    p_is_online: eventData.isOnline,
    p_required_badges: eventData.requiredBadges
  });

  if (error) {
    console.error("Error adding new event:", error);
    throw error;
  }
  
  return Promise.resolve();
};
