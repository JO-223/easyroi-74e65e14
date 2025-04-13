import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchSavedSearches, deleteSavedSearch, buildSearchQueryFromSaved } from "@/services/savedSearchService";
import { SavedPropertySearch } from "@/types/search";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertTriangle, Bell, BellOff, Search, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";

export function SavedSearchesList() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [savedSearches, setSavedSearches] = useState<SavedPropertySearch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  
  useEffect(() => {
    loadSavedSearches();
  }, []);
  
  const loadSavedSearches = async () => {
    setIsLoading(true);
    try {
      const searches = await fetchSavedSearches();
      setSavedSearches(searches);
    } catch (error) {
      console.error("Error fetching saved searches:", error);
      toast({
        title: t("error"),
        description: t("errorFetchingSavedSearches"),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDeleteSearch = async (searchId: string) => {
    setIsDeleting(searchId);
    try {
      await deleteSavedSearch(searchId);
      setSavedSearches(searches => searches.filter(s => s.id !== searchId));
      toast({
        title: t("success"),
        description: t("searchDeletedSuccessfully"),
      });
    } catch (error) {
      console.error("Error deleting saved search:", error);
      toast({
        title: t("error"),
        description: t("errorDeletingSearch"),
        variant: "destructive",
      });
    } finally {
      setIsDeleting(null);
    }
  };
  
  const handleApplySearch = (search: SavedPropertySearch) => {
    const filter = buildSearchQueryFromSaved(search);
    const queryParams = new URLSearchParams();
    
    // Build query parameters based on the filter
    if (filter.location) queryParams.append("location", filter.location);
    if (filter.type) queryParams.append("type", filter.type);
    if (filter.priceMin) queryParams.append("priceMin", filter.priceMin.toString());
    if (filter.priceMax) queryParams.append("priceMax", filter.priceMax.toString());
    if (filter.bedroomsMin) queryParams.append("bedroomsMin", filter.bedroomsMin.toString());
    if (filter.bedroomsMax) queryParams.append("bedroomsMax", filter.bedroomsMax.toString());
    if (filter.bathroomsMin) queryParams.append("bathroomsMin", filter.bathroomsMin.toString());
    if (filter.bathroomsMax) queryParams.append("bathroomsMax", filter.bathroomsMax.toString());
    
    navigate(`/properties?${queryParams.toString()}`);
  };
  
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-6 w-16" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }
  
  if (savedSearches.length === 0) {
    return (
      <EmptyState
        icon={<Search size={40} />}
        title={t("noSavedSearches")}
        description={t("noSavedSearchesDescription")}
      />
    );
  }
  
  return (
    <div className="space-y-4">
      {savedSearches.map(search => (
        <Card key={search.id}>
          <CardHeader>
            <CardTitle className="flex items-center">
              {search.search_name}
              {search.is_alert && (
                <Badge variant="outline" className="ml-2 bg-blue-50 text-blue-700">
                  <Bell className="h-3 w-3 mr-1" />
                  {search.alert_frequency}
                </Badge>
              )}
            </CardTitle>
            <CardDescription>
              {new Date(search.created_at).toLocaleDateString()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {search.locations?.map(location => (
                <Badge key={location} variant="secondary">{location}</Badge>
              ))}
              
              {search.price_range && (
                <Badge variant="secondary">
                  {search.price_range[0]} - {search.price_range[1]} €
                </Badge>
              )}
              
              {search.property_types?.map(type => (
                <Badge key={type} variant="secondary">{type}</Badge>
              ))}
              
              {(search.min_bedrooms || search.max_bedrooms) && (
                <Badge variant="secondary">
                  {search.min_bedrooms || 0} - {search.max_bedrooms || '∞'} {t("bedrooms")}
                </Badge>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleApplySearch(search)}
            >
              <Search className="h-4 w-4 mr-2" />
              {t("applySearch")}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDeleteSearch(search.id)}
              disabled={isDeleting === search.id}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              {t("delete")}
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

export { SavedSearchesList };
