
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BadgeLevel } from '@/components/ui/badge-level';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { CalendarClock, Building2, Map, DollarSign, Gauge, Users } from 'lucide-react';
import { DevelopmentProject } from '@/types/property';
import { useLanguage } from '@/contexts/LanguageContext';
import { formatCurrency } from '@/utils/formatters';
import { formatDateFromISO } from '@/utils/dates';

interface DevelopmentProjectCardProps {
  project: DevelopmentProject;
  onClick?: () => void;
}

export const DevelopmentProjectCard = ({ project, onClick }: DevelopmentProjectCardProps) => {
  const { t } = useLanguage();
  
  // Helper function to get appropriate color based on progress
  const getProgressColor = (percentage: number) => {
    if (percentage < 25) return 'bg-red-500';
    if (percentage < 50) return 'bg-amber-500';
    if (percentage < 75) return 'bg-blue-500';
    return 'bg-green-500';
  };

  // If there's a project image, use it; otherwise, use a placeholder
  const projectImage = project.image_url || '/assets/placeholder-property.jpg';

  const handleCardClick = () => {
    if (onClick) {
      onClick();
    }
  };

  return (
    <Card 
      className="overflow-hidden transition-all hover:shadow-md cursor-pointer" 
      onClick={handleCardClick}
    >
      {/* Project image */}
      <div className="relative h-48 overflow-hidden">
        <img 
          src={projectImage}
          alt={project.name} 
          className="w-full h-full object-cover transition-transform hover:scale-105"
        />
        <div className="absolute top-2 right-2">
          <BadgeLevel level={project.investor_level as any} />
        </div>
      </div>

      <CardContent className="p-4">
        {/* Project name and badges */}
        <div className="mb-3">
          <h3 className="text-lg font-semibold line-clamp-1">{project.name}</h3>
          <div className="flex items-center text-sm text-gray-500 mt-1">
            <Map className="h-4 w-4 mr-1" />
            <span>{project.location.city}, {project.location.country}</span>
          </div>
        </div>

        {/* Project stats grid */}
        <div className="grid grid-cols-2 gap-3 my-3">
          {/* Expected Completion */}
          <div className="flex items-start space-x-2">
            <CalendarClock className="h-4 w-4 text-gray-400 mt-0.5" />
            <div>
              <p className="text-xs text-gray-500">{t('expectedCompletion')}</p>
              <p className="text-sm font-medium">{formatDateFromISO(project.expected_completion)}</p>
            </div>
          </div>
          
          {/* Units */}
          <div className="flex items-start space-x-2">
            <Users className="h-4 w-4 text-gray-400 mt-0.5" />
            <div>
              <p className="text-xs text-gray-500">{t('unitsAvailable')}</p>
              <p className="text-sm font-medium">{project.available_units}/{project.total_units}</p>
            </div>
          </div>
          
          {/* Expected ROI */}
          <div className="flex items-start space-x-2">
            <Gauge className="h-4 w-4 text-gray-400 mt-0.5" />
            <div>
              <p className="text-xs text-gray-500">{t('expectedRoi')}</p>
              <p className="text-sm font-medium">{project.expected_roi}%</p>
            </div>
          </div>
          
          {/* Min Investment */}
          <div className="flex items-start space-x-2">
            <DollarSign className="h-4 w-4 text-gray-400 mt-0.5" />
            <div>
              <p className="text-xs text-gray-500">{t('minInvestment')}</p>
              <p className="text-sm font-medium">{formatCurrency(project.min_investment)}</p>
            </div>
          </div>
        </div>
        
        {/* Construction progress */}
        <div className="mt-4">
          <div className="flex justify-between text-xs mb-1">
            <span>{t('constructionProgress')}</span>
            <span>{project.progress_percentage}%</span>
          </div>
          <Progress 
            value={project.progress_percentage} 
            className={`h-2 ${getProgressColor(project.progress_percentage)}`}
          />
        </div>
      </CardContent>

      <CardFooter className="px-4 py-3 bg-gray-50 flex justify-between">
        <Badge variant="outline" className="bg-white">
          {project.construction_stage}
        </Badge>
        <Link to={`/development/${project.id}`} onClick={(e) => e.stopPropagation()}>
          <Button variant="outline" size="sm">
            {t('viewDetails')}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};
