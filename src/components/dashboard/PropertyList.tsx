
import React from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Property } from "@/types/property";
import { EmptyState } from "@/components/ui/empty-state";
import { Home, ChevronRight } from "lucide-react";
import { PropertyCard } from "../PropertyCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useLanguage } from "@/contexts/LanguageContext";

interface PropertyListProps {
  properties: Property[];
  isLoading?: boolean;
  actionLabel?: string;
  action?: () => void;
}

export function PropertyList({ properties, isLoading = false, actionLabel, action }: PropertyListProps) {
  const { t } = useLanguage();
  
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((index) => (
            <div key={index} className="flex flex-col space-y-3">
              <Skeleton className="h-[200px] w-full rounded-lg" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      );
    }
    
    if (properties.length === 0) {
      return (
        <EmptyState
          icon={<Home size={50} />}
          title={t('noData')}
          description={t('refreshOrContactSupport')}
        />
      );
    }
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {properties.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
    );
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('properties')}</CardTitle>
      </CardHeader>
      <CardContent>{renderContent()}</CardContent>
      {!isLoading && properties.length > 0 && action && actionLabel && (
        <CardFooter className="flex justify-end">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={action}
            className="flex items-center"
          >
            {actionLabel}
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
