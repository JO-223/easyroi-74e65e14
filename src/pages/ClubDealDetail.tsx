
import { useQuery } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import { fetchClubDeal } from "@/services/clubDealService";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { ClubDealTimeline } from "@/components/clubdeal/ClubDealTimeline";
import { ClubDealDocumentsSection } from "@/components/clubdeal/ClubDealDocumentsSection";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, Download, Users, Phone, Mail, Calendar, TrendingUp, Landmark } from "lucide-react";

export default function ClubDealDetail() {
  const { id } = useParams<{ id: string }>();
  const { t } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const { data: clubDeal, isLoading, error } = useQuery({
    queryKey: ['clubDeal', id],
    queryFn: () => fetchClubDeal(id as string),
    meta: {
      onError: () => {
        toast({
          title: t('error'),
          description: t('errorLoadingProject'),
          variant: "destructive",
        });
      },
    },
    enabled: !!id,
  });
  
  const handleBackClick = () => {
    navigate('/dashboard/club-deal');
  };
  
  // Loading state
  if (isLoading) {
    return (
      <DashboardLayout title={t('loading')} subtitle="">
        <div className="container mx-auto py-6 px-4 md:px-6">
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={handleBackClick}>
              <ChevronLeft className="h-4 w-4 mr-1" />
              {t('back')}
            </Button>
          </div>
          
          <div className="mt-6 h-96 w-full animate-pulse bg-muted rounded-lg"></div>
        </div>
      </DashboardLayout>
    );
  }
  
  // Error state
  if (error || !clubDeal) {
    return (
      <DashboardLayout title={t('clubDealDetails')} subtitle="">
        <div className="container mx-auto py-6 px-4 md:px-6">
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={handleBackClick}>
              <ChevronLeft className="h-4 w-4 mr-1" />
              {t('back')}
            </Button>
          </div>
          
          <div className="mt-6 text-center py-12">
            <h3 className="text-lg font-medium">{t('projectNotFound')}</h3>
            <p className="text-muted-foreground mt-2">{t('projectMayHaveBeenRemoved')}</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }
  
  // Format dates
  const formattedDeadline = clubDeal.fundraising.deadline ? 
    format(new Date(clubDeal.fundraising.deadline), 'MMMM d, yyyy') : 
    t('tbd');
  
  const formattedAcquisitionDate = clubDeal.acquisitionDate ? 
    format(new Date(clubDeal.acquisitionDate), 'MMMM d, yyyy') : 
    t('tbd');
  
  // Progress percentage
  const progressPercentage = (clubDeal.fundraising.raised / clubDeal.fundraising.goal) * 100;
  
  // Get status label
  const getStatusLabel = (status: string) => {
    return t(`clubDealStatus_${status}` as any);
  };
  
  // Get status color class
  const getStatusColorClass = (status: string) => {
    switch (status) {
      case 'fundraising':
        return 'bg-amber-500 text-white';
      case 'purchased':
        return 'bg-blue-500 text-white';
      case 'rented':
        return 'bg-green-500 text-white';
      case 'readyForSale':
        return 'bg-easyroi-gold text-easyroi-navy';
      default:
        return 'bg-gray-500 text-white';
    }
  };
  
  return (
    <DashboardLayout title={clubDeal.name} subtitle={`${clubDeal.location.city}, ${clubDeal.location.country}`}>
      <div className="container mx-auto py-6 px-4 md:px-6">
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={handleBackClick}>
            <ChevronLeft className="h-4 w-4 mr-1" />
            {t('back')}
          </Button>
          <Badge className={`ml-2 ${getStatusColorClass(clubDeal.status)}`}>
            {getStatusLabel(clubDeal.status)}
          </Badge>
        </div>
        
        {/* Main content */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column - Images and description */}
          <div className="lg:col-span-2">
            {/* Image gallery */}
            <div className="relative h-64 md:h-96 overflow-hidden rounded-lg">
              <img 
                src={clubDeal.images[0]?.url || '/placeholder.svg'} 
                alt={clubDeal.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Thumbnails */}
            {clubDeal.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2 mt-2">
                {clubDeal.images.slice(0, 4).map((image) => (
                  <div key={image.id} className="h-20 rounded overflow-hidden">
                    <img 
                      src={image.url} 
                      alt={clubDeal.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
            
            {/* Description */}
            <div className="mt-6">
              <h2 className="text-2xl font-bold">{clubDeal.name}</h2>
              <div className="flex items-center mt-2 text-sm text-muted-foreground">
                <Landmark className="mr-1 h-4 w-4" />
                <span>
                  {clubDeal.location.address && `${clubDeal.location.address}, `}
                  {clubDeal.location.city}, {clubDeal.location.country}
                </span>
              </div>
              
              <Separator className="my-4" />
              
              <div className="prose max-w-none">
                <p>{clubDeal.description}</p>
              </div>
            </div>
            
            {/* Documents Section */}
            <div className="mt-8">
              <ClubDealDocumentsSection documents={clubDeal.documents} />
            </div>
            
            {/* Timeline Section */}
            <div className="mt-8">
              <ClubDealTimeline events={clubDeal.timeline} />
            </div>
          </div>
          
          {/* Right column - Investment details and actions */}
          <div className="lg:col-span-1">
            {/* Investment details */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold">{t('investmentDetails')}</h3>
                
                {/* Total price */}
                <div className="mt-4 flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">{t('totalPrice')}</span>
                  <span className="font-semibold">€{clubDeal.totalPrice.toLocaleString()}</span>
                </div>
                
                {/* Current value */}
                <div className="mt-2 flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">{t('currentValue')}</span>
                  <span className="font-semibold">€{clubDeal.currentValue.toLocaleString()}</span>
                </div>
                
                {/* Min investment */}
                <div className="mt-2 flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">{t('minInvestment')}</span>
                  <span className="font-semibold text-easyroi-gold">€{clubDeal.minInvestment.toLocaleString()}</span>
                </div>
                
                <Separator className="my-4" />
                
                {/* ROI information */}
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">{t('expectedAnnualRoi')}</span>
                  <span className="font-semibold text-easyroi-navy">{clubDeal.expectedAnnualRoi}%</span>
                </div>
                
                <div className="mt-2 flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">{t('expectedTotalRoi')}</span>
                  <span className="font-bold text-easyroi-navy">{clubDeal.expectedTotalRoi}%</span>
                </div>
                
                {clubDeal.rentalPeriodYears && (
                  <div className="mt-2 flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">{t('rentalPeriodYears')}</span>
                    <span className="font-semibold">{clubDeal.rentalPeriodYears} {clubDeal.rentalPeriodYears === 1 ? t('year') : t('years')}</span>
                  </div>
                )}
                
                {clubDeal.acquisitionDate && (
                  <div className="mt-2 flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">{t('acquisitionDate')}</span>
                    <span className="font-semibold">{formattedAcquisitionDate}</span>
                  </div>
                )}
                
                {/* Fundraising section for fundraising status */}
                {clubDeal.status === 'fundraising' && (
                  <>
                    <Separator className="my-4" />
                    
                    <h4 className="font-medium">{t('fundraisingProgress')}</h4>
                    
                    <div className="mt-2">
                      <div className="flex justify-between text-sm mb-1">
                        <span>€{clubDeal.fundraising.raised.toLocaleString()}</span>
                        <span>€{clubDeal.fundraising.goal.toLocaleString()}</span>
                      </div>
                      <Progress value={progressPercentage} className="h-2" />
                    </div>
                    
                    <div className="mt-3 space-y-2">
                      <div className="flex items-center text-sm">
                        <Users className="h-4 w-4 mr-2" />
                        <span>{t('investorsParticipating')}: </span>
                        <span className="font-medium ml-1">{clubDeal.fundraising.investors}</span>
                      </div>
                      
                      <div className="flex items-center text-sm">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>{t('fundraisingDeadline')}: </span>
                        <span className="font-medium ml-1">{formattedDeadline}</span>
                      </div>
                    </div>
                  </>
                )}
                
                {/* CTA Buttons */}
                <div className="mt-6 space-y-3">
                  <Button className="w-full bg-easyroi-navy hover:bg-easyroi-navy/90">
                    {clubDeal.status === 'fundraising' ? t('joinClubDeal') : t('contactDealManager')}
                  </Button>
                  
                  {clubDeal.documents.some(doc => doc.type === 'business_plan') && (
                    <Button variant="outline" className="w-full">
                      <Download className="h-4 w-4 mr-2" />
                      {t('downloadBusinessPlan')}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
            
            {/* Deal Manager Card */}
            <Card className="mt-6">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold">{t('dealManager')}</h3>
                
                <div className="mt-4 space-y-3">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-easyroi-navy flex items-center justify-center text-white">
                      {clubDeal.dealManager.name.charAt(0)}
                    </div>
                    <div className="ml-3">
                      <p className="font-medium">{clubDeal.dealManager.name}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <Mail className="h-4 w-4 mr-2" />
                      <a href={`mailto:${clubDeal.dealManager.email}`} className="text-easyroi-navy hover:underline">
                        {clubDeal.dealManager.email}
                      </a>
                    </div>
                    
                    {clubDeal.dealManager.phone && (
                      <div className="flex items-center text-sm">
                        <Phone className="h-4 w-4 mr-2" />
                        <a href={`tel:${clubDeal.dealManager.phone}`} className="text-easyroi-navy hover:underline">
                          {clubDeal.dealManager.phone}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
