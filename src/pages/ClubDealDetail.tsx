import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { fetchClubDeal } from "@/services/clubDealService";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { BadgeLevel } from "@/components/ui/badge-level";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, CalendarIcon, MapPin, Users, Percent, FileText, Download } from "lucide-react";
import { format } from "date-fns";
import { useLanguage } from "@/contexts/LanguageContext";
import { formatCurrency } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Timeline } from "@/components/ui/timeline";

export default function ClubDealDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const { data: deal, isLoading, error } = useQuery({
    queryKey: ['clubDeal', id],
    queryFn: () => fetchClubDeal(id!),
    enabled: !!id
  });
  
  const handleGoBack = () => navigate(-1);
  
  const handleJoinDeal = () => {
    // In a real app, this would open a modal or navigate to a form
    toast({
      title: "Richiesta di partecipazione inviata",
      description: "Un nostro consulente ti contatterà a breve.",
    });
  };
  
  const handleDownloadBusinessPlan = () => {
    // In a real app, this would download the document
    toast({
      title: "Download avviato",
      description: "Il business plan sarà presto disponibile.",
    });
  };
  
  const handleContactManager = () => {
    // In a real app, this would open a contact form or modal
    toast({
      title: "Richiesta di contatto inviata",
      description: "Il deal manager ti contatterà a breve.",
    });
  };
  
  if (isLoading) {
    return <DashboardLayout title={t('projectDetails')} subtitle={t('loading')}>
        <div className="container mx-auto py-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-1/3 bg-muted rounded"></div>
            <div className="h-96 bg-muted rounded"></div>
            <div className="h-40 bg-muted rounded"></div>
          </div>
        </div>
      </DashboardLayout>;
  }
  
  if (error || !deal) {
    return <DashboardLayout title={t('projectNotFound')} subtitle={t('errorLoadingProject')}>
        <div className="container mx-auto py-6">
          <Button variant="ghost" onClick={handleGoBack} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" /> {t('back')}
          </Button>
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold">{t('projectNotFound')}</h2>
            <p className="text-muted-foreground mt-2">{t('projectMayHaveBeenRemoved')}</p>
          </div>
        </div>
      </DashboardLayout>;
  }

  // Get the primary image or first image
  const primaryImage = deal.images.find(img => img.is_primary) || deal.images[0];
  const imageUrl = primaryImage ? primaryImage.url : '/placeholder.svg';

  // Calculate funding progress percentage
  const progressPercentage = Math.min(
    Math.round((deal.fundingCurrent / deal.fundingTarget) * 100),
    100
  );

  // Generate status badge label and color
  const getStatusBadge = () => {
    switch (deal.status) {
      case 'funding_in_progress':
        return { label: t('fundingInProgress'), color: 'bg-blue-500' };
      case 'property_acquired':
        return { label: t('propertyAcquired'), color: 'bg-green-500' };
      case 'in_rental':
        return { label: t('inRental'), color: 'bg-purple-500' };
      case 'ready_for_sale':
        return { label: t('readyForSale'), color: 'bg-amber-500' };
      case 'completed':
        return { label: t('completedDeal'), color: 'bg-gray-500' };
      default:
        return { label: t('tbd'), color: 'bg-gray-500' };
    }
  };

  const statusBadge = getStatusBadge();
  
  // Format dates
  const formattedFundingDeadline = deal.fundingDeadline ? format(new Date(deal.fundingDeadline), 'dd/MM/yyyy') : t('notAvailable');
  const formattedPurchaseDate = deal.purchaseDate ? format(new Date(deal.purchaseDate), 'dd/MM/yyyy') : t('notAvailable');
  
  // Cast to the specific type needed by BadgeLevel
  const investorLevel = deal.investorLevel as "bronze" | "silver" | "gold" | "platinum" | "diamond" | null;
  
  // Group timeline events by phase
  const timelineByPhase = {
    acquisition: deal.timeline.filter(event => event.phase === 'acquisition'),
    rental: deal.timeline.filter(event => event.phase === 'rental'),
    exit: deal.timeline.filter(event => event.phase === 'exit')
  };

  return (
    <DashboardLayout title={deal.name} subtitle={`${deal.location.city}, ${deal.location.country}`}>
      <div className="container mx-auto py-6">
        <Button variant="ghost" onClick={handleGoBack} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> {t('back')}
        </Button>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="relative rounded-lg overflow-hidden h-80">
              <img src={imageUrl} alt={deal.name} className="w-full h-full object-contain" />
              <div className="absolute top-4 right-4">
                <BadgeLevel level={investorLevel} />
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                <Badge className={`${statusBadge.color} border-none text-white`}>
                  {statusBadge.label}
                </Badge>
              </div>
            </div>
            
            <div>
              <h1 className="text-3xl font-semibold">{deal.name}</h1>
              <div className="flex items-center gap-1 mt-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>
                  {deal.location.address}, {deal.location.zone}, {deal.location.city}, {deal.location.country}
                </span>
              </div>
            </div>
            
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid grid-cols-3">
                <TabsTrigger value="overview">{t('projectDetails')}</TabsTrigger>
                <TabsTrigger value="documents">{t('dealDocuments')}</TabsTrigger>
                <TabsTrigger value="timeline">{t('dealTimeline')}</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-6 pt-4">
                {/* Project Description */}
                <div>
                  <h2 className="text-xl font-medium mb-3">{t('projectDescription')}</h2>
                  <p className="text-muted-foreground whitespace-pre-line">
                    {deal.description}
                  </p>
                </div>
                
                {/* Funding Progress */}
                {deal.status === 'funding_in_progress' && (
                  <div>
                    <h2 className="text-xl font-medium mb-3">{t('fundingProgress')}</h2>
                    <div className="mb-2 flex justify-between">
                      <span>{formatCurrency(deal.fundingCurrent)}</span>
                      <span>{formatCurrency(deal.fundingTarget)}</span>
                    </div>
                    <Progress value={progressPercentage} className="h-3" />
                    <div className="mt-2 flex justify-between text-sm text-muted-foreground">
                      <span>{progressPercentage}% {t('completed')}</span>
                      <span>{t('fundingDeadline')}: {formattedFundingDeadline}</span>
                    </div>
                  </div>
                )}
                
                {/* Property Details */}
                {deal.images.length > 1 && (
                  <div>
                    <h2 className="text-xl font-medium mb-3">{t('projectGallery')}</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {deal.images.map(image => (
                        <div key={image.id} className="overflow-hidden rounded-md h-36">
                          <img 
                            src={image.url} 
                            alt={deal.name} 
                            className="w-full h-full hover:scale-110 transition-transform duration-300 object-contain" 
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="documents" className="pt-4">
                <h2 className="text-xl font-medium mb-3">{t('dealDocuments')}</h2>
                {user ? (
                  <div className="space-y-3">
                    {deal.documents.map(doc => (
                      <div 
                        key={doc.id}
                        className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                      >
                        <div className="flex items-center">
                          <FileText className="h-5 w-5 mr-3 text-muted-foreground" />
                          <div>
                            <p className="font-medium">{doc.title}</p>
                            {doc.description && (
                              <p className="text-sm text-muted-foreground">{doc.description}</p>
                            )}
                          </div>
                        </div>
                        <Button size="sm" variant="outline">
                          <Download className="h-4 w-4 mr-2" />
                          {t('view')}
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 text-center border rounded-lg bg-muted/20">
                    <p>{t('please')} <a href="/login" className="text-primary underline">{t('login')}</a> {t('toViewDocuments')}</p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="timeline" className="pt-4">
                <h2 className="text-xl font-medium mb-3">{t('dealTimeline')}</h2>
                
                <div className="space-y-6">
                  {/* Acquisition Phase */}
                  <div>
                    <h3 className="text-lg font-medium mb-3 text-blue-600">{t('acquisitionPhase')}</h3>
                    <Timeline items={timelineByPhase.acquisition.map(event => ({
                      id: event.id,
                      title: event.title,
                      date: format(new Date(event.date), 'dd/MM/yyyy'),
                      description: event.description,
                      completed: event.completed
                    }))} />
                  </div>
                  
                  {/* Rental Phase */}
                  <div>
                    <h3 className="text-lg font-medium mb-3 text-purple-600">{t('rentalPhase')}</h3>
                    <Timeline items={timelineByPhase.rental.map(event => ({
                      id: event.id,
                      title: event.title,
                      date: format(new Date(event.date), 'dd/MM/yyyy'),
                      description: event.description,
                      completed: event.completed
                    }))} />
                  </div>
                  
                  {/* Exit Phase */}
                  <div>
                    <h3 className="text-lg font-medium mb-3 text-amber-600">{t('exitPhase')}</h3>
                    <Timeline items={timelineByPhase.exit.map(event => ({
                      id: event.id,
                      title: event.title,
                      date: format(new Date(event.date), 'dd/MM/yyyy'),
                      description: event.description,
                      completed: event.completed
                    }))} />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
          
          <div className="lg:col-span-1">
            <div className="rounded-lg border shadow-sm bg-white p-6 space-y-5 sticky top-24">
              <div>
                <h3 className="text-xl font-medium">{t('investmentDetails')}</h3>
                <Separator className="my-3" />
                
                <div className="space-y-4 mt-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t('totalPrice')}</span>
                    <span className="font-semibold">
                      {formatCurrency(deal.totalPrice)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t('minInvestment')}</span>
                    <span className="font-semibold">
                      {formatCurrency(deal.minInvestment)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t('estimatedRentalROI')}</span>
                    <span className="font-semibold text-easyroi-gold">
                      {deal.expectedRentalROI}%
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t('estimatedTotalROI')}</span>
                    <span className="font-semibold text-easyroi-gold">
                      {deal.expectedTotalROI}%
                    </span>
                  </div>
                  
                  {deal.rentalDuration && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t('estimatedRentalDuration')}</span>
                      <span className="font-semibold">
                        {deal.rentalDuration} {t('month')}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-medium">{t('dealStatus')}</h3>
                <Separator className="my-3" />
                
                <div className="space-y-4 mt-4">
                  <div className="flex gap-3">
                    <Users className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">{t('investorsParticipating')}</p>
                      <p className="font-medium">{deal.investorsCount}</p>
                    </div>
                  </div>
                  
                  {deal.purchaseDate && (
                    <div className="flex gap-3">
                      <CalendarIcon className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">{t('purchaseDate')}</p>
                        <p className="font-medium">{formattedPurchaseDate}</p>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex gap-3">
                    <Percent className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">{t('currentPropertyValue')}</p>
                      <p className="font-medium">{formatCurrency(deal.currentValue)}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <Button 
                  className="w-full bg-easyroi-navy hover:bg-easyroi-navy/90 text-white"
                  onClick={handleJoinDeal}
                >
                  {t('joinClubDeal')}
                </Button>
                
                <Button 
                  className="w-full" 
                  variant="outline"
                  onClick={handleDownloadBusinessPlan}
                >
                  <Download className="h-4 w-4 mr-2" />
                  {t('downloadBusinessPlan')}
                </Button>
                
                <Button 
                  className="w-full" 
                  variant="secondary"
                  onClick={handleContactManager}
                >
                  {t('contactDealManager')}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
