
import { supabase } from "@/integrations/supabase/client";

export const registerForEvent = async (eventId: string, userId: string, userBadge: string = 'bronze') => {
  // First check if the user is already registered
  const { data: existingRegistration, error: checkError } = await supabase
    .from('event_attendees')
    .select('*')
    .eq('event_id', eventId)
    .eq('user_id', userId)
    .single();
  
  if (checkError && checkError.code !== 'PGRST116') { // PGRST116 is "no rows returned"
    console.error('Error checking registration:', checkError);
    throw checkError;
  }
  
  if (existingRegistration) {
    return { success: false, message: 'You are already registered for this event' };
  }
  
  // Check if event has reached max attendees
  const { data: event, error: eventError } = await supabase
    .from('events')
    .select('max_attendees, current_attendees, required_badges')
    .eq('id', eventId)
    .single();
  
  if (eventError) {
    console.error('Error fetching event:', eventError);
    throw eventError;
  }

  const eventData = event as unknown as {
    max_attendees: number | null;
    current_attendees: number;
    required_badges: string[] | null;
  };
  
  if (eventData.max_attendees !== null && eventData.current_attendees >= eventData.max_attendees) {
    return { success: false, message: 'This event is already at maximum capacity' };
  }
  
  // Check if the user has the required badge
  if (eventData.required_badges && eventData.required_badges.length > 0) {
    if (!eventData.required_badges.includes(userBadge.toLowerCase())) {
      return { success: false, message: 'You do not have the required badge level for this event' };
    }
  }
  
  // Register the user
  const { error: registrationError } = await supabase
    .from('event_attendees')
    .insert([
      { 
        event_id: eventId, 
        user_id: userId, 
        user_badge: userBadge,
        registration_date: new Date().toISOString() 
      }
    ]);
  
  if (registrationError) {
    console.error('Error registering for event:', registrationError);
    throw registrationError;
  }
  
  // Update the event's current_attendees count
  const { error: updateError } = await supabase
    .from('events')
    .update({ current_attendees: eventData.current_attendees + 1 })
    .eq('id', eventId);
  
  if (updateError) {
    console.error('Error updating event attendees count:', updateError);
    throw updateError;
  }
  
  return { success: true, message: 'Successfully registered for the event' };
};

export const cancelEventRegistration = async (eventId: string, userId: string) => {
  // Check if the user is registered
  const { data: existingRegistration, error: checkError } = await supabase
    .from('event_attendees')
    .select('*')
    .eq('event_id', eventId)
    .eq('user_id', userId)
    .single();
  
  if (checkError) {
    console.error('Error checking registration:', checkError);
    throw checkError;
  }
  
  if (!existingRegistration) {
    return { success: false, message: 'You are not registered for this event' };
  }
  
  // Delete the registration
  const { error: deleteError } = await supabase
    .from('event_attendees')
    .delete()
    .eq('event_id', eventId)
    .eq('user_id', userId);
  
  if (deleteError) {
    console.error('Error canceling registration:', deleteError);
    throw deleteError;
  }
  
  // Update the event's current_attendees count
  const { data: event, error: eventError } = await supabase
    .from('events')
    .select('current_attendees')
    .eq('id', eventId)
    .single();
  
  if (eventError) {
    console.error('Error fetching event:', eventError);
    throw eventError;
  }

  const eventData = event as unknown as { current_attendees: number };
  
  const { error: updateError } = await supabase
    .from('events')
    .update({ current_attendees: Math.max(0, eventData.current_attendees - 1) })
    .eq('id', eventId);
  
  if (updateError) {
    console.error('Error updating event attendees count:', updateError);
    throw updateError;
  }
  
  return { success: true, message: 'Successfully canceled your registration' };
};
