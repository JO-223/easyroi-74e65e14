
import { supabase } from "@/integrations/supabase/client";
import { UserInvestment } from "@/types/property";

export const fetchUserInvestment = async (userId: string): Promise<UserInvestment | null> => {
  try {
    // Usando una query generica per evitare errori di tipo
    const { data, error } = await supabase
      .from('user_investments')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error) {
      console.error('Errore nel recupero degli investimenti:', error);
      return null;
    }
    
    if (!data) return null;
    
    // Conversione esplicita dei dati al tipo UserInvestment
    const investment: UserInvestment = {
      id: data.id,
      user_id: data.user_id,
      total_investment: data.total_investment,
      last_updated: data.last_updated
    };
    
    return investment;
  } catch (error) {
    console.error('Errore nel recupero degli investimenti:', error);
    return null;
  }
};

export const calculateRequiredForNextLevel = (currentInvestment: number) => {
  if (currentInvestment > 20000000) {
    return { nextLevel: null, required: 0 }; // Cosmic è il livello massimo
  } else if (currentInvestment > 5000000) {
    return { 
      nextLevel: 'cosmic', 
      required: 20000000 - currentInvestment 
    };
  } else if (currentInvestment > 2500000) {
    return { 
      nextLevel: 'diamond', 
      required: 5000000 - currentInvestment 
    };
  } else if (currentInvestment > 1000000) {
    return { 
      nextLevel: 'platinum', 
      required: 2500000 - currentInvestment 
    };
  } else if (currentInvestment > 500000) {
    return { 
      nextLevel: 'gold', 
      required: 1000000 - currentInvestment 
    };
  } else {
    return { 
      nextLevel: 'silver', 
      required: 500000 - currentInvestment 
    };
  }
};
