
import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BadgeLevel } from "@/components/ui/badge-level";
import { Progress } from "@/components/ui/progress";
import { MapPin, Calendar, Building, TrendingUp } from "lucide-react";
import { formatCurrency } from "@/utils/formatters";
import { DevelopmentProject } from "@/types/property";
import { useLanguage } from "@/contexts/LanguageContext";

interface DevelopmentProjectCardProps {
  project: DevelopmentProject;
  onClick: () => void;
}

export function DevelopmentProjectCard({ project, onClick }: DevelopmentProjectCardProps) {
  const { t } = useLanguage();
  
  // Get image URL or use placeholder
  const imageUrl = project.image_url || "/placeholder-project.jpg";
  
  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <div className="relative h-48">
        <img 
          src={imageUrl} 
          alt={project.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 right-2">
          <BadgeLevel level={project.investor_level as any} />
        </div>
      </div>
      
      <CardContent className="py-4 flex-grow">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-lg line-clamp-1">{project.name}</h3>
          <Badge 
            className={`
              ${project.construction_stage === 'planning' ? 'bg-blue-100 text-blue-800' :
                project.construction_stage === 'foundation' ? 'bg-amber-100 text-amber-800' :
                project.construction_stage === 'structure' ? 'bg-orange-100 text-orange-800' :
                project.construction_stage === 'finishing' ? 'bg-emerald-100 text-emerald-800' :
                project.construction_stage === 'interior' ? 'bg-violet-100 text-violet-800' :
                'bg-green-100 text-green-800'}
            `}
          >
            {project.construction_stage}
          </Badge>
        </div>
        
        <div className="space-y-2 text-sm mb-4">
          <div className="flex items-center">
            <MapPin className="w-4 h-4 mr-1 text-gray-500" />
            <span className="text-gray-700 line-clamp-1">
              {project.location.city}, {project.location.country}
            </span>
          </div>
          
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-1 text-gray-500" />
            <span className="text-gray-700">
              {t('expectedCompletion')}: {new Date(project.expected_completion).toLocaleDateString()}
            </span>
          </div>
          
          <div className="flex items-center">
            <Building className="w-4 h-4 mr-1 text-gray-500" />
            <span className="text-gray-700">
              {project.available_units} / {project.total_units} {t('unitsAvailable')}
            </span>
          </div>
          
          <div className="flex items-center">
            <TrendingUp className="w-4 h-4 mr-1 text-gray-500" />
            <span className="text-gray-700">
              {t('expectedRoi')}: {project.expected_roi}%
            </span>
          </div>
        </div>
        
        <div className="mb-2">
          <div className="flex justify-between mb-1 text-xs">
            <span>{t('constructionProgress')}</span>
            <span>{project.progress_percentage}%</span>
          </div>
          <Progress value={project.progress_percentage} className="h-2" />
        </div>
        
        <p className="text-gray-600 text-sm line-clamp-2 mt-2">
          {project.description}
        </p>
      </CardContent>
      
      <CardFooter className="pt-0">
        <div className="w-full">
          {project.min_investment > 0 && (
            <div className="text-sm mb-3 text-center">
              <span className="font-medium">{t('minInvestment')}: </span>
              <span className="font-bold text-easyroi-navy">{formatCurrency(project.min_investment)}</span>
            </div>
          )}
          
          <Button 
            className="w-full bg-easyroi-navy hover:bg-easyroi-navy/90"
            onClick={onClick}
          >
            {t('viewDetails')}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
