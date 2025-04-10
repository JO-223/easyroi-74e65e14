
import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { 
  Investor, 
  NewInvestorData, 
  NewPropertyData, 
  NewForSalePropertyData,
  NewDevelopmentProjectData,
  NewEventData,
  AdminProperty,
  AdminDevelopmentProject
} from "@/types/admin";
import { PropertyType } from "@/types/property";
import { useLanguage } from "@/contexts/LanguageContext";

// Helper function to ensure proper typing for supabase responses
const ensureTypedResponse = <T,>(data: any): T[] => {
  if (!data) return [];
  return data as T[];
};

// Fetch investors from the database
export const fetchInvestors = async (): Promise<Investor[]> => {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, first_name, last_name, email, level")
    .order("first_name", { ascending: true });

  if (error) {
    console.error("Error fetching investors:", error);
    throw new Error("Failed to fetch investors");
  }

  return ensureTypedResponse<Investor>(data);
};

// Fetch property types from the database
export const fetchPropertyTypes = async (): Promise<PropertyType[]> => {
  const { data, error } = await supabase
    .from("property_types")
    .select("id, name, description")
    .order("name", { ascending: true });

  if (error) {
    console.error("Error fetching property types:", error);
    throw new Error("Failed to fetch property types");
  }

  return ensureTypedResponse<PropertyType>(data);
};

// Fetch properties list for admin forms (simplified version with just id and name)
export const fetchProperties = async (): Promise<AdminProperty[]> => {
  const { data, error } = await supabase
    .from("properties")
    .select("id, name")
    .order("name", { ascending: true });

  if (error) {
    console.error("Error fetching properties:", error);
    throw new Error("Failed to fetch properties");
  }

  return ensureTypedResponse<AdminProperty>(data);
};

// Fetch development projects list for admin forms (simplified version with just id and name)
export const fetchDevelopmentProjects = async (): Promise<AdminDevelopmentProject[]> => {
  const { data, error } = await supabase
    .from("development_projects")
    .select("id, name")
    .order("name", { ascending: true });

  if (error) {
    console.error("Error fetching development projects:", error);
    throw new Error("Failed to fetch development projects");
  }

  return ensureTypedResponse<AdminDevelopmentProject>(data);
};

// Implementazione delle funzioni RPC di Supabase
export const addNewInvestor = async (investorData: NewInvestorData): Promise<void> => {
  const { error } = await supabase.rpc('add_new_investor', {
    p_email: investorData.email,
    p_first_name: investorData.first_name,
    p_last_name: investorData.last_name,
    p_password: investorData.password,
    p_initial_investment: investorData.initialInvestment
  });

  if (error) {
    console.error("Error adding new investor:", error);
    throw error;
  }
  
  return Promise.resolve();
};

export const addPropertyForUser = async (userId: string, propertyData: NewPropertyData): Promise<void> => {
  const { error } = await supabase.rpc('add_property_for_user', {
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
    p_service_charges: propertyData.serviceCharges
  });

  if (error) {
    console.error("Error adding property for user:", error);
    throw error;
  }
  
  return Promise.resolve();
};

export const addPropertyForSale = async (propertyData: NewForSalePropertyData): Promise<void> => {
  const { error } = await supabase.rpc('add_property_for_sale', {
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
    p_investor_level: propertyData.investorLevel
  });

  if (error) {
    console.error("Error adding property for sale:", error);
    throw error;
  }
  
  return Promise.resolve();
};

export const addNewDevelopmentProject = async (projectData: NewDevelopmentProjectData): Promise<void> => {
  const { error } = await supabase.rpc('add_new_development_project', {
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
    p_image_url: projectData.imageUrl
  });

  if (error) {
    console.error("Error adding new development project:", error);
    throw error;
  }
  
  return Promise.resolve();
};

export const addNewEvent = async (eventData: NewEventData): Promise<void> => {
  const { error } = await supabase.rpc('add_new_event', {
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
    p_required_badges: eventData.requiredBadges
  });

  if (error) {
    console.error("Error adding new event:", error);
    throw error;
  }
  
  return Promise.resolve();
};

// Custom hook for handling admin actions with toast notifications
export const useAdminActions = () => {
  const { toast } = useToast();
  const { t } = useLanguage();
  
  const handleAdminAction = useCallback(async (
    action: () => Promise<void>, 
    successMessage: string, 
    errorMessage: string
  ) => {
    try {
      await action();
      toast({
        title: t('success'),
        description: successMessage,
        variant: "default"
      });
      return true;
    } catch (error) {
      console.error("Admin action error:", error);
      toast({
        title: t('error'),
        description: errorMessage,
        variant: "destructive"
      });
      return false;
    }
  }, [toast, t]);
  
  return { handleAdminAction };
};
