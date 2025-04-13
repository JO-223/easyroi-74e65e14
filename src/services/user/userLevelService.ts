
import { supabase } from '@/integrations/supabase/client';
import { UserLevel } from '@/types/user';
import { calculateUserLevel } from '@/utils/levelCalculations';

/**
 * Verifies that the user level is correctly set based on their total investment
 * This is typically called after each transaction or portfolio update
 */
export async function verifyUserLevel(userId?: string): Promise<boolean> {
  try {
    // Get user ID if not provided
    if (!userId) {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;
      userId = user.id;
    }

    // Get current user info
    const { data: userData, error: userError } = await supabase
      .from('profiles')
      .select('id, level, total_investment')
      .eq('id', userId)
      .single();
      
    if (userError || !userData) {
      console.error('Error fetching user data:', userError);
      return false;
    }
    
    // Get all user investments
    const { data: investments, error: investmentsError } = await supabase
      .from('user_investments')
      .select('amount')
      .eq('user_id', userId);
      
    if (investmentsError) {
      console.error('Error fetching user investments:', investmentsError);
      return false;
    }
    
    // Calculate total investment
    const calculatedTotal = investments.reduce((sum, investment) => {
      return sum + (investment.amount || 0);
    }, 0);
    
    // Calculate appropriate level
    const calculatedLevel = calculateUserLevel(calculatedTotal);
    
    // If stored level doesn't match calculated level, update it
    if (userData.level !== calculatedLevel || userData.total_investment !== calculatedTotal) {
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ 
          level: calculatedLevel,
          total_investment: calculatedTotal as number  // Type assertion since we know it's a number
        })
        .eq('id', userId);
        
      if (updateError) {
        console.error('Error updating user level:', updateError);
        return false;
      }
    }
    
    return true;
  } catch (error) {
    console.error('Exception in verifyUserLevel:', error);
    return false;
  }
}

/**
 * Updates a user's total investment and recalculates their level
 * Called when a new investment is added or an existing one is modified
 */
export async function updateUserInvestmentTotal(
  userId: string, 
  newAmount: number
): Promise<boolean> {
  try {
    // Get current user info
    const { data: userData, error: userError } = await supabase
      .from('profiles')
      .select('total_investment')
      .eq('id', userId)
      .single();
      
    if (userError) {
      console.error('Error fetching user data:', userError);
      return false;
    }
    
    // Calculate new total
    const currentTotal = userData.total_investment as number || 0;
    const newTotal = currentTotal + newAmount;
    
    // Calculate appropriate level
    const newLevel = calculateUserLevel(newTotal);
    
    // Update the profile
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ 
        level: newLevel,
        total_investment: newTotal
      })
      .eq('id', userId);
      
    if (updateError) {
      console.error('Error updating user investment total:', updateError);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Exception in updateUserInvestmentTotal:', error);
    return false;
  }
}
