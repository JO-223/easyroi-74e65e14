
import { supabase } from "@/integrations/supabase/client";
import { UserLevel } from "@/components/ui/user-badge";
import { determineUserLevel } from "@/utils/userLevelUtils";

/**
 * Recupera il livello dell'utente dal profilo
 */
export async function getUserLevel(userId?: string): Promise<UserLevel | null> {
  try {
    if (!userId) {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;
      userId = user.id;
    }
    
    const { data, error } = await supabase
      .from('profiles')
      .select('level')
      .eq('id', userId)
      .single();
      
    if (error) {
      console.error('Error fetching user level:', error);
      return null;
    }
    
    return data?.level as UserLevel || null;
  } catch (error) {
    console.error('Error in getUserLevel:', error);
    return null;
  }
}

/**
 * Recupera il totale degli investimenti dell'utente
 */
export async function getUserInvestment(userId?: string): Promise<number> {
  try {
    if (!userId) {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return 0;
      userId = user.id;
    }
    
    const { data, error } = await supabase
      .from('user_investments')
      .select('total_investment')
      .eq('user_id', userId)
      .single();
      
    if (error) {
      console.error('Error fetching user investment:', error);
      return 0;
    }
    
    return data?.total_investment || 0;
  } catch (error) {
    console.error('Error in getUserInvestment:', error);
    return 0;
  }
}

/**
 * Recupera sia il livello che l'investimento totale dell'utente
 */
export async function getUserLevelData(userId?: string) {
  try {
    if (!userId) {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return { level: null, totalInvestment: 0 };
      userId = user.id;
    }
    
    const [levelResult, investmentResult] = await Promise.all([
      supabase
        .from('profiles')
        .select('level')
        .eq('id', userId)
        .single(),
      supabase
        .from('user_investments')
        .select('total_investment')
        .eq('user_id', userId)
        .single()
    ]);
    
    const level = levelResult.data?.level as UserLevel || null;
    const totalInvestment = investmentResult.data?.total_investment || 0;
    
    // Verificare che il livello sia coerente con l'investimento totale
    const calculatedLevel = determineUserLevel(totalInvestment);
    
    return {
      level,
      calculatedLevel, 
      totalInvestment,
      isLevelCorrect: level === calculatedLevel
    };
  } catch (error) {
    console.error('Error in getUserLevelData:', error);
    return { level: null, totalInvestment: 0, calculatedLevel: null, isLevelCorrect: false };
  }
}

/**
 * Verifica che il trigger update_user_level funzioni correttamente
 */
export async function verifyUserLevelTrigger(): Promise<boolean> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;
    
    const { level, totalInvestment, calculatedLevel, isLevelCorrect } = 
      await getUserLevelData(user.id);
    
    return isLevelCorrect;
  } catch (error) {
    console.error('Error verifying user level trigger:', error);
    return false;
  }
}
