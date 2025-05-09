import { DevelopmentProject } from "@/types/property";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CalendarIcon, Building2, Users } from "lucide-react";
import { format } from "date-fns";
import { useLanguage } from "@/contexts/LanguageContext";
import { BadgeLevel } from "@/components/ui/badge-level";
interface DevelopmentProjectCardProps {
  project: DevelopmentProject;
  onClick?: () => void;
}
export function DevelopmentProjectCard({
  project,
  onClick
}: DevelopmentProjectCardProps) {
  const {
    t
  } = useLanguage();
  const primaryImage = project.images.find(img => img.is_primary) || project.images[0];
  const imageUrl = primaryImage ? primaryImage.url : '/placeholder.svg';

  // Format expected completion date
  const formattedDate = project.expected_completion ? format(new Date(project.expected_completion), 'MMM d, yyyy') : t('notAvailable');

  // Cast investor_level to the appropriate type expected by BadgeLevel
  const investorLevel = project.investor_level as "bronze" | "silver" | "gold" | "platinum" | "diamond" | null;
  return <Card className="group overflow-hidden border rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 cursor-pointer" onClick={onClick}>
      <div className="relative h-48 overflow-hidden">
        <img src={imageUrl} alt={project.name} className="w-full h-full transition-transform duration-500 group-hover:scale-105 object-fill" />
        <div className="absolute top-2 right-2">
          <BadgeLevel level={investorLevel} />
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
          <Badge className="bg-easyroi-gold text-easyroi-navy">{project.construction_stage}</Badge>
        </div>
      </div>
      
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold line-clamp-1">{project.name}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
          {project.description}
        </p>
        
        <div className="mt-3">
          <div className="flex justify-between text-sm mb-1">
            <span>{t('progress')}</span>
            <span>{project.progress_percentage}%</span>
          </div>
          <Progress value={project.progress_percentage} className="h-2" />
        </div>
        
        <div className="mt-4 space-y-2">
          <div className="flex items-center text-sm text-muted-foreground">
            <CalendarIcon className="h-4 w-4 mr-2" />
            <span>{t('expectedCompletion')}: {formattedDate}</span>
          </div>
          
          <div className="flex items-center text-sm text-muted-foreground">
            <Building2 className="h-4 w-4 mr-2" />
            <span>{t('totalUnits')}: {project.total_units}</span>
          </div>
          
          <div className="flex items-center text-sm text-muted-foreground">
            <Users className="h-4 w-4 mr-2" />
            <span>{t('availableUnits')}: {project.available_units}</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="bg-muted/50 p-4 border-t">
        <div className="w-full flex justify-between items-center">
          <div>
            <p className="text-sm font-medium">{t('minInvestment')}:</p>
            <p className="text-lg font-bold text-easyroi-navy">
              {project.min_investment ? `AED${project.min_investment.toLocaleString()}` : t('contactUs')}
            </p>
          </div>
          
          <div className="text-right">
            <p className="text-sm font-medium">{t('expectedROI')}:</p>
            <p className="text-lg font-bold text-easyroi-gold">
              {project.expected_roi ? `${project.expected_roi}%` : t('tbd')}
            </p>
          </div>
        </div>
      </CardFooter>
    </Card>;
}