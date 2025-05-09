
import { useState } from "react";
import { ClubDeal } from "@/types/clubDeal";
import { ClubDealCard } from "./ClubDealCard";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

interface ClubDealListProps {
  clubDeals: ClubDeal[];
  isLoading: boolean;
}

export function ClubDealList({ clubDeals, isLoading }: ClubDealListProps) {
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  const handleClubDealClick = (clubDealId: string) => {
    navigate(`/dashboard/club-deal/${clubDealId}`);
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
  
  if (clubDeals.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium break-words">{t('noClubDealsFound')}</h3>
        <p className="text-muted-foreground mt-2 break-words">{t('tryDifferentFilters')}</p>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {clubDeals.map((clubDeal) => (
        <ClubDealCard 
          key={clubDeal.id} 
          clubDeal={clubDeal} 
          onClick={() => handleClubDealClick(clubDeal.id)}
        />
      ))}
    </div>
  );
}
