
import { supabase } from "@/integrations/supabase/client";
import { NewEventData } from "@/types/admin";
import { RpcResponse } from "./utils";

export const addNewEvent = async (eventData: NewEventData): Promise<RpcResponse> => {
  const { data, error } = await supabase.rpc('add_new_event', {
    p_title: eventData.title,
    p_description: eventData.description,
    p_date: eventData.date,
    p_time: eventData.time,
    p_location: eventData.location,
    p_event_type: eventData.eventType,
    p_max_attendees: eventData.maxAttendees || null,
    p_property_id: eventData.propertyId || null,
    p_project_id: eventData.projectId || null,
    p_image_url: eventData.imageUrl || null,
    p_is_online: eventData.isOnline,
    p_required_badges: eventData.requiredBadges || ["bronze", "silver", "gold", "platinum", "diamond"]
  });

  if (error) {
    console.error("Error adding new event:", error);
    return {
      success: false,
      message: error.message
    };
  }

  // Fix: Ensure data is an object before spreading it
  return {
    success: true,
    message: "Event added successfully",
    event_id: data && typeof data === 'object' && 'event_id' in data ? data.event_id : undefined,
    ...((data && typeof data === 'object') ? data : {})
  };
};
