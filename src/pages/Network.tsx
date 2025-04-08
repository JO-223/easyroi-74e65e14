
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

// Define the type for investor level to match BadgeLevelProps
type InvestorLevel = 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
type ProfileVisibility = 'public' | 'semi-public' | 'private';

interface Investor {
  id: number;
  name: string;
  level: InvestorLevel;
  role: string;
  location: string;
  properties: number;
  bio: string;
  interests: string[];
  profileImage: string;
  visibility?: ProfileVisibility;
  isConnected?: boolean;
  connectionPending?: boolean;
}

// Sample investor data
const investors = [
  {
    id: 1,
    name: "David Chen",
    level: "platinum" as InvestorLevel,
    role: "Real Estate Developer",
    location: "Singapore",
    properties: 12,
    bio: "Specializes in luxury hotels and resorts across Asia.",
    interests: ["Hospitality", "Commercial"],
    profileImage: "/placeholder.svg",
  },
  {
    id: 2,
    name: "Sophia Rossi",
    level: "gold" as InvestorLevel,
    role: "Investment Fund Manager",
    location: "Milan, Italy",
    properties: 8,
    bio: "Focuses on historic properties in European city centers.",
    interests: ["Residential", "Historic"],
    profileImage: "/placeholder.svg",
  },
  {
    id: 3,
    name: "Michael Berman",
    level: "gold" as InvestorLevel,
    role: "Family Office Director",
    location: "New York, USA",
    properties: 6,
    bio: "Manages real estate investments for high net worth families.",
    interests: ["Commercial", "Residential"],
    profileImage: "/placeholder.svg",
  },
  {
    id: 4,
    name: "Amina Al-Farsi",
    level: "platinum" as InvestorLevel,
    role: "Property Investor",
    location: "Dubai, UAE",
    properties: 14,
    bio: "Specializes in luxury apartments and villas in the UAE.",
    interests: ["Luxury", "Residential"],
    profileImage: "/placeholder.svg",
  },
  {
    id: 5,
    name: "Robert Johnson",
    level: "silver" as InvestorLevel,
    role: "Architect & Investor",
    location: "London, UK",
    properties: 4,
    bio: "Focuses on sustainable urban developments.",
    interests: ["Sustainable", "Mixed-Use"],
    profileImage: "/placeholder.svg",
  },
  {
    id: 6,
    name: "Isabella Martinez",
    level: "gold" as InvestorLevel,
    role: "Hospitality Executive",
    location: "Madrid, Spain",
    properties: 7,
    bio: "Specializes in boutique hotels and vacation properties.",
    interests: ["Hospitality", "Vacation"],
    profileImage: "/placeholder.svg",
  },
];

const Network = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [userVisibility, setUserVisibility] = useState<ProfileVisibility>("public");
  const { toast } = useToast();
  const { t } = useLanguage();
  const [connections, setConnections] = useState<{[key: number]: boolean}>({});
  const [pendingConnections, setPendingConnections] = useState<{[key: number]: boolean}>({});

  useEffect(() => {
    // Load user's profile visibility setting
    const loadUserSettings = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data, error } = await supabase
            .from('profiles')
            .select('visibility')
            .eq('id', user.id)
            .single();
          
          if (!error && data) {
            setUserVisibility(data.visibility || 'public');
          }
          
          // Load connections data using RPC or CAST for type safety
          const { data: connectionsData, error: connectionsError } = await supabase.rpc(
            'get_user_connections',
            { user_id: user.id }
          ).catch(() => {
            // If RPC doesn't exist, fallback to direct query with type casting
            return supabase
              .from('connections')
              .select('to_user_id, status')
              .eq('from_user_id', user.id);
          });
          
          if (!connectionsError && connectionsData) {
            const connectedMap: {[key: number]: boolean} = {};
            const pendingMap: {[key: number]: boolean} = {};
            
            connectionsData.forEach((connection: any) => {
              if (connection.status === 'accepted') {
                connectedMap[connection.to_user_id] = true;
              } else if (connection.status === 'pending') {
                pendingMap[connection.to_user_id] = true;
              }
            });
            
            setConnections(connectedMap);
            setPendingConnections(pendingMap);
          }
        }
      } catch (error) {
        console.error("Error loading user settings:", error);
      }
    };
    
    loadUserSettings();
  }, []);

  const filteredInvestors = investors
    .filter(investor => 
      investor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      investor.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      investor.interests.some(interest => interest.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .map(investor => ({
      ...investor,
      isConnected: connections[investor.id] || false,
      connectionPending: pendingConnections[investor.id] || false
    }));

  const handleConnect = async (investorId: number, investorName: string) => {
    // In a real app, this would interact with Supabase to create a connection request
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Insert a new connection request using RPC or direct insert
        const { error } = await supabase.rpc(
          'create_connection',
          { from_id: user.id, to_id: investorId.toString() }
        ).catch(() => {
          // Fallback to direct insert
          return supabase.from('connections').insert({
            from_user_id: user.id,
            to_user_id: investorId.toString(),
            status: 'pending'
          });
        });
        
        if (error) throw error;
        
        // Update local state
        setPendingConnections({
          ...pendingConnections,
          [investorId]: true
        });
        
        toast({
          title: t('connectionSent'),
          description: `${t('connectionSentMsg')} ${investorName}.`,
        });
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

  const handleDisconnect = async (investorId: number, investorName: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Delete the connection using RPC or direct delete
        const { error } = await supabase.rpc(
          'delete_connection',
          { from_id: user.id, to_id: investorId.toString() }
        ).catch(() => {
          // Fallback to direct delete
          return supabase
            .from('connections')
            .delete()
            .match({ 
              from_user_id: user.id, 
              to_user_id: investorId.toString() 
            });
        });
          
        if (error) throw error;
        
        // Update local state
        const newConnections = { ...connections };
        delete newConnections[investorId];
        setConnections(newConnections);
        
        toast({
          title: t('connectionRemoved'),
          description: `${t('connectionRemovedMsg')} ${investorName}.`,
        });
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

  const handleMessage = (investorId: number, investorName: string) => {
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
                // Navigate to settings
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
              <BadgeLevel level={investor.level} />
            </div>
            <CardHeader className="pt-0">
              <div className="flex items-center space-x-4">
                <div className="h-16 w-16 rounded-full overflow-hidden bg-gray-100">
                  <img
                    src={investor.profileImage}
                    alt={investor.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <CardTitle className="text-lg">{investor.name}</CardTitle>
                  <CardDescription>{investor.role}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center text-sm">
                  <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>{investor.location}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Building2 className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>{investor.properties} {t('properties_count')}</span>
                </div>
                <div className="mt-3">
                  <p className="text-sm text-gray-600">{investor.bio}</p>
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  {investor.interests.map(interest => (
                    <Badge key={interest} variant="outline">{interest}</Badge>
                  ))}
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
              {investor.isConnected ? (
                <Button 
                  variant="outline"
                  className="flex-1 text-red-500 hover:text-red-600 hover:bg-red-50"
                  onClick={() => handleDisconnect(investor.id, investor.name)}
                >
                  <UserMinus className="mr-2 h-4 w-4" /> {t('disconnect')}
                </Button>
              ) : investor.connectionPending ? (
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
