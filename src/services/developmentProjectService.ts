
import { supabase } from "@/integrations/supabase/client";
import { DevelopmentProject } from "@/types/property";

export const fetchDevelopmentProjects = async () => {
  // Using a raw fetch instead of the typed client for now, since the types need updating
  const { data, error } = await supabase
    .from('development_projects')
    .select(`
      *,
      location:location_id(*),
      images:project_images(*)
    `)
    .order('expected_completion', { ascending: true });
  
  if (error) {
    console.error('Error fetching development projects:', error);
    throw error;
  }
  
  // Transform the data to match our DevelopmentProject type with proper type assertions
  return data.map((item: any): DevelopmentProject => {
    return {
      id: item.id as string,
      name: item.name as string,
      description: item.description as string,
      location: item.location as any, // Using any here as we need to restructure the data
      expected_completion: item.expected_completion as string,
      construction_stage: item.construction_stage as string,
      progress_percentage: item.progress_percentage as number,
      total_units: item.total_units as number,
      available_units: item.available_units as number,
      min_investment: item.min_investment as number,
      expected_roi: item.expected_roi as number,
      investor_level: item.investor_level as "bronze" | "silver" | "gold" | "platinum" | "diamond",
      images: Array.isArray(item.images) ? item.images : []
    };
  });
};

export const fetchDevelopmentProject = async (id: string) => {
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
    location: data.location as any, // Using any here as we need to restructure the data
    expected_completion: data.expected_completion as string,
    construction_stage: data.construction_stage as string,
    progress_percentage: data.progress_percentage as number,
    total_units: data.total_units as number,
    available_units: data.available_units as number,
    min_investment: data.min_investment as number,
    expected_roi: data.expected_roi as number,
    investor_level: data.investor_level as "bronze" | "silver" | "gold" | "platinum" | "diamond",
    images: Array.isArray(data.images) ? data.images : []
  } as DevelopmentProject;
};
