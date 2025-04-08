
import { UserRole } from "@/types/property";

export type ProfileVisibility = 'public' | 'semi-public' | 'private';

export interface ProfileData {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string;
  phone: string | null;
  level: UserRole | null;
  bio: string | null;
  location: string | null;
  avatar_url: string | null;
  visibility: ProfileVisibility;
  join_date: string;
}

export interface ConnectionData {
  id: string;
  from_user_id: string;
  to_user_id: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  updated_at: string;
}

export interface MessageData {
  id: string;
  sender_id: string;
  recipient_id: string;
  content: string;
  read: boolean;
  created_at: string;
  updated_at: string;
  sender_name?: string;
  recipient_name?: string;
}

export interface NetworkInvestor {
  id: string;
  name: string;
  email: string;
  level: UserRole;
  role?: string;
  location?: string;
  bio?: string;
  avatar_url?: string;
  join_date: string;
  connection_status?: 'none' | 'pending' | 'connected';
}
