
import { useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronDown } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { PropertyFilter } from "@/types/property";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PropertyFiltersProps {
  onFilterChange: (filters: PropertyFilter) => void;
  locations: {city: string, country: string, zone: string}[];
  propertyTypes: {id: string, name: string}[];
  amenities: {id: string, name: string}[];
  investorLevels: string[];
}

export function PropertyFilters({ 
  onFilterChange, 
  locations, 
  propertyTypes, 
  amenities,
  investorLevels
}: PropertyFiltersProps) {
  const { t } = useLanguage();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filters, setFilters] = useState<PropertyFilter>({});
  
  // Get unique cities and countries
  const cities = Array.from(new Set(locations.map(loc => loc.city)));
  const countries = Array.from(new Set(locations.map(loc => loc.country)));
  const zones = Array.from(new Set(locations.map(loc => loc.zone)));
  
  const locationOptions = [
    { label: t('allLocations'), value: '' },
    ...cities.map(city => ({ label: city, value: city })),
    ...countries.map(country => ({ label: country, value: country })),
    ...zones.map(zone => ({ label: zone, value: zone }))
  ];

  const handleFilterChange = (key: keyof PropertyFilter, value: any) => {
    const newFilters = { ...filters, [key]: value };
    
    // If value is empty, remove the filter
    if (value === '' || value === undefined) {
      delete newFilters[key];
    }
    
    setFilters(newFilters);
  };
  
  const handleAmenityToggle = (amenityId: string, checked: boolean) => {
    const currentAmenities = filters.amenities || [];
    let newAmenities: string[];
    
    if (checked) {
      newAmenities = [...currentAmenities, amenityId];
    } else {
      newAmenities = currentAmenities.filter(id => id !== amenityId);
    }
    
    handleFilterChange('amenities', newAmenities.length > 0 ? newAmenities : undefined);
  };
  
  const handleApplyFilters = () => {
    onFilterChange(filters);
  };
  
  const handleResetFilters = () => {
    setFilters({});
    onFilterChange({});
  };

  return (
    <Collapsible
      open={filtersOpen}
      onOpenChange={setFiltersOpen}
      className="bg-white/5 backdrop-blur-md border border-white/10 rounded-lg p-4 mb-8"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">{t('filterProperties')}</h2>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm" className="text-white hover:text-easyroi-gold">
            <ChevronDown className={`h-5 w-5 transition-transform ${filtersOpen ? 'rotate-180' : ''}`} />
            <span className="ml-1">{filtersOpen ? t('hideFilters') : t('showFilters')}</span>
          </Button>
        </CollapsibleTrigger>
      </div>

      <CollapsibleContent className="mt-4 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Location filter */}
          <div>
            <h3 className="font-medium mb-2 text-white/90">{t('location')}</h3>
            <Select 
              value={filters.location || ''} 
              onValueChange={(value) => handleFilterChange('location', value)}
            >
              <SelectTrigger className="w-full bg-white/10 border-white/20 text-white">
                <SelectValue placeholder={t('allLocations')} />
              </SelectTrigger>
              <SelectContent>
                {locationOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Price range filter */}
          <div>
            <h3 className="font-medium mb-2 text-white/90">{t('priceRange')}</h3>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Input
                  type="number"
                  placeholder={t('min')}
                  className="bg-white/10 border-white/20 text-white"
                  value={filters.priceMin || ''}
                  onChange={(e) => handleFilterChange('priceMin', e.target.value ? Number(e.target.value) : undefined)}
                />
              </div>
              <div>
                <Input
                  type="number"
                  placeholder={t('max')}
                  className="bg-white/10 border-white/20 text-white"
                  value={filters.priceMax || ''}
                  onChange={(e) => handleFilterChange('priceMax', e.target.value ? Number(e.target.value) : undefined)}
                />
              </div>
            </div>
          </div>

          {/* Property type filter */}
          <div>
            <h3 className="font-medium mb-2 text-white/90">{t('propertyType')}</h3>
            <Select 
              value={filters.type || ''} 
              onValueChange={(value) => handleFilterChange('type', value)}
            >
              <SelectTrigger className="w-full bg-white/10 border-white/20 text-white">
                <SelectValue placeholder={t('allTypes')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">{t('allTypes')}</SelectItem>
                {propertyTypes.map((type) => (
                  <SelectItem key={type.id} value={type.name}>
                    {type.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Investor level filter */}
          <div>
            <h3 className="font-medium mb-2 text-white/90">{t('investorLevel')}</h3>
            <Select 
              value={filters.investorLevel || ''} 
              onValueChange={(value) => handleFilterChange('investorLevel', value)}
            >
              <SelectTrigger className="w-full bg-white/10 border-white/20 text-white">
                <SelectValue placeholder={t('allLevels')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">{t('allLevels')}</SelectItem>
                {investorLevels.map((level) => (
                  <SelectItem key={level} value={level}>
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Amenities filter */}
        <div>
          <h3 className="font-medium mb-2 text-white/90">{t('amenities')}</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {amenities.map((amenity) => (
              <div key={amenity.id} className="flex items-center space-x-2">
                <Checkbox 
                  id={`amenity-${amenity.id}`} 
                  checked={filters.amenities?.includes(amenity.id)}
                  onCheckedChange={(checked) => handleAmenityToggle(amenity.id, checked as boolean)}
                  className="border-easyroi-gold data-[state=checked]:bg-easyroi-gold data-[state=checked]:text-easyroi-navy"
                />
                <label 
                  htmlFor={`amenity-${amenity.id}`}
                  className="text-sm text-white/80 cursor-pointer"
                >
                  {amenity.name}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end space-x-2 pt-4 border-t border-white/10">
          <Button 
            variant="outline" 
            className="border-white/20 text-white hover:bg-white/10"
            onClick={handleResetFilters}
          >
            {t('resetFilters')}
          </Button>
          <Button 
            className="bg-easyroi-gold text-easyroi-navy hover:bg-easyroi-gold/90"
            onClick={handleApplyFilters}
          >
            {t('applyFilters')}
          </Button>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
