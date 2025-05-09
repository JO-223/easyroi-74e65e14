
import { ClubDeal } from "@/types/clubDeal";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Calendar, Users, Landmark, TrendingUp } from "lucide-react";
import { format } from "date-fns";
import { useLanguage } from "@/contexts/LanguageContext";

interface ClubDealCardProps {
  clubDeal: ClubDeal;
  onClick?: () => void;
}

export function ClubDealCard({
  clubDeal,
  onClick
}: ClubDealCardProps) {
  const { t } = useLanguage();
  
  const primaryImage = clubDeal.images.find(img => img.is_primary) || clubDeal.images[0];
  const imageUrl = primaryImage ? primaryImage.url : '/placeholder.svg';
  
  // Calculate fundraising progress percentage
  const progressPercentage = (clubDeal.fundraising.raised / clubDeal.fundraising.goal) * 100;
  
  // Format deadline date
  const formattedDeadline = clubDeal.fundraising.deadline ? 
    format(new Date(clubDeal.fundraising.deadline), 'MMM d, yyyy') : 
    t('tbd');
  
  // Get status label based on clubDeal status
  const getStatusLabel = (status: string) => {
    return t(`clubDealStatus_${status}` as any);
  };
  
  // Get status color based on status
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
    <Card className="group overflow-hidden border rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 cursor-pointer flex flex-col" onClick={onClick}>
      <div className="relative h-48 overflow-hidden">
        <img src={imageUrl} alt={clubDeal.name} className="w-full h-full transition-transform duration-500 group-hover:scale-105 object-cover" />
        <div className="absolute top-2 right-2">
          <Badge className={`font-semibold ${getStatusColorClass(clubDeal.status)}`}>
            {getStatusLabel(clubDeal.status)}
          </Badge>
        </div>
      </div>
      
      <CardContent className="p-4 flex-grow">
        <h3 className="text-lg font-semibold line-clamp-1">{clubDeal.name}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
          {clubDeal.description}
        </p>
        
        {clubDeal.status === 'fundraising' && (
          <div className="mt-3">
            <div className="flex justify-between text-sm mb-1">
              <span>{t('fundraisingProgress')}</span>
              <span>{Math.round(progressPercentage)}%</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
        )}
        
        <div className="mt-4 space-y-2">
          <div className="flex items-center text-sm text-muted-foreground">
            <Landmark className="h-4 w-4 mr-2 shrink-0" />
            <span className="truncate">
              {clubDeal.location.city}, {clubDeal.location.country}
            </span>
          </div>
          
          <div className="flex items-center text-sm text-muted-foreground">
            <TrendingUp className="h-4 w-4 mr-2 shrink-0" />
            <span>{t('expectedAnnualRoi')}: {clubDeal.expectedAnnualRoi}%</span>
          </div>
          
          {clubDeal.status === 'fundraising' && (
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="h-4 w-4 mr-2 shrink-0" />
              <span>{t('fundraisingDeadline')}: {formattedDeadline}</span>
            </div>
          )}
          
          {clubDeal.status === 'fundraising' && (
            <div className="flex items-center text-sm text-muted-foreground">
              <Users className="h-4 w-4 mr-2 shrink-0" />
              <span>{t('investorsParticipating')}: {clubDeal.fundraising.investors}</span>
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="bg-muted/50 p-4 border-t w-full">
        <div className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div>
            <p className="text-sm font-medium">{t('totalPrice')}:</p>
            <p className="text-lg font-bold text-easyroi-navy truncate">
              €{clubDeal.totalPrice.toLocaleString()}
            </p>
          </div>
          
          <div className="text-left sm:text-right">
            <p className="text-sm font-medium">{t('minInvestment')}:</p>
            <p className="text-lg font-bold text-easyroi-gold truncate">
              €{clubDeal.minInvestment.toLocaleString()}
            </p>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
