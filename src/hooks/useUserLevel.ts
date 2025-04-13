
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { UserLevel } from "@/components/ui/user-badge";

export function useUserLevel(userId?: string) {
  const { data: userLevel, isLoading, error } = useQuery({
    queryKey: ['userLevel', userId],
    queryFn: async () => {
      if (!userId) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return null;
        userId = user.id;
      }
      
      const { data, error } = await supabase
        .from('profiles')
        .select('level')
        .eq('id', userId)
        .single();
        
      if (error) {
        console.error('Error fetching user level:', error);
        return null;
      }
      
      return data?.level as UserLevel || null;
    },
    enabled: !!userId || typeof userId === 'undefined', // Consente la query quando userId non è fornito
  });

  return { userLevel, isLoading, error };
}
