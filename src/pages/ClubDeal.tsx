
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { fetchClubDeals } from "@/services/clubDealService";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { ClubDealList } from "@/components/club-deal/ClubDealList";
import { ClubDealFilters } from "@/components/club-deal/ClubDealFilters";
import { Separator } from "@/components/ui/separator";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { ClubDeal } from "@/types/clubDeal";

export default function ClubDealPage() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [activeFilters, setActiveFilters] = useState<any>({});
  
  const { data: deals = [], isLoading, error } = useQuery({
    queryKey: ['clubDeals'],
    queryFn: fetchClubDeals,
    meta: {
      onError: () => {
        toast({
          title: t('errorFetchingProjects'),
          description: t('pleaseTryAgainLater'),
          variant: "destructive",
        });
      },
    },
  });
  
  // Apply filters to deals
  const filteredDeals = deals.filter((deal: ClubDeal) => {
    // Investor level filter
    if (activeFilters.investorLevel && 
        deal.investorLevel !== activeFilters.investorLevel) {
      return false;
    }
    
    // Min investment filter
    if (activeFilters.minInvestment && 
        deal.minInvestment > activeFilters.minInvestment) {
      return false;
    }
    
    // Rental ROI range filter
    if (activeFilters.rentalROIMin !== undefined && 
        activeFilters.rentalROIMax !== undefined &&
        (deal.expectedRentalROI < activeFilters.rentalROIMin || 
         deal.expectedRentalROI > activeFilters.rentalROIMax)) {
      return false;
    }
    
    // Total ROI range filter
    if (activeFilters.totalROIMin !== undefined && 
        activeFilters.totalROIMax !== undefined &&
        (deal.expectedTotalROI < activeFilters.totalROIMin || 
         deal.expectedTotalROI > activeFilters.totalROIMax)) {
      return false;
    }
    
    // Location filter (city, zone, country)
    if (activeFilters.location && deal.location) {
      const locationSearchTerm = activeFilters.location.toLowerCase();
      const locationMatch = 
        deal.location.city?.toLowerCase().includes(locationSearchTerm) ||
        deal.location.zone?.toLowerCase().includes(locationSearchTerm) ||
        deal.location.country?.toLowerCase().includes(locationSearchTerm);
      
      if (!locationMatch) return false;
    }
    
    // Status filter
    if (activeFilters.status && 
        deal.status !== activeFilters.status) {
      return false;
    }
    
    return true;
  });
  
  const handleApplyFilters = (filters: any) => {
    setActiveFilters(filters);
  };
  
  return (
    <DashboardLayout title={t('clubDeal')} subtitle={t('exploreClubDeals')}>
      <div className="container mx-auto py-6 px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="w-full">
            <h1 className="text-2xl font-semibold tracking-tight break-words">{t('clubDeal')}</h1>
            <p className="text-muted-foreground break-words">{t('exploreClubDeals')}</p>
          </div>
        </div>
        
        <Separator className="my-6" />
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <ClubDealFilters onApplyFilters={handleApplyFilters} />
            </div>
          </div>
          
          <div className="lg:col-span-3">
            <ClubDealList 
              deals={filteredDeals} 
              isLoading={isLoading} 
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
