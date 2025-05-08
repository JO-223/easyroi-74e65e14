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

// Sample data for different investment types
const sampleSecondaryInvestments: Investment[] = [
  {
    id: "sec-1",
    name: "Villa Belvedere",
    location: "Milano, Italia",
    type: "secondary",
    currentValue: 980000,
    purchaseDate: "2022-06-15",
    propertyId: "prop-1"
  },
  {
    id: "sec-2",
    name: "Appartamento Centro",
    location: "Roma, Italia",
    type: "secondary",
    currentValue: 450000,
    purchaseDate: "2021-10-22",
    propertyId: "prop-2"
  },
  {
    id: "sec-3",
    name: "Casa Vista Mare",
    location: "Napoli, Italia",
    type: "secondary",
    currentValue: 720000,
    purchaseDate: "2023-03-08",
    propertyId: "prop-3"
  }
];

const sampleOffPlanInvestments: Investment[] = [
  {
    id: "off-1",
    name: "Torre Moderna",
    location: "Barcelona, Spagna",
    type: "offPlan",
    currentValue: 620000,
    purchaseDate: "2023-11-10",
    propertyId: "prop-4"
  },
  {
    id: "off-2",
    name: "Residenze Parco Verde",
    location: "Torino, Italia",
    type: "offPlan",
    currentValue: 350000,
    purchaseDate: "2024-01-20",
    propertyId: "prop-5"
  }
];

const sampleClubDealInvestments: Investment[] = [
  {
    id: "club-1",
    name: "Complesso Turistico Costa",
    location: "Marbella, Spagna",
    type: "clubDeal",
    currentValue: 3500000,
    purchaseDate: "2023-05-12",
    propertyId: "prop-6",
    percentageOwned: 15.5,
    investedCapital: 542500,
    contractYears: 10,
    expectedYield: 8.2,
    actualYield: 7.9
  },
  {
    id: "club-2",
    name: "Centro Commerciale Stella",
    location: "Milano, Italia",
    type: "clubDeal",
    currentValue: 5200000,
    purchaseDate: "2022-08-30",
    propertyId: "prop-7",
    percentageOwned: 12.0,
    investedCapital: 624000,
    contractYears: 15,
    expectedYield: 9.5,
    actualYield: 9.1
  },
  {
    id: "club-3",
    name: "Complesso Uffici Business Park",
    location: "Frankfurt, Germania",
    type: "clubDeal",
    currentValue: 4800000,
    purchaseDate: "2023-02-18",
    propertyId: "prop-8",
    percentageOwned: 8.5,
    investedCapital: 408000,
    contractYears: 12,
    expectedYield: 7.8,
    actualYield: 8.2
  }
];

/**
 * Recupera tutti gli investimenti di un utente
 */
export async function fetchUserInvestments(): Promise<Investment[]> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      // Return sample data in case there's no authenticated user
      return [
        ...sampleSecondaryInvestments,
        ...sampleOffPlanInvestments,
        ...sampleClubDealInvestments
      ];
    }

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
      // Return sample data in case of error
      return [
        ...sampleSecondaryInvestments,
        ...sampleOffPlanInvestments,
        ...sampleClubDealInvestments
      ];
    }
    
    // If no real properties found, return sample data
    if (!properties || properties.length === 0) {
      return [
        ...sampleSecondaryInvestments,
        ...sampleOffPlanInvestments,
        ...sampleClubDealInvestments
      ];
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
    // Return sample data in case of exception
    return [
      ...sampleSecondaryInvestments,
      ...sampleOffPlanInvestments,
      ...sampleClubDealInvestments
    ];
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
