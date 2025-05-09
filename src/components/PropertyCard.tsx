import { Property } from "@/types/property";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Bed, Bath, Droplet, Car, Wifi, Globe, Percent } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { formatCurrency } from "@/lib/utils";
import { Link } from "react-router-dom";
interface PropertyCardProps {
  property: Property;
  onViewDetails: (property: Property) => void;
}
export function PropertyCard({
  property
}: PropertyCardProps) {
  const t = useTranslation();

  // Get primary image or placeholder
  const primaryImage = property.images.find(img => img.is_primary)?.url || (property.images.length > 0 ? property.images[0].url : '/placeholder.svg');
  return <Card className="h-full overflow-hidden border border-gray-200">
      <div className="aspect-video w-full overflow-hidden h-48">
        <img src={primaryImage} alt={property.name} className="w-full h-full object-cover" />
      </div>
      
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-bold text-gray-800 break-words">{property.name}</CardTitle>
        <div className="flex items-center text-sm text-gray-500 mt-1">
          <MapPin className="h-3.5 w-3.5 mr-1 flex-shrink-0" />
          <CardDescription className="text-gray-500 break-words">
            {property.location.city}, {property.location.country}
          </CardDescription>
        </div>
      </CardHeader>
      
      <CardContent className="pb-2">
        <p className="text-sm text-gray-600 mb-4 line-clamp-2 break-words">{property.type.name}</p>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">{t('price')}</p>
            <p className="font-bold text-easyroi-gold break-words">{formatCurrency(property.price)}</p>
          </div>
          
          {property.roi_percentage && <div>
              <p className="text-sm text-gray-500">{t('expectedROI')}</p>
              <p className="font-bold text-easyroi-gold break-words">{property.roi_percentage}%</p>
            </div>}
          
          <div>
            <p className="text-sm text-gray-500">{t('ownership')}</p>
            <p className="font-bold flex items-center">
              <Percent className="h-3.5 w-3.5 mr-1 flex-shrink-0" />
              <span className="break-words">{property.ownership || 100}%</span>
            </p>
          </div>
          
          <div>
            <p className="text-sm text-gray-500">{t('status')}</p>
            <p className="font-bold text-green-500 break-words">{property.status}</p>
          </div>
        </div>

        {property.min_investment && <div className="mt-2">
            <p className="text-sm text-gray-500">{t('minInvestment')}</p>
            <p className="font-bold text-gray-800 break-words">{formatCurrency(property.min_investment)}</p>
          </div>}

        <div className="mt-4 flex flex-wrap gap-2">
          {property.amenities.slice(0, 4).map((amenity, index) => <span key={index} className="inline-flex items-center px-2 py-1 bg-gray-100 rounded text-xs text-gray-700 break-words">
              {amenity.icon === 'droplet' && <Droplet className="h-3 w-3 mr-1 flex-shrink-0" />}
              {amenity.icon === 'wifi' && <Wifi className="h-3 w-3 mr-1 flex-shrink-0" />}
              {amenity.icon === 'car' && <Car className="h-3 w-3 mr-1 flex-shrink-0" />}
              {amenity.icon === 'bed' && <Bed className="h-3 w-3 mr-1 flex-shrink-0" />}
              {amenity.icon === 'bath' && <Bath className="h-3 w-3 mr-1 flex-shrink-0" />}
              {!amenity.icon && <Globe className="h-3 w-3 mr-1 flex-shrink-0" />}
              {amenity.name}
            </span>)}
        </div>
      </CardContent>
      
      <CardFooter className="pt-0 mt-auto">
        <Link to={`/property/${property.id}`} className="w-full">
          <Button className="w-full bg-gradient-to-r from-easyroi-gold/90 to-easyroi-gold hover:from-easyroi-gold hover:to-easyroi-gold/90 text-easyroi-navy break-words">
            {t('viewDetails')}
          </Button>
        </Link>
      </CardFooter>
    </Card>;
}