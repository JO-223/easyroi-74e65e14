
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { fetchDevelopmentProject } from "@/services/developmentProjectService";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { BadgeLevel } from "@/components/ui/badge-level";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, CalendarIcon, MapPin, Building2, Users, Percent } from "lucide-react";
import { format } from "date-fns";
import { useLanguage } from "@/contexts/LanguageContext";

export default function DevelopmentDetail() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  const { data: project, isLoading, error } = useQuery({
    queryKey: ['developmentProject', projectId],
    queryFn: () => fetchDevelopmentProject(projectId!),
    enabled: !!projectId,
  });
  
  const handleGoBack = () => navigate(-1);
  
  if (isLoading) {
    return (
      <DashboardLayout title={t('projectDetails')} subtitle={t('loading')}>
        <div className="container mx-auto py-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-1/3 bg-muted rounded"></div>
            <div className="h-96 bg-muted rounded"></div>
            <div className="h-40 bg-muted rounded"></div>
          </div>
        </div>
      </DashboardLayout>
    );
  }
  
  if (error || !project) {
    return (
      <DashboardLayout title={t('projectNotFound')} subtitle={t('errorLoadingProject')}>
        <div className="container mx-auto py-6">
          <Button variant="ghost" onClick={handleGoBack} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" /> {t('back')}
          </Button>
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold">{t('projectNotFound')}</h2>
            <p className="text-muted-foreground mt-2">{t('projectMayHaveBeenRemoved')}</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }
  
  // Get the primary image or first image
  const imageUrl = project.image_url || '/placeholder.svg';
  
  // Format expected completion date
  const formattedDate = project.expected_completion ? 
    format(new Date(project.expected_completion), 'MMMM d, yyyy') : 
    t('notAvailable');
  
  // Cast to the specific type needed by BadgeLevel
  const investorLevel = project.investor_level as "bronze" | "silver" | "gold" | "platinum" | "diamond" | null;
  
  return (
    <DashboardLayout title={project.name} subtitle={`${project.location.city}, ${project.location.country}`}>
      <div className="container mx-auto py-6">
        <Button variant="ghost" onClick={handleGoBack} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> {t('back')}
        </Button>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="relative rounded-lg overflow-hidden h-80">
              <img 
                src={imageUrl} 
                alt={project.name} 
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4">
                <BadgeLevel level={investorLevel} />
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                <Badge className="bg-easyroi-gold text-easyroi-navy">{project.construction_stage}</Badge>
              </div>
            </div>
            
            <div>
              <h1 className="text-3xl font-semibold">{project.name}</h1>
              <div className="flex items-center gap-1 mt-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>
                  {project.location.address}, {project.location.zone}, {project.location.city}, {project.location.country}
                </span>
              </div>
            </div>
            
            <div>
              <h2 className="text-xl font-medium mb-3">{t('projectDescription')}</h2>
              <p className="text-muted-foreground whitespace-pre-line">
                {project.description}
              </p>
            </div>
            
            <div>
              <h2 className="text-xl font-medium mb-3">{t('constructionProgress')}</h2>
              <div className="mb-2 flex justify-between">
                <span className="font-medium">{project.construction_stage}</span>
                <span>{project.progress_percentage}%</span>
              </div>
              <Progress value={project.progress_percentage} className="h-3" />
            </div>
          </div>
          
          <div className="lg:col-span-1">
            <div className="rounded-lg border shadow-sm bg-white p-6 space-y-5 sticky top-24">
              <div>
                <h3 className="text-xl font-medium">{t('investmentDetails')}</h3>
                <Separator className="my-3" />
                
                <div className="space-y-4 mt-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t('minInvestment')}</span>
                    <span className="font-semibold">
                      {project.min_investment ? 
                        `€${project.min_investment.toLocaleString()}` : 
                        t('contactUs')
                      }
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t('expectedRoi')}</span>
                    <span className="font-semibold text-easyroi-gold">
                      {project.expected_roi ? `${project.expected_roi}%` : t('tbd')}
                    </span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-medium">{t('projectDetails')}</h3>
                <Separator className="my-3" />
                
                <div className="space-y-4 mt-4">
                  <div className="flex gap-3">
                    <CalendarIcon className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">{t('expectedCompletion')}</p>
                      <p className="font-medium">{formattedDate}</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <Building2 className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">{t('totalUnits')}</p>
                      <p className="font-medium">{project.total_units}</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <Users className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">{t('availableUnits')}</p>
                      <p className="font-medium">{project.available_units}</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <Percent className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">{t('completionPercentage')}</p>
                      <p className="font-medium">{project.progress_percentage}%</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <Button className="w-full bg-easyroi-navy hover:bg-easyroi-navy/90 text-white mt-4">
                {t('requestInformation')}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
