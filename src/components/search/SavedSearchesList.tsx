
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { fetchSavedSearches, deleteSavedSearch, buildSearchQueryFromSaved } from "@/services/savedSearchService";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { SavedPropertySearch } from "@/types/search";
import { Badge } from "@/components/ui/badge";
import { Bell, Calendar, MoreHorizontal, Settings, Search, Trash2, AlertCircle, Check } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { useNavigate } from "react-router-dom";
import { formatDate } from "@/utils/formatters";
import { EmptyState } from "@/components/ui/empty-state";

export function SavedSearchesList() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Fetch saved searches
  const { data: savedSearches = [], isLoading, error } = useQuery({
    queryKey: ["savedSearches"],
    queryFn: fetchSavedSearches,
  });

  // Delete saved search mutation
  const { mutate: handleDelete } = useMutation({
    mutationFn: deleteSavedSearch,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["savedSearches"] });
      toast({
        title: "Search deleted successfully",
        description: "Your saved search has been deleted.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error deleting search",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    },
  });

  // Apply a saved search
  const handleApplySearch = (search: SavedPropertySearch) => {
    try {
      const queryParams = buildSearchQueryFromSaved(search);
      navigate({
        pathname: "/properties",
        search: queryParams.toString(),
      });
    } catch (error) {
      console.error("Error applying search:", error);
    }
  };

  // Toggle alert status
  const toggleAlert = (search: SavedPropertySearch) => {
    // This would be implemented with a mutation to update the search
    console.log("Toggle alert for search:", search.id);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="p-6 animate-pulse flex flex-col space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            <div className="h-8 bg-gray-200 rounded w-full mt-auto"></div>
          </Card>
        ))}
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <EmptyState
        icon={<AlertCircle size={40} />}
        title="Error loading saved searches"
        description="There was a problem loading your saved searches."
        variant="card"
      />
    );
  }

  // Empty state
  if (savedSearches.length === 0) {
    return (
      <EmptyState
        icon={<Search size={40} />}
        title="No saved searches"
        description="You haven't saved any property searches yet."
        variant="card"
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {savedSearches.map((search) => (
        <Card key={search.id} className="p-6 flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="font-medium text-lg">{search.search_name}</h3>
              <p className="text-sm text-gray-500">
                Created {formatDate(search.created_at || "")}
              </p>
            </div>
            <div className="flex items-center">
              {search.is_alert && (
                <Badge variant="outline" className="mr-2 bg-yellow-50">
                  <Bell className="h-3 w-3 mr-1 text-yellow-600" />
                  Alert
                </Badge>
              )}
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-56" align="end" alignOffset={8} forceMount>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Bell className="h-4 w-4 mr-2" />
                        <span className="text-sm">Alerts</span>
                      </div>
                      <Switch
                        checked={search.is_alert}
                        onCheckedChange={() => toggleAlert(search)}
                      />
                    </div>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                      size="sm"
                      onClick={() => handleDelete(search.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete search
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="space-y-4 flex-1">
            <SearchCriteriaSummary criteria={search.search_criteria} />
          </div>

          <div className="mt-4 pt-4 border-t">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => handleApplySearch(search)}
            >
              <Search className="h-4 w-4 mr-2" />
              Apply search
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}

// Helper component to display search criteria summary
function SearchCriteriaSummary({ criteria }: { criteria: any }) {
  if (!criteria) return null;

  return (
    <div className="space-y-2">
      {criteria.location && (
        <div className="flex items-start">
          <MapPin className="h-4 w-4 text-gray-400 mr-2 mt-0.5" />
          <span className="text-sm">{Array.isArray(criteria.location) ? criteria.location.join(", ") : criteria.location}</span>
        </div>
      )}
      
      {criteria.priceRange && (
        <div className="flex items-start">
          <DollarSign className="h-4 w-4 text-gray-400 mr-2 mt-0.5" />
          <span className="text-sm">
            Price: {formatCurrency(criteria.priceRange[0])} - {formatCurrency(criteria.priceRange[1])}
          </span>
        </div>
      )}
      
      {/* Add more criteria display here as needed */}
    </div>
  );
}

// Re-export for other files that need to import it
export { SavedSearchesList };
