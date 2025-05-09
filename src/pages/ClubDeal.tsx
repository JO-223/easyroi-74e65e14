
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { fetchClubDeals } from "@/services/clubDealService";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { ClubDealList } from "@/components/clubdeal/ClubDealList";
import { ClubDealFilters } from "@/components/clubdeal/ClubDealFilters";
import { Separator } from "@/components/ui/separator";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";

export default function ClubDeal() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [activeFilters, setActiveFilters] = useState<any>({});
  
  const { data: clubDeals = [], isLoading, error } = useQuery({
    queryKey: ['clubDeals'],
    queryFn: fetchClubDeals,
    meta: {
      onError: () => {
        toast({
          title: t('error'),
          description: t('pleaseTryAgainLater'),
          variant: "destructive",
        });
      },
    },
  });
  
  // Apply filters to club deals
  const filteredClubDeals = clubDeals.filter((clubDeal: any) => {
    // ROI range filter
    if (activeFilters.roiMin !== undefined && 
        activeFilters.roiMax !== undefined &&
        (clubDeal.expectedAnnualRoi < activeFilters.roiMin || 
         clubDeal.expectedAnnualRoi > activeFilters.roiMax)) {
      return false;
    }
    
    // Min investment filter
    if (activeFilters.minInvestment && 
        clubDeal.minInvestment > activeFilters.minInvestment) {
      return false;
    }
    
    // Location filter (city, country)
    if (activeFilters.location && clubDeal.location) {
      const locationSearchTerm = activeFilters.location.toLowerCase();
      const locationMatch = 
        clubDeal.location.city?.toLowerCase().includes(locationSearchTerm) ||
        clubDeal.location.country?.toLowerCase().includes(locationSearchTerm);
      
      if (!locationMatch) return false;
    }
    
    // Status filter
    if (activeFilters.status && 
        clubDeal.status !== activeFilters.status) {
      return false;
    }
    
    return true;
  });
  
  const handleApplyFilters = (filters: any) => {
    setActiveFilters(filters);
  };
  
  return (
    <DashboardLayout title={t('clubDeals')} subtitle={t('exploreClubDealOpportunities')}>
      <div className="container mx-auto py-6 px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="w-full">
            <h1 className="text-2xl font-semibold tracking-tight break-words">{t('clubDeals')}</h1>
            <p className="text-muted-foreground break-words">{t('exploreClubDealOpportunities')}</p>
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
              clubDeals={filteredClubDeals} 
              isLoading={isLoading} 
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
