
import { supabase } from "@/integrations/supabase/client";
import { 
  NewDevelopmentProjectData,
  AdminDevelopmentProject 
} from "@/types/admin";
import { ensureTypedResponse } from "./utils";

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
