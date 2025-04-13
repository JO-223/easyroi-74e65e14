
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

export interface UserRole {
  id: string;
  name: "admin" | "investor" | "agent";
}

export interface AdminRoleResult {
  isAdmin: boolean;
  isLoading: boolean;
  error: Error | null;
}

export function useAdminRole(): AdminRoleResult {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    async function checkAdminRole() {
      if (!user?.id) {
        setIsAdmin(false);
        setIsLoading(false);
        return;
      }

      try {
        // Check if the user has the admin role
        const { data, error } = await supabase
          .from("user_roles")
          .select("*")
          .eq("user_id", user.id)
          .eq("role_name", "admin")
          .single();

        if (error && error.code !== "PGRST116") {
          // PGRST116 is "row not found", which is expected if they're not an admin
          console.error("Error checking admin role:", error);
          setError(new Error(error.message));
        }

        const hasAdminRole = !!data;
        setIsAdmin(hasAdminRole);
        
        // Store the admin status in localStorage for quick checks
        if (hasAdminRole) {
          localStorage.setItem("easyroi_admin", "true");
        } else {
          localStorage.removeItem("easyroi_admin");
        }
      } catch (err) {
        console.error("Error in useAdminRole:", err);
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    }

    checkAdminRole();
  }, [user?.id]);

  // Also check localStorage for quick admin status verification
  useEffect(() => {
    const adminStatus = localStorage.getItem("easyroi_admin") === "true";
    if (adminStatus) setIsAdmin(true);
  }, []);

  return { isAdmin, isLoading, error };
}
