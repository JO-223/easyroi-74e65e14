
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

// Temporarily mocked functions until we implement the actual RPC calls
export const addNewInvestor = async (investorData: NewInvestorData): Promise<void> => {
  console.log("Adding new investor:", investorData);
  // TODO: Replace with actual Supabase RPC call
  await new Promise(resolve => setTimeout(resolve, 1000)); // Simulating API call
  return Promise.resolve();
};

export const addPropertyForUser = async (userId: string, propertyData: NewPropertyData): Promise<void> => {
  console.log("Adding property for user:", userId, propertyData);
  // TODO: Replace with actual Supabase RPC call
  await new Promise(resolve => setTimeout(resolve, 1000)); // Simulating API call
  return Promise.resolve();
};

export const addPropertyForSale = async (propertyData: NewForSalePropertyData): Promise<void> => {
  console.log("Adding property for sale:", propertyData);
  // TODO: Replace with actual Supabase RPC call
  await new Promise(resolve => setTimeout(resolve, 1000)); // Simulating API call
  return Promise.resolve();
};

export const addNewDevelopmentProject = async (projectData: NewDevelopmentProjectData): Promise<void> => {
  console.log("Adding new development project:", projectData);
  // TODO: Replace with actual Supabase RPC call
  await new Promise(resolve => setTimeout(resolve, 1000)); // Simulating API call
  return Promise.resolve();
};

export const addNewEvent = async (eventData: NewEventData): Promise<void> => {
  console.log("Adding new event:", eventData);
  // TODO: Replace with actual Supabase RPC call
  await new Promise(resolve => setTimeout(resolve, 1000)); // Simulating API call
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
