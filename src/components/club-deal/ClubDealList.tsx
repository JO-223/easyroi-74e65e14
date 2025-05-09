
import { ClubDeal } from "@/types/clubDeal";
import { ClubDealCard } from "./ClubDealCard";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

interface ClubDealListProps {
  deals: ClubDeal[];
  isLoading: boolean;
}

export function ClubDealList({ deals, isLoading }: ClubDealListProps) {
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  const handleDealClick = (dealId: string) => {
    navigate(`/dashboard/club-deal/${dealId}`);
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
  
  if (deals.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium break-words">{t('noProjectsFound')}</h3>
        <p className="text-muted-foreground mt-2 break-words">{t('tryDifferentFilters')}</p>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {deals.map((deal) => (
        <ClubDealCard 
          key={deal.id} 
          deal={deal} 
          onClick={() => handleDealClick(deal.id)}
        />
      ))}
    </div>
  );
}
