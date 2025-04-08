
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { UserRole } from "@/types/property";

export function useAdminRole() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  
  useEffect(() => {
    async function checkUserRole() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          setUserId(user.id);
          
          // Fetch the user's profile to get their level (role)
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
          
          if (error) {
            console.error("Error fetching user role:", error);
            setIsLoading(false);
            return;
          }
          
          if (data && data.level) {
            const level = data.level as UserRole;
            setUserRole(level);
            setIsAdmin(['administrator', 'owner'].includes(level));
          }
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
