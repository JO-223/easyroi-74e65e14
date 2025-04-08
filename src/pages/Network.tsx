
import React, { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { 
  getNetworkInvestors, 
  sendConnectionRequest, 
  removeConnection, 
  NetworkInvestor, 
  ProfileVisibility 
} from "@/services/network";
import { NetworkSearchBar } from "@/components/network/NetworkSearchBar";
import { NetworkInvestorCard } from "@/components/network/NetworkInvestorCard";
import { NetworkEmpty } from "@/components/network/NetworkEmpty";
import { NetworkLoading } from "@/components/network/NetworkLoading";

const Network = () => {
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
          ) as { data: any[] | null, error: any };
          
          if (!profileError && profileData && profileData.length > 0) {
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
              ) as { data: any[] | null, error: any };
                
              if (!error && data && data.length > 0) {
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

  const filteredInvestors = investors
    .filter(investor => 
      investor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      investor.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      investor.bio?.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const handleConnect = async (investorId: string, investorName: string) => {
    try {
      const success = await sendConnectionRequest(investorId);
      
      if (success) {
        // Update local state
        setInvestors(currentInvestors => 
          currentInvestors.map(investor => 
            investor.id === investorId 
              ? { ...investor, connection_status: 'pending' } 
              : investor
          )
        );
        
        toast({
          title: t('connectionSent'),
          description: `${t('connectionSentMsg')} ${investorName}.`,
        });
      } else {
        throw new Error("Failed to send connection request");
      }
    } catch (error) {
      console.error("Error sending connection request:", error);
      toast({
        title: t('error'),
        description: t('connectionRequestError'),
        variant: "destructive"
      });
    }
  };

  const handleDisconnect = async (investorId: string, investorName: string) => {
    try {
      const success = await removeConnection(investorId);
      
      if (success) {
        // Update local state
        setInvestors(currentInvestors => 
          currentInvestors.map(investor => 
            investor.id === investorId 
              ? { ...investor, connection_status: 'none' } 
              : investor
          )
        );
        
        toast({
          title: t('connectionRemoved'),
          description: `${t('connectionRemovedMsg')} ${investorName}.`,
        });
      } else {
        throw new Error("Failed to remove connection");
      }
    } catch (error) {
      console.error("Error removing connection:", error);
      toast({
        title: t('error'),
        description: t('connectionRemoveError'),
        variant: "destructive"
      });
    }
  };

  const handleMessage = (investorId: string, investorName: string) => {
    toast({
      title: t('messageCenter'),
      description: `${t('openingConversation')} ${investorName}.`,
    });
  };

  // If user has private profile, show message
  if (userVisibility === 'private') {
    return (
      <DashboardLayout title={t('investorNetwork')} subtitle={t('connectInvestors')}>
        <NetworkEmpty />
      </DashboardLayout>
    );
  }

  if (isLoading) {
    return (
      <DashboardLayout title={t('investorNetwork')} subtitle={t('connectInvestors')}>
        <NetworkLoading />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title={t('investorNetwork')} subtitle={t('connectInvestors')}>
      <NetworkSearchBar 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        resultsCount={filteredInvestors.length}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredInvestors.map(investor => (
          <NetworkInvestorCard
            key={investor.id}
            investor={investor}
            onConnect={handleConnect}
            onDisconnect={handleDisconnect}
            onMessage={handleMessage}
          />
        ))}
      </div>
    </DashboardLayout>
  );
};

export default Network;
