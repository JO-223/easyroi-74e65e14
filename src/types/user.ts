
import { UserBadge } from "@/components/ui/user-badge";

// User level types
export type UserLevel = 'starter' | 'bronze' | 'silver' | 'gold' | 'ruby' | 'emerald' | 'platinum' | 'diamond';

// User profile data type
export interface UserProfile {
  id: string;
  first_name?: string;
  last_name?: string;
  email: string;
  level?: UserLevel;
  join_date?: string;
  avatar_url?: string;
  total_investment?: number;
}
