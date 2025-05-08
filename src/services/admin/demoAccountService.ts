
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

/**
 * Resetta l'account demo Platinum ai valori predefiniti
 * Utilizzato dall'amministratore nella pagina di amministrazione
 * 
 * Questa funzione utilizza la stessa procedura SQL che è stata utilizzata per 
 * inizializzare i dati demo, ma viene richiamata tramite API
 */
export const resetDemoPlatinumAccount = async (): Promise<{
  success: boolean;
  message: string;
}> => {
  try {
    // Esecuzione della funzione RPC che resetta l'account demo
    // Nota: in una situazione reale, questo dovrebbe chiamare una funzione RPC dedicata
    // che esegue lo stesso codice SQL che abbiamo già utilizzato
    const { error } = await supabase.rpc('update_user_dashboard_data', {
      p_user_id: await getDemoPlatinumUserId()
    });

    if (error) {
      console.error("Error resetting demo account:", error);
      return {
        success: false,
        message: `Reset fallito: ${error.message}`
      };
    }

    return {
      success: true,
      message: "Account demo resettato con successo"
    };
  } catch (error) {
    console.error("Error in resetDemoPlatinumAccount:", error);
    return {
      success: false,
      message: "Si è verificato un errore durante il reset dell'account demo"
    };
  }
};

/**
 * Verifica se l'utente demo Platinum esiste nel sistema
 */
export const checkDemoPlatinumAccount = async (): Promise<{
  exists: boolean;
  userId: string | null;
}> => {
  try {
    const userId = await getDemoPlatinumUserId();
    return {
      exists: !!userId,
      userId
    };
  } catch (error) {
    console.error("Error checking for demo platinum account:", error);
    return {
      exists: false,
      userId: null
    };
  }
};

/**
 * Ottiene l'ID dell'utente demo Platinum
 */
const getDemoPlatinumUserId = async (): Promise<string | null> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('id')
    .eq('email', 'demo.platinum@easyroi.com')
    .maybeSingle();

  if (error || !data) {
    console.error("Error fetching demo user:", error);
    return null;
  }

  return data.id as string;
};

/**
 * Hook React per gestire facilmente il reset dell'account demo
 */
export const useDemoAccountReset = () => {
  const { toast } = useToast();
  const { t } = useLanguage();
  
  const resetDemoAccount = async () => {
    toast({
      title: t('processing'),
      description: t('resettingDemoAccount'),
    });
    
    const result = await resetDemoPlatinumAccount();
    
    if (result.success) {
      toast({
        title: t('success'),
        description: t('demoAccountReset'),
        variant: "default"
      });
    } else {
      toast({
        title: t('error'),
        description: result.message,
        variant: "destructive"
      });
    }
    
    return result;
  };
  
  return { resetDemoAccount };
};
