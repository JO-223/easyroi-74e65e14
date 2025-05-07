
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Investment } from "@/types/investment";
import { Property } from "@/types/property";

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
    
    // Ensure we're returning a number by explicitly casting
    return typeof data?.total_investment === 'number' ? data.total_investment : 0;
  } catch (error) {
    console.error("Errore nel recupero dell'investimento:", error);
    return 0;
  }
}

/**
 * Recupera tutti gli investimenti di un utente
 */
export async function fetchUserInvestments(): Promise<Investment[]> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    // Fetch user properties with investment data
    const { data: properties, error } = await supabase
      .from('user_properties')
      .select(`
        id,
        name,
        location:property_location_id(
          city,
          country
        ),
        property_type:property_type_id(
          name
        ),
        purchase_date,
        current_value,
        investment_type,
        percentage_owned,
        invested_capital,
        contract_years,
        expected_yield,
        actual_yield
      `)
      .eq('user_id', user.id);
    
    if (error) {
      console.error("Errore nel recupero degli investimenti:", error);
      return [];
    }
    
    // Transform the data to match our Investment type
    return properties.map((property: any) => ({
      id: property.id,
      name: property.name as string,
      location: `${property.location.city}, ${property.location.country}`,
      type: mapInvestmentType(property.investment_type),
      currentValue: property.current_value || 0,
      purchaseDate: property.purchase_date,
      propertyId: property.id,
      percentageOwned: property.percentage_owned,
      investedCapital: property.invested_capital,
      contractYears: property.contract_years,
      expectedYield: property.expected_yield,
      actualYield: property.actual_yield
    }));
  } catch (error) {
    console.error("Errore nel recupero degli investimenti:", error);
    return [];
  }
}

// Helper function to map database investment types to our frontend types
function mapInvestmentType(type: string | null): 'secondary' | 'offPlan' | 'clubDeal' {
  if (!type) return 'secondary';
  
  switch (type.toLowerCase()) {
    case 'off-plan':
    case 'offplan':
      return 'offPlan';
    case 'club-deal':
    case 'clubdeal':
      return 'clubDeal';
    case 'secondary':
    default:
      return 'secondary';
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
