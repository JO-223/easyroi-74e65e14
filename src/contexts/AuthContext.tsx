
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Session, User } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "./LanguageContext";

interface AuthContextType {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
  redirectTo?: string;
}

export const AuthProvider = ({ 
  children, 
  redirectTo = "/login" 
}: AuthProviderProps) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();

  useEffect(() => {
    // First set up the auth state listener to avoid missing events
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log(`Auth state changed: ${event}`);
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        // Handle specific auth events
        if (event === 'SIGNED_OUT') {
          console.log('User signed out');
          // No redirection here - let the signOut function handle it
        } else if (event === 'SIGNED_IN') {
          console.log('User signed in');
        }
      }
    );

    // Then check for existing session
    const initializeAuth = async () => {
      try {
        setIsLoading(true);
        console.log("Initializing auth state");
        
        const { data: { session: currentSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error getting session:", error);
          throw error;
        }

        console.log("Auth initialized, session exists:", !!currentSession);
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        // If on auth-required route with no session, redirect
        if (!currentSession && window.location.pathname.startsWith('/dashboard')) {
          console.log("No session detected - redirecting to", redirectTo);
          navigate(redirectTo);
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        toast({
          title: t('error'),
          description: t('authInitError') || "Unable to initialize authentication",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    // Cleanup subscription when component unmounts
    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, redirectTo, toast, t]);

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      navigate(redirectTo);
    } catch (error) {
      console.error("Error signing out:", error);
      toast({
        title: t('error'),
        description: t('signOutError') || "Unable to sign out",
        variant: "destructive"
      });
    }
  };

  const value: AuthContextType = {
    session,
    user,
    isLoading,
    signOut
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Create a component that requires authentication
export const RequireAuth = ({ 
  children,
  redirectTo = "/login" 
}: {
  children: ReactNode;
  redirectTo?: string;
}) => {
  const { session, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !session) {
      console.log("RequireAuth: No session, redirecting to", redirectTo);
      navigate(redirectTo);
    }
  }, [session, isLoading, navigate, redirectTo]);

  if (isLoading) {
    // Return loading state
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-easyroi-gold border-t-transparent"></div>
      </div>
    );
  }

  if (!session) {
    return null; // Will redirect in the useEffect
  }

  return <>{children}</>;
};
