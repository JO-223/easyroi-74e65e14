
import { supabase } from '@/integrations/supabase/client';
import { EventReview, EventReviewFormData } from '@/types/eventReview';

type EventReviewWithProfile = EventReview & {
  profiles: {
    first_name: string;
    last_name: string;
    avatar_url: string;
    level: string;
  };
};

/**
 * Fetch reviews for a specific event
 */
export async function fetchEventReviews(eventId: string): Promise<EventReviewWithProfile[]> {
  try {
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
    
    if (error) throw error;
    
    // Type cast the data to the expected format
    return (data || []) as unknown as EventReviewWithProfile[];
  } catch (error) {
    console.error('Error fetching event reviews:', error);
    return [];
  }
}

/**
 * Submit a new review for an event
 */
export async function submitEventReview(
  reviewData: EventReviewFormData,
  userId: string
): Promise<EventReview | null> {
  try {
    // Check if user already reviewed this event
    const { data: existingReview } = await supabase
      .from('event_reviews')
      .select('id')
      .eq('event_id', reviewData.event_id)
      .eq('user_id', userId)
      .maybeSingle();
    
    if (existingReview) {
      // Update existing review instead of creating a new one
      const { data, error } = await supabase
        .from('event_reviews')
        .update({
          rating: reviewData.rating,
          review_title: reviewData.review_title,
          review_content: reviewData.review_content,
          is_anonymous: reviewData.is_anonymous,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingReview.id)
        .select()
        .single();
      
      if (error) throw error;
      return data as unknown as EventReview;
    } else {
      // Check if user attended the event
      const { data: attendee } = await supabase
        .from('event_attendees')
        .select('id')
        .eq('event_id', reviewData.event_id)
        .eq('user_id', userId)
        .maybeSingle();
      
      // Create new review
      const { data, error } = await supabase
        .from('event_reviews')
        .insert({
          event_id: reviewData.event_id,
          user_id: userId,
          rating: reviewData.rating,
          review_title: reviewData.review_title,
          review_content: reviewData.review_content,
          is_anonymous: reviewData.is_anonymous,
          is_verified_attendee: !!attendee
        })
        .select()
        .single();
      
      if (error) throw error;
      return data as unknown as EventReview;
    }
  } catch (error) {
    console.error('Error submitting event review:', error);
    return null;
  }
}

/**
 * Vote a review as helpful
 */
export async function voteReviewHelpful(reviewId: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('event_reviews')
      .update({ helpful_votes: supabase.rpc('increment', { x: 1 }) })
      .eq('id', reviewId)
      .select()
      .single();
      
    if (error) throw error;
    return !!data;
  } catch (error) {
    console.error('Error voting review helpful:', error);
    return false;
  }
}

/**
 * Delete an event review
 */
export async function deleteEventReview(reviewId: string, userId: string): Promise<boolean> {
  try {
    // Only allow users to delete their own reviews
    const { error } = await supabase
      .from('event_reviews')
      .delete()
      .eq('id', reviewId)
      .eq('user_id', userId);
      
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting event review:', error);
    return false;
  }
}
