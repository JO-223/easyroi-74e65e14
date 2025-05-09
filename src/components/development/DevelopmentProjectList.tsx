
import { useState } from "react";
import { DevelopmentProject } from "@/types/property";
import { DevelopmentProjectCard } from "./DevelopmentProjectCard";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

interface DevelopmentProjectListProps {
  projects: DevelopmentProject[];
  isLoading: boolean;
}

export function DevelopmentProjectList({ projects, isLoading }: DevelopmentProjectListProps) {
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  const handleProjectClick = (projectId: string) => {
    navigate(`/dashboard/development/${projectId}`);
  };
  
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="rounded-lg shadow-sm border p-4 h-80 animate-pulse bg-muted/20"></div>
        ))}
      </div>
    );
  }
  
  if (projects.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium">{t('noProjectsFound')}</h3>
        <p className="text-muted-foreground mt-2">{t('tryDifferentFilters')}</p>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {projects.map((project) => (
        <DevelopmentProjectCard 
          key={project.id} 
          project={project} 
          onClick={() => handleProjectClick(project.id)}
        />
      ))}
    </div>
  );
}
