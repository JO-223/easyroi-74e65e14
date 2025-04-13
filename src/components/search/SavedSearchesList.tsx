
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { fetchUserSavedSearches, deleteSavedSearch, buildSearchQueryFromSaved } from "@/services/savedSearchService";
import { SavedPropertySearch } from "@/types/savedSearch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Bell, Calendar, Trash2, Edit, PlayCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { EmptyState } from "@/components/ui/empty-state";
import SavedSearchDialog from "./SavedSearchDialog";
import { formatDistanceToNow } from "date-fns";

export default function SavedSearchesList() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editSearch, setEditSearch] = useState<SavedPropertySearch | null>(null);
  
  const { 
    data: savedSearches = [], 
    isLoading, 
    refetch 
  } = useQuery({
    queryKey: ['savedSearches', user?.id],
    queryFn: () => fetchUserSavedSearches(user?.id as string),
    enabled: !!user?.id
  });
  
  const handleDelete = async (id: string) => {
    if (!confirm(t('confirmDeleteSavedSearch'))) return;
    
    try {
      await deleteSavedSearch(id);
      toast({
        title: t('savedSearchDeleted'),
        description: t('savedSearchDeletedSuccessfully'),
      });
      refetch();
    } catch (error) {
      console.error('Error deleting saved search:', error);
      toast({
        title: t('errorDeletingSavedSearch'),
        description: t('pleaseTryAgainLater'),
        variant: "destructive",
      });
    }
  };
  
  const handleRunSearch = (savedSearch: SavedPropertySearch) => {
    // Convert saved search to query parameters
    const queryParams = buildSearchQueryFromSaved(savedSearch);
    
    // Convert query object to URLSearchParams
    const params = new URLSearchParams();
    Object.entries(queryParams).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach(v => params.append(`${key}[]`, v.toString()));
      } else {
        params.append(key, value.toString());
      }
    });
    
    // Navigate to properties page with query parameters
    navigate(`/properties?${params.toString()}`);
  };
  
  const getFrequencyLabel = (frequency: string) => {
    switch (frequency) {
      case 'daily': return t('daily');
      case 'weekly': return t('weekly');
      case 'monthly': return t('monthly');
      default: return frequency;
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>{t('savedSearches')}</CardTitle>
            <CardDescription>{t('savedSearchesDescription')}</CardDescription>
          </div>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            {t('newSavedSearch')}
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-muted animate-pulse rounded-md" />
            ))}
          </div>
        ) : savedSearches.length === 0 ? (
          <EmptyState
            icon={<Search className="w-10 h-10 mb-2" />}
            title={t('noSavedSearches')}
            description={t('noSavedSearchesDescription')}
            actionLabel={t('createFirstSavedSearch')}
            action={() => setIsCreateDialogOpen(true)}
          />
        ) : (
          <div className="space-y-3">
            {savedSearches.map((search) => (
              <div key={search.id} className="border rounded-md p-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center">
                    <Search className="mr-2 h-4 w-4 text-muted-foreground" />
                    <h3 className="font-medium">{search.search_name}</h3>
                    {search.is_alert && (
                      <Badge variant="outline" className="ml-2 flex items-center gap-1">
                        <Bell className="h-3 w-3" />
                        {getFrequencyLabel(search.alert_frequency || '')}
                      </Badge>
                    )}
                  </div>
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleRunSearch(search)}
                    >
                      <PlayCircle className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setEditSearch(search)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(search.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-2 text-sm">
                  {search.locations && search.locations.length > 0 && (
                    <div>
                      <span className="text-muted-foreground">{t('locations')}:</span>{' '}
                      {search.locations.join(', ')}
                    </div>
                  )}
                  
                  {search.property_types && search.property_types.length > 0 && (
                    <div>
                      <span className="text-muted-foreground">{t('propertyTypes')}:</span>{' '}
                      {search.property_types.join(', ')}
                    </div>
                  )}
                  
                  {(search.min_bedrooms !== null || search.max_bedrooms !== null) && (
                    <div>
                      <span className="text-muted-foreground">{t('bedrooms')}:</span>{' '}
                      {search.min_bedrooms || 0} - {search.max_bedrooms || '∞'}
                    </div>
                  )}
                  
                  {(search.min_bathrooms !== null || search.max_bathrooms !== null) && (
                    <div>
                      <span className="text-muted-foreground">{t('bathrooms')}:</span>{' '}
                      {search.min_bathrooms || 0} - {search.max_bathrooms || '∞'}
                    </div>
                  )}
                  
                  {search.min_roi !== null && (
                    <div>
                      <span className="text-muted-foreground">{t('minROI')}:</span>{' '}
                      {search.min_roi}%
                    </div>
                  )}
                  
                  {search.price_range && (
                    <div>
                      <span className="text-muted-foreground">{t('priceRange')}:</span>{' '}
                      {search.price_range}
                    </div>
                  )}
                </div>
                
                <p className="text-xs text-muted-foreground mt-2">
                  <Calendar className="inline h-3 w-3 mr-1" />
                  {t('created')} {formatDistanceToNow(new Date(search.created_at), { addSuffix: true })}
                </p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      
      <SavedSearchDialog
        isOpen={isCreateDialogOpen || !!editSearch}
        onClose={() => {
          setIsCreateDialogOpen(false);
          setEditSearch(null);
        }}
        existingSearch={editSearch}
        onSuccess={() => {
          setIsCreateDialogOpen(false);
          setEditSearch(null);
          refetch();
        }}
      />
    </Card>
  );
}
