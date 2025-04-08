
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BadgeLevel } from "@/components/ui/badge-level";
import { Building2, Globe, Mail, MapPin, Search, UserPlus, UserMinus, MessageCircle, AlertCircle, Eye, EyeOff } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { getNetworkInvestors, sendConnectionRequest, removeConnection, NetworkInvestor, ProfileVisibility } from "@/services/networkService";

// Define the type for investor level to match BadgeLevelProps
type InvestorLevel = 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';

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
          // Get user profile to check visibility
          const { data, error } = await supabase
            .from('profiles')
            .select('visibility')
            .eq('id', user.id)
            .single();
          
          if (!error && data && data.visibility) {
            setUserVisibility(data.visibility as ProfileVisibility);
          }
          
          // Only load investors if the user's profile is not private
          if (!data || data.visibility !== 'private') {
            const networkInvestors = await getNetworkInvestors();
            setInvestors(networkInvestors);
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
        <Card className="border-none shadow-none">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="rounded-full bg-amber-100 p-3 mb-4">
              <EyeOff className="h-6 w-6 text-amber-600" />
            </div>
            <h3 className="text-xl font-medium text-center mb-2">
              {t('privateProfileNetworkRestricted')}
            </h3>
            <p className="text-muted-foreground text-center max-w-md mb-6">
              {t('privateProfileNetworkMessage')}
            </p>
            <Button
              onClick={() => {
                window.location.href = "/dashboard/settings";
              }}
            >
              {t('goToPrivacySettings')}
            </Button>
          </CardContent>
        </Card>
      </DashboardLayout>
    );
  }

  if (isLoading) {
    return (
      <DashboardLayout title={t('investorNetwork')} subtitle={t('connectInvestors')}>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title={t('investorNetwork')} subtitle={t('connectInvestors')}>
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            placeholder={t('searchInvestors')}
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex justify-between items-center mt-4">
          <p className="text-sm text-muted-foreground">
            {filteredInvestors.length} {t('investorsFound')}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredInvestors.map(investor => (
          <Card key={investor.id} className="overflow-hidden">
            <div className="flex justify-end p-3">
              <BadgeLevel level={investor.level as InvestorLevel} />
            </div>
            <CardHeader className="pt-0">
              <div className="flex items-center space-x-4">
                <div className="h-16 w-16 rounded-full overflow-hidden bg-gray-100">
                  <img
                    src={investor.avatar_url || '/placeholder.svg'}
                    alt={investor.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <CardTitle className="text-lg">{investor.name}</CardTitle>
                  <CardDescription>{investor.role || t('investor')}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {investor.location && (
                  <div className="flex items-center text-sm">
                    <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>{investor.location}</span>
                  </div>
                )}
                <div className="mt-3">
                  <p className="text-sm text-gray-600">{investor.bio || t('noBioAvailable')}</p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex gap-2">
              <Button 
                variant="outline" 
                className="flex-1" 
                onClick={() => handleMessage(investor.id, investor.name)}
              >
                <MessageCircle className="mr-2 h-4 w-4" /> {t('message')}
              </Button>
              {investor.connection_status === 'connected' ? (
                <Button 
                  variant="outline"
                  className="flex-1 text-red-500 hover:text-red-600 hover:bg-red-50"
                  onClick={() => handleDisconnect(investor.id, investor.name)}
                >
                  <UserMinus className="mr-2 h-4 w-4" /> {t('disconnect')}
                </Button>
              ) : investor.connection_status === 'pending' ? (
                <Button 
                  disabled
                  className="flex-1 bg-slate-100 text-slate-500"
                >
                  <AlertCircle className="mr-2 h-4 w-4" /> {t('pending')}
                </Button>
              ) : (
                <Button 
                  className="flex-1 bg-easyroi-navy hover:bg-easyroi-navy/90" 
                  onClick={() => handleConnect(investor.id, investor.name)}
                >
                  <UserPlus className="mr-2 h-4 w-4" /> {t('connect')}
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default Network;
