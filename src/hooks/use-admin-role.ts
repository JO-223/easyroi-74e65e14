import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { UserRole } from "@/types/property";

// Create a helper function to check if a role is an admin role
export function isAdminRole(role: string | null): boolean {
  return ['administrator', 'owner'].includes(role as string);
}

// Cache the user role to prevent refetching
let cachedUserRole: {
  role: UserRole | null;
  userId: string | null;
  isAdmin: boolean;
} | null = null;

export function useAdminRole() {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  
  useEffect(() => {
    async function checkUserRole() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setIsLoading(false);
          return;
        }
        
        // If we have a cached role for this user, use it
        if (cachedUserRole && cachedUserRole.userId === user.id) {
          setIsAdmin(cachedUserRole.isAdmin);
          setUserRole(cachedUserRole.role);
          setUserId(cachedUserRole.userId);
          setIsLoading(false);
          return;
        }
        
        // Otherwise, fetch the user's profile
        setUserId(user.id);
        
        const { data, error } = await supabase
          .from('profiles')
          .select('level')
          .eq('id', user.id)
          .single();
        
        if (error) {
          console.error("Error fetching user role:", error);
          setIsLoading(false);
          return;
        }
        
        if (data && data.level) {
          const level = data.level as UserRole;
          const adminStatus = isAdminRole(level);
          
          // Cache the result
          cachedUserRole = {
            role: level,
            userId: user.id,
            isAdmin: adminStatus
          };
          
          setUserRole(level);
          setIsAdmin(adminStatus);
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error("Error checking user role:", error);
        setIsLoading(false);
      }
    }
    
    checkUserRole();
  }, []);
  
  return { isAdmin, userRole, isLoading, userId };
}
