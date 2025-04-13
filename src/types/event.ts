
export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  event_type: string;
  is_online: boolean;
  image_url?: string;
  max_attendees?: number;
  current_attendees: number;
  property_id?: string;
  project_id?: string;
  average_rating?: number;
  required_badges?: string[];
  created_at?: string;
}

export interface EventReview {
  id: string;
  event_id: string;
  user_id: string;
  rating: number;
  review_title?: string;
  review_content?: string;
  is_verified_attendee: boolean;
  is_anonymous: boolean;
  helpful_votes: number;
  created_at: string;
  updated_at: string;
  user_name?: string;
  user_avatar?: string;
}
