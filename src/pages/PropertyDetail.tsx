
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { useTranslation } from "@/hooks/useTranslation";
import { Property } from "@/types/property";
import { formatCurrency } from "@/lib/utils";
import { 
  Bed, 
  Bath, 
  MapPin, 
  CheckCircle, 
  XCircle, 
  Home, 
  SquareFoot, 
  CreditCard,
  Percent
} from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { fetchPropertyById } from "@/services/propertyService";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function PropertyDetail() {
  const { id } = useParams<{ id: string }>();
  const t = useTranslation();
  const [property, setProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadProperty = async () => {
      if (!id) return;
      
      setIsLoading(true);
      try {
        const data = await fetchPropertyById(id);
        setProperty(data);
      } catch (error) {
        console.error("Error loading property:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadProperty();
  }, [id]);
  
  if (isLoading) {
    return (
      <DashboardLayout title={t('propertyDetails')} subtitle="">
        <div className="max-w-4xl mx-auto p-4">
          <Skeleton className="h-[400px] w-full mb-6" />
          <Skeleton className="h-10 w-2/3 mb-4" />
          <Skeleton className="h-6 w-1/2 mb-8" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Skeleton className="h-40" />
            <Skeleton className="h-40" />
          </div>
        </div>
      </DashboardLayout>
    );
  }
  
  if (!property) {
    return (
      <DashboardLayout title={t('propertyDetails')} subtitle="">
        <div className="max-w-4xl mx-auto p-4 text-center">
          <h2 className="text-2xl font-bold mb-4">{t('propertyNotFound')}</h2>
          <p className="mb-6">{t('propertyMayHaveBeenRemovedOrUnavailable')}</p>
          <Link to="/properties">
            <Button>{t('backToProperties')}</Button>
          </Link>
        </div>
      </DashboardLayout>
    );
  }
  
  // Sort images to ensure primary is first
  const sortedImages = [...property.images].sort((a, b) => {
    if (a.is_primary && !b.is_primary) return -1;
    if (!a.is_primary && b.is_primary) return 1;
    return 0;
  });
  
  return (
    <DashboardLayout 
      title={property.name} 
      subtitle={`${property.location.city}, ${property.location.country}`}
    >
      <div className="max-w-4xl mx-auto p-4">
        {/* Image Carousel */}
        <div className="mb-8 relative rounded-lg overflow-hidden">
          <Carousel className="w-full">
            <CarouselContent>
              {sortedImages.map((image) => (
                <CarouselItem key={image.id} className="relative">
                  <div className="aspect-[16/9] md:aspect-[21/9] bg-gray-100 relative">
                    <img 
                      src={image.url} 
                      alt={property.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-2" />
            <CarouselNext className="right-2" />
          </Carousel>
        </div>
        
        {/* Main details */}
        <div className="flex flex-col md:flex-row justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">{property.name}</h1>
            <div className="flex items-center text-gray-600 mb-4">
              <MapPin className="h-5 w-5 mr-2" />
              <span>{property.location.address}, {property.location.zone}, {property.location.city}, {property.location.country}</span>
            </div>
            <div className="flex items-center gap-4 text-gray-800">
              <div className="flex items-center">
                <Bed className="h-5 w-5 mr-1" />
                <span>{property.bedrooms} {t('bedrooms')}</span>
              </div>
              <div className="flex items-center">
                <Bath className="h-5 w-5 mr-1" />
                <span>{property.bathrooms} {t('bathrooms')}</span>
              </div>
              <div className="flex items-center">
                <SquareFoot className="h-5 w-5 mr-1" />
                <span>{property.size_sqm} m²</span>
              </div>
            </div>
          </div>
          <div className="mt-4 md:mt-0 bg-easyroi-navy/5 p-4 rounded-lg">
            <div className="text-2xl font-bold text-easyroi-gold mb-1">
              {formatCurrency(property.price)}
            </div>
            {property.price && property.size_sqm && (
              <div className="text-sm text-gray-600">
                {formatCurrency(property.price / property.size_sqm)} / m²
              </div>
            )}
          </div>
        </div>
        
        {/* Property info grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <h2 className="text-xl font-semibold mb-4 pb-2 border-b">{t('propertyDetails')}</h2>
            <dl className="grid grid-cols-2 gap-y-3">
              <dt className="text-gray-600">{t('propertyType')}</dt>
              <dd className="font-medium">{property.type.name}</dd>
              
              <dt className="text-gray-600">{t('status')}</dt>
              <dd className="font-medium capitalize">{property.status}</dd>
              
              <dt className="text-gray-600">{t('occupationStatus')}</dt>
              <dd className="font-medium capitalize">{property.occupation_status}</dd>
              
              <dt className="text-gray-600">{t('size')}</dt>
              <dd className="font-medium">{property.size_sqm} m²</dd>
              
              {property.service_charges !== null && (
                <>
                  <dt className="text-gray-600">{t('serviceCharges')}</dt>
                  <dd className="font-medium">{formatCurrency(property.service_charges)}</dd>
                </>
              )}
              
              {property.listing_status && (
                <>
                  <dt className="text-gray-600">{t('listingStatus')}</dt>
                  <dd className="font-medium capitalize">{property.listing_status}</dd>
                </>
              )}
            </dl>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-4 pb-2 border-b">{t('investmentDetails')}</h2>
            <dl className="grid grid-cols-2 gap-y-3">
              {property.roi_percentage !== null && (
                <>
                  <dt className="text-gray-600">{t('expectedROI')}</dt>
                  <dd className="font-medium flex items-center">
                    <Percent className="h-4 w-4 mr-1" />
                    {property.roi_percentage}%
                  </dd>
                </>
              )}
              
              {property.min_investment !== null && (
                <>
                  <dt className="text-gray-600">{t('minInvestment')}</dt>
                  <dd className="font-medium flex items-center">
                    <CreditCard className="h-4 w-4 mr-1" />
                    {formatCurrency(property.min_investment)}
                  </dd>
                </>
              )}
              
              <dt className="text-gray-600">{t('price')}</dt>
              <dd className="font-medium">{formatCurrency(property.price)}</dd>
              
              <dt className="text-gray-600">{t('pricePerSqm')}</dt>
              <dd className="font-medium">
                {property.price && property.size_sqm ? formatCurrency(property.price / property.size_sqm) : 'N/A'}
              </dd>
            </dl>
          </div>
        </div>
        
        {/* Amenities */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 pb-2 border-b">{t('amenities')}</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {property.amenities.map((amenity) => (
              <div key={amenity.id} className="flex items-center p-2">
                <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                <span>{amenity.name}</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Pros & Cons */}
        {property.pros_cons && property.pros_cons.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h2 className="text-xl font-semibold mb-4 pb-2 border-b text-green-600">{t('pros')}</h2>
              <ul className="space-y-2">
                {property.pros_cons.filter(item => item.is_pro).map((pro) => (
                  <li key={pro.id} className="flex items-start">
                    <CheckCircle className="h-5 w-5 mr-2 text-green-500 mt-0.5" />
                    <span>{pro.description}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h2 className="text-xl font-semibold mb-4 pb-2 border-b text-red-600">{t('cons')}</h2>
              <ul className="space-y-2">
                {property.pros_cons.filter(item => !item.is_pro).map((con) => (
                  <li key={con.id} className="flex items-start">
                    <XCircle className="h-5 w-5 mr-2 text-red-500 mt-0.5" />
                    <span>{con.description}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
        
        {/* Action buttons */}
        <div className="flex justify-between mt-8 pt-4 border-t">
          <Link to="/properties">
            <Button variant="outline" className="flex items-center">
              <Home className="mr-2 h-4 w-4" /> 
              {t('backToProperties')}
            </Button>
          </Link>
          
          <Button className="bg-easyroi-gold text-easyroi-navy hover:bg-easyroi-gold/90">
            {t('contactAboutProperty')}
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
