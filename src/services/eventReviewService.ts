
import { supabase } from "@/integrations/supabase/client";
import { EventReview, EventReviewFormData } from "@/types/eventReview";

export async function fetchEventReviews(eventId: string) {
  const { data, error } = await supabase
    .from('event_reviews')
    .select(`
      *,
      profiles:user_id (
        first_name,
        last_name,
        avatar_url,
        level
      )
    `)
    .eq('event_id', eventId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching event reviews:', error);
    throw error;
  }

  return data as (EventReview & { profiles: { first_name: string, last_name: string, avatar_url: string, level: string } })[];
}

export async function submitEventReview(formData: EventReviewFormData, userId: string) {
  // Check if user has already reviewed this event
  const { data: existingReview, error: checkError } = await supabase
    .from('event_reviews')
    .select('id')
    .eq('event_id', formData.event_id)
    .eq('user_id', userId)
    .maybeSingle();

  if (checkError) {
    console.error('Error checking for existing review:', checkError);
    throw checkError;
  }

  // Check if user attended the event to mark as verified
  const { data: attendance, error: attendanceError } = await supabase
    .from('event_attendees')
    .select('id')
    .eq('event_id', formData.event_id)
    .eq('user_id', userId)
    .maybeSingle();

  if (attendanceError) {
    console.error('Error checking attendance:', attendanceError);
    throw attendanceError;
  }

  const isVerifiedAttendee = !!attendance;

  // Update existing review or create new one
  if (existingReview) {
    const { data, error } = await supabase
      .from('event_reviews')
      .update({
        review_title: formData.review_title,
        review_content: formData.review_content,
        rating: formData.rating,
        is_anonymous: formData.is_anonymous,
        updated_at: new Date().toISOString()
      })
      .eq('id', existingReview.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating review:', error);
      throw error;
    }

    return data as EventReview;
  } else {
    const { data, error } = await supabase
      .from('event_reviews')
      .insert({
        event_id: formData.event_id,
        user_id: userId,
        review_title: formData.review_title,
        review_content: formData.review_content,
        rating: formData.rating,
        is_anonymous: formData.is_anonymous,
        is_verified_attendee: isVerifiedAttendee,
        helpful_votes: 0
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating review:', error);
      throw error;
    }

    return data as EventReview;
  }
}

export async function voteReviewHelpful(reviewId: string) {
  const { data, error } = await supabase
    .from('event_reviews')
    .update({
      helpful_votes: supabase.rpc('increment', { x: 1 })
    })
    .eq('id', reviewId)
    .select()
    .single();

  if (error) {
    console.error('Error voting review helpful:', error);
    throw error;
  }

  return data as EventReview;
}

export async function deleteEventReview(reviewId: string, userId: string) {
  // First check if the review belongs to the user
  const { data: review, error: fetchError } = await supabase
    .from('event_reviews')
    .select('user_id')
    .eq('id', reviewId)
    .single();

  if (fetchError) {
    console.error('Error fetching review:', fetchError);
    throw fetchError;
  }

  if (review.user_id !== userId) {
    throw new Error('Unauthorized: Cannot delete another user\'s review');
  }

  const { error } = await supabase
    .from('event_reviews')
    .delete()
    .eq('id', reviewId);

  if (error) {
    console.error('Error deleting review:', error);
    throw error;
  }

  return true;
}
