
import { supabase } from "@/integrations/supabase/client";
import { DevelopmentProject } from "@/types/property";

export const fetchDevelopmentProjects = async () => {
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
  
  // Transform the data to match our DevelopmentProject type
  return data.map((item: any): DevelopmentProject => {
    return {
      id: item.id,
      name: item.name,
      description: item.description,
      location: item.location,
      expected_completion: item.expected_completion,
      construction_stage: item.construction_stage,
      progress_percentage: item.progress_percentage,
      total_units: item.total_units,
      available_units: item.available_units,
      min_investment: item.min_investment,
      expected_roi: item.expected_roi,
      investor_level: item.investor_level,
      images: item.images || []
    };
  });
};

export const fetchDevelopmentProject = async (id: string) => {
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
  
  return {
    id: data.id,
    name: data.name,
    description: data.description,
    location: data.location,
    expected_completion: data.expected_completion,
    construction_stage: data.construction_stage,
    progress_percentage: data.progress_percentage,
    total_units: data.total_units,
    available_units: data.available_units,
    min_investment: data.min_investment,
    expected_roi: data.expected_roi,
    investor_level: data.investor_level,
    images: data.images || []
  } as DevelopmentProject;
};
