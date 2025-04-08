
import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { NetworkInvestor } from "@/services/network/types";
import { sendConnectionRequest, removeConnection } from "@/services/network";
import { supabase } from "@/integrations/supabase/client";

interface NetworkConnectionManagerProps {
  investors: NetworkInvestor[];
  setInvestors: React.Dispatch<React.SetStateAction<NetworkInvestor[]>>;
}

export function NetworkConnectionManager({ 
  investors, 
  setInvestors 
}: NetworkConnectionManagerProps) {
  const { toast } = useToast();
  const { t } = useLanguage();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  
  // Check authentication state
  React.useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
      
      // Subscribe to auth changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        (_event, session) => {
          setIsAuthenticated(!!session);
        }
      );
      
      return () => {
        subscription.unsubscribe();
      };
    };
    
    checkAuth();
  }, []);

  const handleConnect = async (investorId: string, investorName: string) => {
    if (!isAuthenticated) {
      toast({
        title: t('authRequired'),
        description: t('pleaseLoginToConnect'),
        variant: "destructive"
      });
      return;
    }
    
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
    if (!isAuthenticated) {
      toast({
        title: t('authRequired'),
        description: t('pleaseLoginToDisconnect'),
        variant: "destructive"
      });
      return;
    }
    
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
    if (!isAuthenticated) {
      toast({
        title: t('authRequired'),
        description: t('pleaseLoginToMessage'),
        variant: "destructive"
      });
      return;
    }
    
    // The actual messaging is now handled in the NetworkInvestorCard component
    // with the NetworkMessageDialog
  };

  return {
    handleConnect,
    handleDisconnect,
    handleMessage,
    isAuthenticated
  };
}
