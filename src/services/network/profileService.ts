
import { supabase } from "@/integrations/supabase/client";
import { ProfileData, NetworkInvestor, ProfileVisibility } from "./types";

/**
 * Fetches network investors with visibility filters applied
 */
export async function getNetworkInvestors(): Promise<NetworkInvestor[]> {
  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];
    
    // Use a stored procedure to get network investors
    const { data, error } = await supabase.rpc(
      'get_network_investors'
    );
    
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
        if (!profilesData) return [];
        
        // Format data to match NetworkInvestor interface
        const investorData = (profilesData as any[]).map((profile: any) => ({
          id: profile.id,
          name: `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Unknown User',
          email: profile.visibility === 'public' ? profile.email : '',
          level: (profile.level as any) || 'bronze',
          location: profile.location || '',
          bio: profile.bio || '',
          avatar_url: profile.avatar_url || '/placeholder.svg',
          join_date: profile.join_date,
          connection_status: 'none'
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
        
        // Update connection status
        if (connectionsData && Array.isArray(connectionsData) && connectionsData.length > 0) {
          (connectionsData as any[]).forEach((connection: any) => {
            const investorIndex = investorData.findIndex(inv => inv.id === connection.user_id);
            if (investorIndex !== -1) {
              investorData[investorIndex].connection_status = connection.status === 'accepted' 
                ? 'connected' 
                : connection.status === 'pending' 
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
    
    // Return the RPC result directly if it worked
    return (data as NetworkInvestor[]) || [];
  } catch (error) {
    console.error('Error fetching network investors:', error);
    return [];
  }
}
