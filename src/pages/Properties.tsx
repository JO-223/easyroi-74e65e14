
import { useState, useEffect } from 'react';
import { PropertyCard } from '@/components/PropertyCard';
import { PropertyFilters } from '@/components/PropertyFilters';
import { PropertyDetailModal } from '@/components/PropertyDetailModal';
import { PropertyPagination } from '@/components/PropertyPagination';
import { Property, PropertyFilter } from '@/types/property';
import { fetchProperties } from '@/services/propertyService';
import { useTranslation } from '@/hooks/useTranslation';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { useAdminRole } from '@/hooks/use-admin-role';

// Define properties per page
const PROPERTIES_PER_PAGE = 9;

// Mock data for demo
const mockLocations = [
  { city: "Dubai", country: "UAE", zone: "Downtown" },
  { city: "Dubai", country: "UAE", zone: "Marina" },
  { city: "Abu Dhabi", country: "UAE", zone: "Corniche" },
  { city: "Milan", country: "Italy", zone: "Centro" },
  { city: "Rome", country: "Italy", zone: "Historic" },
];

const mockPropertyTypes = [
  { id: "1", name: "Apartment" },
  { id: "2", name: "Villa" },
  { id: "3", name: "Penthouse" },
  { id: "4", name: "Office" },
];

const mockAmenities = [
  { id: "1", name: "Pool" },
  { id: "2", name: "Gym" },
  { id: "3", name: "Parking" },
  { id: "4", name: "Beach Access" },
];

export default function Properties() {
  const t = useTranslation();
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
          locations={mockLocations}
          propertyTypes={mockPropertyTypes}
          amenities={mockAmenities}
          investorLevels={investorLevels}
        />

        {/* Properties grid */}
        {isLoadingProperties ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 9 }).map((_, index) => (
              <div key={index} className="border border-gray-200 rounded-lg overflow-hidden h-full">
                <Skeleton className="aspect-video w-full h-48" />
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
            <p className="text-lg text-gray-500 mb-4">{t('noPropertiesFound')}</p>
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
      </div>
    </DashboardLayout>
  );
}
