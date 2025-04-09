
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

/**
 * Aggiorna l'investimento di un utente chiamando la funzione RPC update_user_investment in Supabase
 */
export async function updateUserInvestment(amount: number): Promise<boolean> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;
    
    const { error } = await supabase.rpc(
      'update_user_investment',
      {
        p_user_id: user.id,
        p_investment_amount: amount
      }
    );
    
    if (error) {
      console.error("Errore nell'aggiornamento dell'investimento:", error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Errore nell'aggiornamento dell'investimento:", error);
    return false;
  }
}

/**
 * Recupera l'investimento totale di un utente
 */
export async function getUserInvestment(): Promise<number> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return 0;
    
    const { data, error } = await supabase
      .from('user_investments')
      .select('total_investment')
      .eq('user_id', user.id)
      .single();
    
    if (error) {
      console.error("Errore nel recupero dell'investimento:", error);
      return 0;
    }
    
    return data?.total_investment || 0;
  } catch (error) {
    console.error("Errore nel recupero dell'investimento:", error);
    return 0;
  }
}

/**
 * Custom hook per utilizzare il servizio degli investimenti
 */
export function useInvestmentService() {
  const { toast } = useToast();
  
  const addInvestment = async (amount: number) => {
    const success = await updateUserInvestment(amount);
    
    if (success) {
      toast({
        title: "Investimento aggiornato",
        description: `Hai aggiunto €${amount.toLocaleString()} al tuo investimento totale.`
      });
      return true;
    } else {
      toast({
        title: "Errore",
        description: "Non è stato possibile aggiornare il tuo investimento.",
        variant: "destructive"
      });
      return false;
    }
  };
  
  return { addInvestment, getUserInvestment };
}
