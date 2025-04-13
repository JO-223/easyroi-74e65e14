import { createContext, useState, useEffect, useContext, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AuthError, User } from "@supabase/supabase-js";
import { PostgrestError } from "@supabase/supabase-js";

export interface UserDetails {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  level?: string;
  role?: string;
  avatar?: string;
}

export interface AuthContextType {
  user: User | null;
  userDetails: UserDetails | null;
  isLoading: boolean;
  authError: AuthError | null;
  isAdmin: boolean;
  isOwner: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  signUp: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userDetails: null,
  isLoading: true,
  authError: null,
  isAdmin: false,
  isOwner: false,
  signIn: async () => {},
  signOut: async () => {},
  signUp: async () => {},
  resetPassword: async () => {}
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState<AuthError | null>(null);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      setUser(session?.user ?? null);
      if (session?.user) {
        await fetchUserDetails(session.user.id);
      }
      setIsLoading(false);
    };

    getSession();

    supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        await fetchUserDetails(session.user.id);
      } else {
        setUserDetails(null);
      }
      setIsLoading(false);
    });
  }, []);

  const fetchUserDetails = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, email, firstName, lastName, level, role, avatar')
        .eq('id', userId)
        .single();

      if (error) {
        console.error("Error fetching user details:", error);
        setAuthError({
          name: error.code,
          message: error.message,
          status: 400,
          __isAuthError: true
        } as AuthError);
      } else {
        setUserDetails({
          id: String(data.id),
          email: String(data.email),
          firstName: data.firstName ? String(data.firstName) : undefined,
          lastName: data.lastName ? String(data.lastName) : undefined,
          level: data.level ? String(data.level) : undefined,
          role: data.role ? String(data.role) : undefined,
          avatar: data.avatar ? String(data.avatar) : undefined,
        });
      }
    } catch (error: any) {
      console.error("Unexpected error fetching user details:", error);
      setAuthError({
        name: 'Unknown error',
        message: error.message || 'Unknown error occurred',
        status: 500,
        __isAuthError: true
      } as AuthError);
    }
  };

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    setAuthError(null);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setAuthError(error);
      } else {
        setUser(data.user);
        await fetchUserDetails(data.user?.id as string);
      }
    } catch (error: any) {
      setAuthError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, firstName: string, lastName: string) => {
    setIsLoading(true);
    setAuthError(null);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            firstName: firstName,
            lastName: lastName,
          },
        },
      });

      if (error) {
        setAuthError(error);
      } else {
        setUser(data.user);
        await fetchUserDetails(data.user?.id as string);
      }
    } catch (error: any) {
      setAuthError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    setAuthError(null);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        setAuthError(error);
      }
    } catch (error: any) {
      setAuthError(error);
    } finally {
      setUser(null);
      setUserDetails(null);
      setIsLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    setIsLoading(true);
    setAuthError(null);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/update-password`,
      });
      if (error) {
        setAuthError(error);
      }
    } catch (error: any) {
      setAuthError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const isAdmin = userDetails?.role === 'admin';
  const isOwner = userDetails?.role === 'owner';

  const value: AuthContextType = {
    user,
    userDetails,
    isLoading,
    authError,
    isAdmin,
    isOwner,
    signIn,
    signUp,
    signOut,
    resetPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
