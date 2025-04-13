
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { useQueryClient } from "@tanstack/react-query";
import { invalidateAllUserData } from "@/utils/queryInvalidation";

/**
 * Aggiorna tutti i dati della dashboard dell'utente
 * Utile quando è necessario sincronizzare dati dopo operazioni importanti
 * 
 * @param userId ID utente (opzionale, se non fornito usa l'utente corrente)
 * @returns true se l'aggiornamento è riuscito, false altrimenti
 */
export async function updateUserDashboardData(userId?: string): Promise<boolean> {
  try {
    // Se l'userId non è fornito, otteni l'utente corrente
    if (!userId) {
      const { data: { user } } = await supabase.auth.getUser();
      userId = user?.id;
    }

    if (!userId) {
      console.error("User ID not available for dashboard update");
      return false;
    }

    console.log(`Updating dashboard data for user ${userId}`);
    const { data, error } = await supabase
      .rpc('update_user_dashboard_data', { p_user_id: userId });

    if (error) {
      console.error("Error updating dashboard data:", error);
      return false;
    }

    return data === true;
  } catch (error) {
    console.error("Error in updateUserDashboardData:", error);
    return false;
  }
}

/**
 * Hook che fornisce una funzione per aggiornare i dati della dashboard 
 * con gestione integrata di toast e invalidazione cache
 */
export function useUpdateDashboard() {
  const { toast } = useToast();
  const { t } = useLanguage();
  const queryClient = useQueryClient();

  const updateDashboard = async (userId?: string): Promise<boolean> => {
    try {
      const success = await updateUserDashboardData(userId);
      
      if (success) {
        // Invalida le query per forzare il refresh dei dati
        invalidateAllUserData(queryClient);
        
        toast({
          title: t('success'),
          description: t('dashboardDataUpdated'),
          variant: "default"
        });
      } else {
        toast({
          title: t('error'),
          description: t('errorUpdatingDashboard'),
          variant: "destructive"
        });
      }
      
      return success;
    } catch (error) {
      console.error("Error updating dashboard:", error);
      
      toast({
        title: t('error'),
        description: t('errorUpdatingDashboard'),
        variant: "destructive"
      });
      
      return false;
    }
  };

  return { updateDashboard };
}
