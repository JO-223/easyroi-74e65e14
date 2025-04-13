
import { supabase } from "@/integrations/supabase/client";
import { DevelopmentProject } from "@/types/property";

export const fetchDevelopmentProjects = async (): Promise<DevelopmentProject[]> => {
  try {
    const { data, error } = await supabase
      .from("development_projects")
      .select(`
        *,
        location:location_id(*)
      `)
      .order("created_at", { ascending: false });
    
    if (error) {
      console.error("Error fetching development projects:", error);
      throw new Error(error.message);
    }
    
    // Type assertion with proper mapping to ensure correct types
    const formattedProjects: DevelopmentProject[] = data.map(project => ({
      id: project.id as string,
      name: project.name as string,
      description: project.description as string,
      location: project.location as any, // Using any as we need to restructure the data
      location_id: project.location_id as string,
      expected_completion: project.expected_completion as string,
      construction_stage: project.construction_stage as string,
      progress_percentage: project.progress_percentage as number,
      total_units: project.total_units as number,
      available_units: project.available_units as number,
      min_investment: project.min_investment as number,
      expected_roi: project.expected_roi as number,
      investor_level: project.investor_level as string,
      image_url: project.image_url as string | undefined,
      created_at: project.created_at as string | undefined,
      updated_at: project.updated_at as string | undefined
    }));
    
    return formattedProjects;
  } catch (error) {
    console.error("Error in fetchDevelopmentProjects:", error);
    throw error;
  }
};

export const fetchDevelopmentProject = async (id: string): Promise<DevelopmentProject> => {
  // Using a raw fetch instead of the typed client for now
  const { data, error } = await supabase
    .from('development_projects')
    .select(`
      *,
      location:location_id(*),
      images:project_images(*)
    `)
    .eq('id', id)
    .single();
  
  if (error) {
    console.error(`Error fetching development project with id ${id}:`, error);
    throw error;
  }
  
  // Using type assertion with proper checks
  return {
    id: data.id as string,
    name: data.name as string,
    description: data.description as string,
    location: data.location as any,
    location_id: data.location_id as string,
    expected_completion: data.expected_completion as string,
    construction_stage: data.construction_stage as string,
    progress_percentage: data.progress_percentage as number,
    total_units: data.total_units as number,
    available_units: data.available_units as number,
    min_investment: data.min_investment as number,
    expected_roi: data.expected_roi as number,
    investor_level: data.investor_level as string,
    images: Array.isArray(data.images) ? data.images : [],
    image_url: data.image_url as string | undefined
  } as DevelopmentProject;
};
