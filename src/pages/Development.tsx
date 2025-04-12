
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { fetchDevelopmentProjects } from "@/services/developmentProjectService";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { DevelopmentProjectList } from "@/components/development/DevelopmentProjectList";
import { DevelopmentProjectFilters } from "@/components/development/DevelopmentProjectFilters";
import { Separator } from "@/components/ui/separator";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";

export default function Development() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [activeFilters, setActiveFilters] = useState<any>({});
  
  const { data: projects = [], isLoading, error } = useQuery({
    queryKey: ['developmentProjects'],
    queryFn: fetchDevelopmentProjects,
    meta: {
      onError: () => {
        toast({
          title: t('errorFetchingProjects'),
          description: t('pleaseTryAgainLater'),
          variant: "destructive",
        });
      },
    },
  });
  
  // Apply filters to projects
  const filteredProjects = projects.filter((project: any) => {
    // Progress range filter
    if (activeFilters.progressMin !== undefined && 
        activeFilters.progressMax !== undefined &&
        (project.progress_percentage < activeFilters.progressMin || 
         project.progress_percentage > activeFilters.progressMax)) {
      return false;
    }
    
    // Min investment filter
    if (activeFilters.minInvestment && 
        project.min_investment > activeFilters.minInvestment) {
      return false;
    }
    
    // Investor level filter
    if (activeFilters.investorLevel && 
        project.investor_level !== activeFilters.investorLevel) {
      return false;
    }
    
    // Location filter (city, zone, country)
    if (activeFilters.location && project.location) {
      const locationSearchTerm = activeFilters.location.toLowerCase();
      const locationMatch = 
        project.location.city?.toLowerCase().includes(locationSearchTerm) ||
        project.location.zone?.toLowerCase().includes(locationSearchTerm) ||
        project.location.country?.toLowerCase().includes(locationSearchTerm);
      
      if (!locationMatch) return false;
    }
    
    // Construction stage filter
    if (activeFilters.stage && 
        project.construction_stage.toLowerCase() !== activeFilters.stage.toLowerCase()) {
      return false;
    }
    
    return true;
  });
  
  const handleApplyFilters = (filters: any) => {
    setActiveFilters(filters);
  };
  
  return (
    <DashboardLayout title={t('developmentProjects')} subtitle={t('exploreCurrentProjectsInProgress')}>
      <div className="container mx-auto py-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">{t('developmentProjects')}</h1>
            <p className="text-muted-foreground">{t('exploreCurrentProjectsInProgress')}</p>
          </div>
        </div>
        
        <Separator className="my-6" />
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-1">
            <DevelopmentProjectFilters onApplyFilters={handleApplyFilters} />
          </div>
          
          <div className="md:col-span-3">
            <DevelopmentProjectList 
              projects={filteredProjects} 
              isLoading={isLoading} 
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
