
import { useState, useEffect } from 'react';
import { PropertyCard } from '@/components/PropertyCard';
import { PropertyFilters } from '@/components/PropertyFilters';
import { PropertyDetailModal } from '@/components/PropertyDetailModal';
import { PropertyPagination } from '@/components/PropertyPagination';
import { PropertyImport } from '@/components/PropertyImport';
import { Property, PropertyFilter } from '@/types/property';
import { fetchProperties, fetchLocations, fetchPropertyTypes, fetchAmenities } from '@/services/propertyService';
import { useLanguage } from '@/contexts/LanguageContext';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { useAdminRole } from '@/hooks/use-admin-role';

// Define properties per page
const PROPERTIES_PER_PAGE = 9;

export default function Properties() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<PropertyFilter>({});
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const { isAdmin } = useAdminRole();
  
  // Fetch properties
  const { data: properties = [], isLoading: isLoadingProperties } = useQuery({
    queryKey: ['properties', filters],
    queryFn: () => fetchProperties(filters),
  });
  
  // Fetch locations for filters
  const { data: locations = [] } = useQuery({
    queryKey: ['locations'],
    queryFn: () => {
      return fetchLocations().then(locs => 
        locs.map((loc: any) => ({
          city: loc.city as string,
          country: loc.country as string,
          zone: loc.zone as string
        }))
      );
    },
  });
  
  // Fetch property types for filters
  const { data: propertyTypes = [] } = useQuery({
    queryKey: ['propertyTypes'],
    queryFn: () => {
      return fetchPropertyTypes().then(types => 
        types.map((type: any) => ({
          id: type.id as string,
          name: type.name as string
        }))
      );
    },
  });
  
  // Fetch amenities for filters
  const { data: amenities = [] } = useQuery({
    queryKey: ['amenities'],
    queryFn: () => {
      return fetchAmenities().then(ams => 
        ams.map((am: any) => ({
          id: am.id as string,
          name: am.name as string
        }))
      );
    },
  });
  
  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);
  
  // Calculate pagination values
  const totalPages = Math.ceil(properties.length / PROPERTIES_PER_PAGE);
  const startIndex = (currentPage - 1) * PROPERTIES_PER_PAGE;
  const paginatedProperties = properties.slice(startIndex, startIndex + PROPERTIES_PER_PAGE);
  
  // Handle filter changes
  const handleFilterChange = (newFilters: PropertyFilter) => {
    setFilters(newFilters);
  };
  
  // Handle property card click
  const handleViewPropertyDetails = (property: Property) => {
    setSelectedProperty(property);
    setIsDetailModalOpen(true);
  };
  
  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
  };

  // Investor levels for filtering
  const investorLevels = ['bronze', 'silver', 'gold', 'platinum', 'diamond'];

  return (
    <DashboardLayout title={t('properties')} subtitle={""}>
      <div className="min-h-screen pb-20 bg-white">
        <div className="mb-6">
          <h2 className="text-3xl font-bold">{t('exclusiveProperties')}</h2>
        </div>

        {/* Filters section */}
        <PropertyFilters 
          onFilterChange={handleFilterChange}
          locations={locations}
          propertyTypes={propertyTypes}
          amenities={amenities}
          investorLevels={investorLevels}
        />

        {/* Properties grid */}
        {isLoadingProperties ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 9 }).map((_, index) => (
              <div key={index} className="luxury-card overflow-hidden backdrop-blur-md bg-white/5 border-white/10">
                <Skeleton className="aspect-video w-full h-60" />
                <div className="p-6">
                  <Skeleton className="h-6 w-3/4 mb-4" />
                  <Skeleton className="h-4 w-1/2 mb-2" />
                  <div className="grid grid-cols-2 gap-4 my-4">
                    <Skeleton className="h-12" />
                    <Skeleton className="h-12" />
                    <Skeleton className="h-12" />
                    <Skeleton className="h-12" />
                  </div>
                  <Skeleton className="h-10 mt-4" />
                </div>
              </div>
            ))}
          </div>
        ) : paginatedProperties.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {paginatedProperties.map((property) => (
                <PropertyCard 
                  key={property.id} 
                  property={property} 
                  onViewDetails={handleViewPropertyDetails} 
                />
              ))}
            </div>
            
            <div className="mt-10 flex justify-center">
              <PropertyPagination 
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-lg text-gray-500 mb-4">{t('nessuna proprietà trovata, prova con filtri diversi')}</p>
            <Button 
              onClick={() => setFilters({})}
              className="bg-easyroi-gold text-easyroi-navy hover:bg-easyroi-gold/90"
            >
              {t('resetFilters')}
            </Button>
          </div>
        )}
        
        {/* Property detail modal */}
        <PropertyDetailModal 
          property={selectedProperty}
          isOpen={isDetailModalOpen}
          onClose={handleCloseDetailModal}
        />

        {/* Property Import button (moved to bottom right corner) */}
        <div className="fixed bottom-6 right-6 z-10">
          <PropertyImport />
        </div>
      </div>
    </DashboardLayout>
  );
}
