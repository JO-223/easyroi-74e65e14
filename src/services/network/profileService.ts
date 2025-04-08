
import { supabase } from "@/integrations/supabase/client";
import { ProfileData, NetworkInvestor } from "./types";

/**
 * Fetches network investors with visibility filters applied
 */
export async function getNetworkInvestors(): Promise<NetworkInvestor[]> {
  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];
    
    // Use a stored procedure to get network investors
    const { data, error } = await supabase.rpc('get_network_investors');
    
    if (error) {
      console.error("RPC error:", error);
      // Fallback to direct query using RPC for profiles
      try {
        // Get visible profiles
        const { data: profilesData, error: profilesError } = await supabase.rpc(
          'get_visible_profiles',
          { p_current_user_id: user.id }
        );
        
        if (profilesError) throw profilesError;
        if (!profilesData || !Array.isArray(profilesData)) return [];
        
        // Format data to match NetworkInvestor interface with explicit type assertion
        const investorData = profilesData.map((profile: any) => ({
          id: profile.id as string,
          name: `${profile.first_name as string || ''} ${profile.last_name as string || ''}`.trim() || 'Unknown User',
          email: profile.visibility === 'public' ? profile.email as string : '',
          level: (profile.level as any) || 'bronze',
          location: profile.location as string || '',
          bio: profile.bio as string || '',
          avatar_url: profile.avatar_url as string || '/placeholder.svg',
          join_date: profile.join_date as string,
          connection_status: 'none' as 'none' | 'pending' | 'connected'
        })) as NetworkInvestor[];
        
        // Check connection status separately via RPC
        const { data: connectionsData, error: connectionsError } = await supabase.rpc(
          'get_user_connections',
          { p_user_id: user.id }
        );
        
        if (connectionsError) {
          console.error("Error fetching connections:", connectionsError);
          return investorData;
        }
        
        // Update connection status with type safety
        if (connectionsData && Array.isArray(connectionsData) && connectionsData.length > 0) {
          connectionsData.forEach((connection: any) => {
            const userId = connection.user_id as string;
            const status = connection.status as string;
            
            const investorIndex = investorData.findIndex(inv => inv.id === userId);
            if (investorIndex !== -1) {
              investorData[investorIndex].connection_status = status === 'accepted' 
                ? 'connected' 
                : status === 'pending' 
                  ? 'pending' 
                  : 'none';
            }
          });
        }
        
        return investorData;
      } catch (fallbackError) {
        console.error("Fallback error:", fallbackError);
        return [];
      }
    }
    
    // Return the RPC result directly if it worked, ensuring it's an array
    return Array.isArray(data) ? data as NetworkInvestor[] : [];
  } catch (error) {
    console.error('Error fetching network investors:', error);
    return [];
  }
}
