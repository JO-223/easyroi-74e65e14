
import { supabase } from "@/integrations/supabase/client";

export type UserActivity = {
  id: string;
  activity_type: string;
  description: string;
  created_at: string;
  related_id?: string | null;
};

/**
 * Fetches recent activities for the current logged in user
 * @param limit Number of activities to fetch (default 5)
 */
export async function fetchUserRecentActivities(limit = 5): Promise<UserActivity[]> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return [];
    
    const { data, error } = await supabase
      .from('user_activities')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(limit);
      
    if (error) {
      console.error("Error fetching recent activities:", error);
      return [];
    }
    
    return data as UserActivity[];
  } catch (error) {
    console.error("Failed to fetch recent activities:", error);
    return [];
  }
}

/**
 * Format activity date to relative time (e.g. "2 days ago")
 */
export function formatActivityDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    return "Today";
  } else if (diffDays === 1) {
    return "Yesterday";
  } else if (diffDays < 7) {
    return `${diffDays} days ago`;
  } else if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
  } else {
    const months = Math.floor(diffDays / 30);
    return `${months} ${months === 1 ? 'month' : 'months'} ago`;
  }
}
