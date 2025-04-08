
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { 
  getNetworkInvestors, 
  NetworkInvestor, 
  ProfileVisibility 
} from "@/services/network";

export function useNetworkData() {
  const [searchQuery, setSearchQuery] = useState("");
  const [userVisibility, setUserVisibility] = useState<ProfileVisibility>("public");
  const [investors, setInvestors] = useState<NetworkInvestor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { t } = useLanguage();

  useEffect(() => {
    // Load user's profile visibility setting and network investors
    const loadNetworkData = async () => {
      try {
        setIsLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          // Get user profile to check visibility using RPC
          const { data: profileData, error: profileError } = await supabase.rpc(
            'get_user_profile_visibility',
            { p_user_id: user.id }
          );
          
          if (!profileError && profileData && Array.isArray(profileData) && profileData.length > 0) {
            const visibility = profileData[0]?.visibility as ProfileVisibility || 'public';
            setUserVisibility(visibility);
            
            // Only load investors if the user's profile is not private
            if (visibility !== 'private') {
              const networkInvestors = await getNetworkInvestors();
              setInvestors(networkInvestors);
            }
          } else {
            // Fallback to direct query
            try {
              const { data, error } = await supabase.rpc(
                'get_profile_by_id',
                { p_user_id: user.id }
              );
                
              if (!error && data && Array.isArray(data) && data.length > 0) {
                const visibility = data[0].visibility as ProfileVisibility || 'public';
                setUserVisibility(visibility);
                
                // Only load investors if the user's profile is not private
                if (visibility !== 'private') {
                  const networkInvestors = await getNetworkInvestors();
                  setInvestors(networkInvestors);
                }
              } else {
                // Default to loading investors if we can't determine visibility
                const networkInvestors = await getNetworkInvestors();
                setInvestors(networkInvestors);
              }
            } catch (error) {
              console.error("Error in fallback profile query:", error);
              const networkInvestors = await getNetworkInvestors();
              setInvestors(networkInvestors);
            }
          }
        }
      } catch (error) {
        console.error("Error loading network data:", error);
        toast({
          title: t('error'),
          description: t('networkDataError'),
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadNetworkData();
  }, [toast, t]);

  // Filter the investors based on search query
  const filteredInvestors = investors.filter(investor => 
    investor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    investor.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    investor.bio?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return {
    searchQuery,
    setSearchQuery,
    userVisibility,
    investors,
    setInvestors,
    filteredInvestors,
    isLoading
  };
}
