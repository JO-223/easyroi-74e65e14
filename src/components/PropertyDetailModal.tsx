
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from "@/components/ui/dialog";
import { Property } from "@/types/property";
import { Badge } from "@/components/ui/badge";
import { BadgeLevel } from "@/components/ui/badge-level";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Home, Euro, ChevronRight, Check, X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { formatCurrency } from "@/lib/utils";

interface PropertyDetailModalProps {
  property: Property | null;
  isOpen: boolean;
  onClose: () => void;
}

export function PropertyDetailModal({ property, isOpen, onClose }: PropertyDetailModalProps) {
  const { t } = useLanguage();
  
  if (!property) return null;
  
  // Get primary image or placeholder
  const primaryImage = property.images.find(img => img.is_primary)?.url || 
                      (property.images.length > 0 ? property.images[0].url : '/placeholder.svg');
  
  // Separate pros and cons
  const pros = property.pros_cons.filter(item => item.is_pro);
  const cons = property.pros_cons.filter(item => !item.is_pro);
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl bg-easyroi-navy text-white overflow-hidden p-0">
        <div className="relative h-64 overflow-hidden">
          <img 
            src={primaryImage} 
            alt={property.name} 
            className="w-full h-full object-cover" 
          />
          <div className="absolute top-4 left-4">
            <BadgeLevel level={property.investor_level as any || "bronze"} />
          </div>
          {property.ownership && property.ownership < 100 && (
            <div className="absolute top-4 right-4">
              <Badge variant="outline" className="bg-blue-500/20 text-blue-300 border-blue-500/50">
                Club Deal ({property.ownership}%)
              </Badge>
            </div>
          )}
        </div>
        
        <DialogHeader className="p-6 pb-2">
          <div className="flex items-center mb-2">
            <Badge variant="outline" className="bg-green-500/20 text-green-300 border-green-500/50 mr-2">
              {property.status}
            </Badge>
            <Badge variant="outline" className="bg-blue-500/20 text-blue-300 border-blue-500/50">
              {property.type.name}
            </Badge>
          </div>
          <DialogTitle className="text-2xl font-bold">{property.name}</DialogTitle>
          <DialogDescription className="flex items-center text-white/70 mt-1">
            <MapPin className="h-4 w-4 mr-1 text-easyroi-gold" />
            {property.location.address}, {property.location.zone}, {property.location.city}, {property.location.country}
          </DialogDescription>
        </DialogHeader>
        
        <div className="p-6">
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="bg-white/10 mb-4">
              <TabsTrigger value="details">{t('details')}</TabsTrigger>
              <TabsTrigger value="features">{t('features')}</TabsTrigger>
              <TabsTrigger value="pros-cons">{t('prosAndCons')}</TabsTrigger>
              <TabsTrigger value="investment">{t('investment')}</TabsTrigger>
            </TabsList>
            
            <TabsContent value="details" className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white/5 p-4 rounded-lg">
                  <p className="text-white/70 text-sm">{t('price')}</p>
                  <p className="text-xl font-bold text-easyroi-gold">{formatCurrency(property.price)}</p>
                </div>
                <div className="bg-white/5 p-4 rounded-lg">
                  <p className="text-white/70 text-sm">{t('size')}</p>
                  <p className="text-xl font-bold">{property.size_sqm} m²</p>
                </div>
                <div className="bg-white/5 p-4 rounded-lg">
                  <p className="text-white/70 text-sm">{t('ownership')}</p>
                  <p className="text-xl font-bold">{property.ownership || 100}%</p>
                </div>
                <div className="bg-white/5 p-4 rounded-lg">
                  <p className="text-white/70 text-sm">{t('bedrooms')}</p>
                  <p className="text-xl font-bold">{property.bedrooms}</p>
                </div>
              </div>
              
              <div className="bg-white/5 p-4 rounded-lg">
                <p className="text-white/70 text-sm mb-1">{t('occupationStatus')}</p>
                <div className="flex items-center">
                  <Home className="text-easyroi-gold mr-2" />
                  <p className="font-medium">{property.occupation_status}</p>
                </div>
              </div>
              
              {property.service_charges !== null && (
                <div className="bg-white/5 p-4 rounded-lg">
                  <p className="text-white/70 text-sm mb-1">{t('serviceCharges')}</p>
                  <div className="flex items-center">
                    <Euro className="text-easyroi-gold mr-2" />
                    <p className="font-medium">{formatCurrency(property.service_charges)} / {t('year')}</p>
                  </div>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="features" className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {property.amenities.map((amenity) => (
                  <div 
                    key={amenity.id} 
                    className="flex items-center p-2 bg-white/5 rounded-md"
                  >
                    <ChevronRight className="h-4 w-4 text-easyroi-gold mr-2" />
                    <span>{amenity.name}</span>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="pros-cons" className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-lg font-medium mb-2 text-easyroi-gold">{t('pros')}</h3>
                <div className="space-y-2">
                  {pros.length > 0 ? pros.map((item) => (
                    <div key={item.id} className="flex items-start bg-green-500/5 p-3 rounded-md">
                      <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <p>{item.description}</p>
                    </div>
                  )) : (
                    <p className="text-white/50">{t('noProsListed')}</p>
                  )}
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2 text-easyroi-gold">{t('cons')}</h3>
                <div className="space-y-2">
                  {cons.length > 0 ? cons.map((item) => (
                    <div key={item.id} className="flex items-start bg-red-500/5 p-3 rounded-md">
                      <X className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                      <p>{item.description}</p>
                    </div>
                  )) : (
                    <p className="text-white/50">{t('noConsListed')}</p>
                  )}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="investment" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {property.roi_percentage !== null && (
                  <div className="bg-white/5 p-4 rounded-lg">
                    <p className="text-white/70 text-sm">{t('expectedROI')}</p>
                    <p className="text-2xl font-bold text-easyroi-gold">{property.roi_percentage}%</p>
                  </div>
                )}
                
                {property.min_investment !== null && (
                  <div className="bg-white/5 p-4 rounded-lg">
                    <p className="text-white/70 text-sm">{t('minInvestment')}</p>
                    <p className="text-2xl font-bold">{formatCurrency(property.min_investment)}</p>
                  </div>
                )}
                
                <div className="bg-white/5 p-4 rounded-lg">
                  <p className="text-white/70 text-sm">{t('investorLevel')}</p>
                  <p className="text-xl font-bold capitalize">{property.investor_level}</p>
                  <BadgeLevel level={property.investor_level as any} className="mt-1" />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
