
export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  is_online: boolean;
  max_attendees: number | null;
  current_attendees: number;
  event_type: string;
  required_level: string | null;
  created_by: string;
  image_url?: string;
  property_id?: string;
  project_id?: string;
  average_rating?: number;
  // Add missing properties
  required_badges?: string[];
}
