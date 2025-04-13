
import React from 'react';
import { Property } from '@/types/property';
import PropertyCard from '@/components/PropertyCard';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { EmptyState } from '@/components/ui/empty-state';
import { Home } from 'lucide-react';

interface PropertyListProps {
  properties: Property[];
  compact?: boolean;
}

export function PropertyList({ properties, compact = false }: PropertyListProps) {
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  if (properties.length === 0) {
    return (
      <EmptyState 
        icon={<Home size={40} />}
        title={t("noData")}
        description={t("noData")}
        variant="card"
      />
    );
  }
  
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {properties.slice(0, 3).map(property => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
      
      {!compact && properties.length > 3 && (
        <div className="mt-4 flex justify-center">
          <Button 
            variant="outline"
            onClick={() => navigate('/properties')}
          >
            {t("viewAllProperties")}
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      )}
    </div>
  );
}
