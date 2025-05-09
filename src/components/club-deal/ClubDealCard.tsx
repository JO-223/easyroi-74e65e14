
import { Badge } from "@/components/ui/badge";
import { BadgeLevel } from "@/components/ui/badge-level";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useLanguage } from "@/contexts/LanguageContext";
import { formatCurrency } from "@/lib/utils";
import { ClubDeal } from "@/types/clubDeal";
import { CalendarDays, MapPin, Users } from "lucide-react";
import { differenceInDays } from "date-fns";

interface ClubDealCardProps {
  deal: ClubDeal;
  onClick: () => void;
}

export function ClubDealCard({ deal, onClick }: ClubDealCardProps) {
  const { t } = useLanguage();
  
  // Get the primary image or first image
  const primaryImage = deal.images.find(img => img.is_primary) || deal.images[0];
  const imageUrl = primaryImage ? primaryImage.url : '/placeholder.svg';
  
  // Calculate funding progress percentage
  const progressPercentage = Math.min(
    Math.round((deal.fundingCurrent / deal.fundingTarget) * 100),
    100
  );
  
  // Calculate days remaining if funding is in progress
  let daysRemaining: number | null = null;
  if (deal.status === 'funding_in_progress' && deal.fundingDeadline) {
    daysRemaining = differenceInDays(
      new Date(deal.fundingDeadline),
      new Date()
    );
    daysRemaining = Math.max(0, daysRemaining);
  }
  
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
  
  return (
    <Card 
      className="overflow-hidden h-full flex flex-col hover:shadow-md transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <div className="relative h-52">
        <img
          src={imageUrl}
          alt={deal.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-0 right-0 m-2">
          <BadgeLevel level={deal.investorLevel} />
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
          <Badge className={`${statusBadge.color} border-none text-white`}>
            {statusBadge.label}
          </Badge>
        </div>
      </div>
      
      <CardContent className="flex-grow p-4">
        <h3 className="font-semibold text-lg mb-1 line-clamp-1">{deal.name}</h3>
        
        <div className="flex items-center text-sm text-muted-foreground mb-3">
          <MapPin className="h-4 w-4 mr-1" />
          <span className="line-clamp-1">{deal.location.city}, {deal.location.country}</span>
        </div>
        
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {deal.description}
        </p>
        
        <div className="space-y-4">
          {deal.status === 'funding_in_progress' && (
            <>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>{t('fundingProgress')}</span>
                  <span>{progressPercentage}%</span>
                </div>
                <Progress value={progressPercentage} className="h-2" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{formatCurrency(deal.fundingCurrent, 'EUR')}</span>
                  <span>{formatCurrency(deal.fundingTarget, 'EUR')}</span>
                </div>
              </div>
              
              {daysRemaining !== null && (
                <div className="flex items-center text-sm">
                  <CalendarDays className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>
                    {daysRemaining === 0 ? 
                      t('fundingDeadline') + ': ' + t('today') :
                      `${daysRemaining} ${t('daysRemaining')}`
                    }
                  </span>
                </div>
              )}
            </>
          )}
          
          <div className="flex items-center text-sm">
            <Users className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>
              {deal.investorsCount} {t('investorsParticipating')}
            </span>
          </div>
          
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <p className="text-muted-foreground">{t('minInvestment')}</p>
              <p className="font-medium">{formatCurrency(deal.minInvestment, 'EUR')}</p>
            </div>
            <div>
              <p className="text-muted-foreground">{t('estimatedRentalROI')}</p>
              <p className="font-medium text-easyroi-gold">{deal.expectedRentalROI}%</p>
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0">
        <Button className="w-full" variant="default">
          {t('projectDetails')}
        </Button>
      </CardFooter>
    </Card>
  );
}
