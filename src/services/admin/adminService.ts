
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

// Investor management
export const addNewInvestor = async (
  email: string,
  firstName: string,
  lastName: string,
  password: string,
  initialInvestment?: number
) => {
  try {
    const { data, error } = await supabase.rpc('add_new_investor', {
      p_email: email,
      p_first_name: firstName,
      p_last_name: lastName,
      p_password: password,
      p_initial_investment: initialInvestment
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error adding new investor:', error);
    throw error;
  }
};

// Property management
export const addPropertyForUser = async (
  userId: string,
  propertyData: {
    name: string;
    address: string;
    city: string;
    country: string;
    zone: string;
    typeId: string;
    price: number;
    sizeSqm: number;
    bedrooms: number;
    bathrooms: number;
    occupationStatus: string;
    status: string;
    roiPercentage?: number;
    serviceCharges?: number;
  }
) => {
  try {
    const { data, error } = await supabase.rpc('add_property_for_user', {
      p_user_id: userId,
      p_name: propertyData.name,
      p_address: propertyData.address,
      p_city: propertyData.city,
      p_country: propertyData.country,
      p_zone: propertyData.zone,
      p_type_id: propertyData.typeId,
      p_price: propertyData.price,
      p_size_sqm: propertyData.sizeSqm,
      p_bedrooms: propertyData.bedrooms,
      p_bathrooms: propertyData.bathrooms,
      p_occupation_status: propertyData.occupationStatus,
      p_status: propertyData.status,
      p_roi_percentage: propertyData.roiPercentage,
      p_service_charges: propertyData.serviceCharges,
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error adding property for user:', error);
    throw error;
  }
};

// Property for sale management
export const addPropertyForSale = async (
  propertyData: {
    name: string;
    address: string;
    city: string;
    country: string;
    zone: string;
    typeId: string;
    price: number;
    sizeSqm: number;
    bedrooms: number;
    bathrooms: number;
    minInvestment?: number;
    roiPercentage?: number;
    investorLevel?: string;
  }
) => {
  try {
    const { data, error } = await supabase.rpc('add_property_for_sale', {
      p_name: propertyData.name,
      p_address: propertyData.address,
      p_city: propertyData.city,
      p_country: propertyData.country,
      p_zone: propertyData.zone,
      p_type_id: propertyData.typeId,
      p_price: propertyData.price,
      p_size_sqm: propertyData.sizeSqm,
      p_bedrooms: propertyData.bedrooms,
      p_bathrooms: propertyData.bathrooms,
      p_min_investment: propertyData.minInvestment,
      p_roi_percentage: propertyData.roiPercentage,
      p_investor_level: propertyData.investorLevel,
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error adding property for sale:', error);
    throw error;
  }
};

// Development project management
export const addNewDevelopmentProject = async (
  projectData: {
    name: string;
    description: string;
    address: string;
    city: string;
    country: string;
    zone: string;
    expectedCompletion: string;
    constructionStage: string;
    progressPercentage: number;
    totalUnits: number;
    availableUnits: number;
    minInvestment?: number;
    expectedRoi?: number;
    investorLevel?: string;
  }
) => {
  try {
    const { data, error } = await supabase.rpc('add_new_development_project', {
      p_name: projectData.name,
      p_description: projectData.description,
      p_address: projectData.address,
      p_city: projectData.city,
      p_country: projectData.country,
      p_zone: projectData.zone,
      p_expected_completion: projectData.expectedCompletion,
      p_construction_stage: projectData.constructionStage,
      p_progress_percentage: projectData.progressPercentage,
      p_total_units: projectData.totalUnits,
      p_available_units: projectData.availableUnits,
      p_min_investment: projectData.minInvestment,
      p_expected_roi: projectData.expectedRoi,
      p_investor_level: projectData.investorLevel,
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error adding new development project:', error);
    throw error;
  }
};

// Event management
export const addNewEvent = async (
  eventData: {
    title: string;
    description: string;
    date: string;
    time: string;
    location: string;
    eventType: string;
    maxAttendees?: number;
    propertyId?: string;
    projectId?: string;
    imageUrl?: string;
    isOnline: boolean;
    requiredBadges?: string[];
  }
) => {
  try {
    const { data, error } = await supabase.rpc('add_new_event', {
      p_title: eventData.title,
      p_description: eventData.description,
      p_date: eventData.date,
      p_time: eventData.time,
      p_location: eventData.location,
      p_event_type: eventData.eventType,
      p_max_attendees: eventData.maxAttendees,
      p_property_id: eventData.propertyId,
      p_project_id: eventData.projectId,
      p_image_url: eventData.imageUrl,
      p_is_online: eventData.isOnline,
      p_required_badges: eventData.requiredBadges,
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error adding new event:', error);
    throw error;
  }
};

// Fetch all property types
export const fetchPropertyTypes = async () => {
  try {
    const { data, error } = await supabase
      .from('property_types')
      .select('*')
      .order('name');

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching property types:', error);
    throw error;
  }
};

// Fetch all investors (for selecting who to assign a property to)
export const fetchInvestors = async () => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, first_name, last_name, email, level')
      .order('last_name');

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching investors:', error);
    throw error;
  }
};

// Fetch all properties (for linking with events)
export const fetchProperties = async () => {
  try {
    const { data, error } = await supabase
      .from('properties')
      .select('id, name')
      .order('name');

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching properties:', error);
    throw error;
  }
};

// Fetch all development projects (for linking with events)
export const fetchDevelopmentProjects = async () => {
  try {
    const { data, error } = await supabase
      .from('development_projects')
      .select('id, name')
      .order('name');

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching development projects:', error);
    throw error;
  }
};

// Create a demo platinum user with sample data
export const createDemoPlatinumUser = async () => {
  try {
    const { data, error } = await supabase.rpc('create_demo_platinum_user');

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating demo platinum user:', error);
    throw error;
  }
};

// Custom hook for admin operations with toast and navigation
export const useAdminActions = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleAdminAction = async (action: () => Promise<any>, successMessage: string, errorMessage: string, redirectPath?: string) => {
    try {
      await action();
      
      toast({
        title: "Success",
        description: successMessage,
        variant: "default",
      });
      
      if (redirectPath) {
        navigate(redirectPath);
      }
      
      return true;
    } catch (error) {
      console.error(error);
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      
      return false;
    }
  };

  return { handleAdminAction };
};
