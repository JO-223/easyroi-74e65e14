
import { Property } from "@/types/property";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BadgeLevel } from "@/components/ui/badge-level";
import { MapPin, Bed, Bath, Droplet, Car, Wifi, Globe } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { formatCurrency } from "@/lib/utils";

interface PropertyCardProps {
  property: Property;
  onViewDetails: (property: Property) => void;
}

export function PropertyCard({ property, onViewDetails }: PropertyCardProps) {
  const t = useTranslation();
  
  // Get primary image or placeholder
  const primaryImage = property.images.find(img => img.is_primary)?.url || 
                       (property.images.length > 0 ? property.images[0].url : '/placeholder.svg');
  
  return (
    <Card className="luxury-card overflow-hidden backdrop-blur-md bg-white/5 border-white/10 text-white">
      <div className="aspect-video w-full overflow-hidden">
        <img 
          src={primaryImage} 
          alt={property.name} 
          className="w-full h-full object-cover" 
        />
      </div>
      
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl font-bold">{property.name}</CardTitle>
          <BadgeLevel level={property.investor_level as any} />
        </div>
        <div className="flex items-center text-sm text-white/70 mt-1">
          <MapPin className="h-3.5 w-3.5 mr-1" />
          <CardDescription className="text-white/70">
            {property.location.city}, {property.location.country}
          </CardDescription>
        </div>
      </CardHeader>
      
      <CardContent className="pb-2">
        <p className="text-sm text-white/80 mb-4 line-clamp-2">{property.type.name}</p>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-white/70">{t('price')}</p>
            <p className="font-bold text-easyroi-gold">{formatCurrency(property.price)}</p>
          </div>
          {property.roi_percentage && (
            <div>
              <p className="text-sm text-white/70">{t('expectedROI')}</p>
              <p className="font-bold text-easyroi-gold text-base">{property.roi_percentage}%</p>
            </div>
          )}
          {property.min_investment && (
            <div>
              <p className="text-sm text-white/70">{t('minInvestment')}</p>
              <p className="font-bold text-white">{formatCurrency(property.min_investment)}</p>
            </div>
          )}
          <div>
            <p className="text-sm text-white/70">{t('status')}</p>
            <p className="font-bold text-green-400">{property.status}</p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {property.amenities && property.amenities.slice(0, 4).map((amenity, index) => (
            <span key={index} className="inline-flex items-center px-2 py-1 bg-white/10 rounded text-xs">
              {amenity.icon === 'droplet' && <Droplet className="h-3 w-3 mr-1" />}
              {amenity.icon === 'wifi' && <Wifi className="h-3 w-3 mr-1" />}
              {amenity.icon === 'car' && <Car className="h-3 w-3 mr-1" />}
              {amenity.icon === 'bed' && <Bed className="h-3 w-3 mr-1" />}
              {amenity.icon === 'bath' && <Bath className="h-3 w-3 mr-1" />}
              {(!amenity.icon) && <Globe className="h-3 w-3 mr-1" />}
              {amenity.name}
            </span>
          ))}
        </div>
      </CardContent>
      
      <CardFooter className="pt-0">
        <Button 
          className="w-full bg-gradient-to-r from-easyroi-gold/90 to-easyroi-gold hover:from-easyroi-gold hover:to-easyroi-gold/90 text-easyroi-navy"
          onClick={() => onViewDetails(property)}
        >
          {t('viewDetails')}
        </Button>
      </CardFooter>
    </Card>
  );
}
