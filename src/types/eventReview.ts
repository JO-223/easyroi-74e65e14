
export interface EventReview {
  id: string;
  event_id: string;
  user_id: string;
  review_title?: string;
  review_content?: string;
  rating: number;
  is_anonymous: boolean;
  is_verified_attendee: boolean;
  helpful_votes: number;
  created_at: string;
  updated_at?: string;
}

export interface EventReviewFormData {
  event_id: string;
  review_title?: string;
  review_content?: string;
  rating: number;
  is_anonymous: boolean;
}
