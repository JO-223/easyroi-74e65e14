
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchSavedSearches, deleteSavedSearch, buildSearchQueryFromSaved } from "@/services/savedSearchService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Trash2, Bell, Clock, MapPin, DollarSign } from "lucide-react";
import { formatCurrency } from "@/utils/formatters";
import { SavedPropertySearch } from "@/types/search";

export function SavedSearchesList() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const { data: savedSearches = [], isLoading, isError, refetch } = useQuery({
    queryKey: ["savedSearches"],
    queryFn: () => fetchSavedSearches(),
    staleTime: 1000 * 60 * 5, // 5 minutes
    meta: {
      onError: () => {
        toast({
          title: "Error",
          description: t('errorFetchingSavedSearches'),
          variant: "destructive"
        });
      },
    },
  });
  
  const handleDeleteSearch = async (searchId: string) => {
    const confirmed = window.confirm(t("confirmDeleteSearch"));
    if (!confirmed) return;
    
    try {
      await deleteSavedSearch(searchId);
      await refetch();
      
      toast({
        title: "Success",
        description: t('searchDeletedSuccessfully')
      });
    } catch (error) {
      toast({
        title: "Error",
        description: t('errorDeletingSearch'),
        variant: "destructive"
      });
    }
  };
  
  const handleApplySearch = (savedSearch: SavedPropertySearch) => {
    const filter = buildSearchQueryFromSaved(savedSearch);
    navigate("/properties", { state: { filter } });
  };
  
  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }
  
  if (isError) {
    return (
      <div className="text-center py-8">
        <h3 className="text-lg font-medium text-gray-900">Failed to load saved searches</h3>
        <Button onClick={() => refetch()} className="mt-4" variant="outline">
          Try Again
        </Button>
      </div>
    );
  }
  
  if (savedSearches.length === 0) {
    return (
      <div className="text-center py-12 border rounded-md">
        <h3 className="text-lg font-medium text-gray-900">{t("noSavedSearches")}</h3>
        <p className="mt-2 text-sm text-gray-500">{t("noSavedSearchesDescription")}</p>
      </div>
    );
  }
  
  // Function to render search criteria for display
  const renderSearchCriteria = (search: SavedPropertySearch) => {
    const criteria = search.search_criteria;
    if (!criteria) return null;
    
    return (
      <div className="mt-2 space-y-2">
        {/* Location */}
        {criteria.location && criteria.location.length > 0 && (
          <div className="flex items-center gap-1 text-sm">
            <MapPin className="h-4 w-4 text-gray-500" />
            <span>{Array.isArray(criteria.location) ? criteria.location.join(", ") : criteria.location}</span>
          </div>
        )}
        
        {/* Price Range */}
        {criteria.priceRange && (
          <div className="flex items-center gap-1 text-sm">
            <DollarSign className="h-4 w-4 text-gray-500" />
            <span>
              {formatCurrency(criteria.priceRange[0])} - {formatCurrency(criteria.priceRange[1])}
            </span>
          </div>
        )}
      </div>
    );
  };
  
  return (
    <div className="space-y-4">
      {savedSearches.map((search) => (
        <Card key={search.id} className="overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">{search.search_name}</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDeleteSearch(search.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            
            {search.is_alert && (
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="flex items-center gap-1 text-amber-600 bg-amber-50">
                  <Bell className="h-3 w-3" />
                  {t("alertActive")}
                </Badge>
                <span className="text-xs text-gray-500">
                  <Clock className="inline h-3 w-3 mr-1" />
                  {search.alert_frequency}
                </span>
              </div>
            )}
          </CardHeader>
          
          <CardContent>
            {renderSearchCriteria(search)}
            
            <Button
              className="w-full mt-4"
              onClick={() => handleApplySearch(search)}
            >
              {t("applySearch")}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
