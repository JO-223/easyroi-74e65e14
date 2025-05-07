
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
  isInitialized: boolean;
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
  const [isInitialized, setIsInitialized] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();

  useEffect(() => {
    // Prevent multiple initializations
    if (isInitialized) return;

    let isMounted = true;
    console.log("Initializing auth state");
    
    // First set up the auth state listener to avoid missing events
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        if (!isMounted) return;
        
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
        
        const { data: { session: currentSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error getting session:", error);
          throw error;
        }

        console.log("Auth initialized, session exists:", !!currentSession);
        
        // Only update state if component is still mounted
        if (isMounted) {
          setSession(currentSession);
          setUser(currentSession?.user ?? null);
          setIsInitialized(true);
          
          // Only redirect on auth-required routes with no session
          if (!currentSession && window.location.pathname.startsWith('/dashboard')) {
            // Exclude settings page from immediate redirection to prevent loops
            if (window.location.pathname !== '/dashboard/settings') {
              console.log("No session detected - redirecting to", redirectTo);
              navigate(redirectTo);
            }
          }
          
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        if (isMounted) {
          toast({
            title: t('error'),
            description: t('authInitError') || "Unable to initialize authentication",
            variant: "destructive"
          });
          setIsInitialized(true);
          setIsLoading(false);
        }
      }
    };

    initializeAuth();

    // Cleanup subscription when component unmounts
    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [navigate, redirectTo, toast, t, isInitialized]);

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
    isInitialized,
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
  const { session, isLoading, isInitialized } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isInitialized && !isLoading && !session) {
      console.log("RequireAuth: No session, redirecting to", redirectTo);
      navigate(redirectTo);
    }
  }, [session, isLoading, isInitialized, navigate, redirectTo]);

  if (isLoading && !isInitialized) {
    // Return loading state
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-easyroi-gold border-t-transparent"></div>
      </div>
    );
  }

  if (!session && isInitialized) {
    return null; // Will redirect in the useEffect
  }

  return <>{children}</>;
};
