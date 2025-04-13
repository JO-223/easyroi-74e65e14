
import { supabase } from '@/integrations/supabase/client';
import { EventReview, EventReviewFormData } from '@/types/eventReview';

/**
 * Fetch reviews for a specific event
 */
export async function fetchReviews(eventId: string): Promise<EventReview[]> {
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
    
    // Transform data to match EventReview type
    return (data || []).map(item => {
      const profile = item.profiles || {};
      return {
        id: String(item.id),
        event_id: String(item.event_id),
        user_id: String(item.user_id),
        rating: Number(item.rating),
        review_title: item.review_title,
        review_content: item.review_content,
        is_verified_attendee: Boolean(item.is_verified_attendee),
        is_anonymous: Boolean(item.is_anonymous),
        helpful_votes: Number(item.helpful_votes),
        created_at: String(item.created_at),
        updated_at: item.updated_at ? String(item.updated_at) : undefined,
        user_name: item.is_anonymous ? undefined : `${profile.first_name || ''} ${profile.last_name || ''}`.trim(),
        user_avatar: item.is_anonymous ? undefined : profile.avatar_url
      };
    });
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
      return transformEventReview(data);
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
      return transformEventReview(data);
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
    const { data, error } = await supabase.rpc('increment_review_helpful_votes', {
      review_id: reviewId
    });
      
    if (error) throw error;
    return true;
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

// Helper to transform database response to EventReview type
function transformEventReview(data: any): EventReview {
  return {
    id: String(data.id),
    event_id: String(data.event_id),
    user_id: String(data.user_id),
    rating: Number(data.rating),
    review_title: data.review_title,
    review_content: data.review_content,
    is_verified_attendee: Boolean(data.is_verified_attendee),
    is_anonymous: Boolean(data.is_anonymous),
    helpful_votes: Number(data.helpful_votes),
    created_at: String(data.created_at),
    updated_at: data.updated_at ? String(data.updated_at) : undefined
  };
}
