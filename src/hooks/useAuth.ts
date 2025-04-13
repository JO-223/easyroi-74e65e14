// Add UserDetails type to hook
import { useState, useEffect, createContext, useContext } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from '@supabase/supabase-js';

export interface UserDetails {
  id: string;
  email: string;
  level?: string;
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
}

export interface AuthContextType {
  user: User | null;
  userDetails?: UserDetails;
  session: Session | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
	const [userDetails, setUserDetails] = useState<UserDetails | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      setSession(session);
      setUser(session?.user ?? null);
			
			if (session?.user) {
				await fetchUserDetails(session.user.id);
			}
      setIsLoading(false);
    };

    loadSession();

    supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
			
			if (session?.user) {
				await fetchUserDetails(session.user.id);
			}
    });
  }, []);
	
	const fetchUserDetails = async (userId: string) => {
		try {
			const { data, error } = await supabase
				.from('profiles')
				.select('id, email, level, first_name, last_name, avatar_url')
				.eq('id', userId)
				.single();
			
			if (error) {
				console.error('Error fetching user details:', error);
				return;
			}
			
			setUserDetails(data as UserDetails);
		} catch (error) {
			console.error('Error fetching user details:', error);
		}
	};

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signUp({ email, password, options: { data: { email } } });
      if (error) throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
			setUserDetails(undefined);
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/update-password`,
      });
      if (error) throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
		userDetails,
    session,
    isLoading,
    signIn,
    signUp,
    signOut,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within a AuthProvider");
  }
  return context;
};
