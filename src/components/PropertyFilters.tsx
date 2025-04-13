
import { useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronDown } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
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
  locations: { city: string; country: string; zone: string }[];
  propertyTypes: { id: string; name: string }[];
  amenities: { id: string; name: string }[];
  investorLevels: string[];
  className?: string;
}

export function PropertyFilters({
  onFilterChange,
  locations,
  propertyTypes,
  amenities,
  investorLevels,
  className
}: PropertyFiltersProps) {
  const t = useTranslation();
  const [filtersOpen, setFiltersOpen] = useState(true);
  const [filters, setFilters] = useState<PropertyFilter>({});

  // Get unique cities and countries
  const cities = Array.from(new Set(locations.map(loc => loc.city)));
  const countries = Array.from(new Set(locations.map(loc => loc.country)));
  const zones = Array.from(new Set(locations.map(loc => loc.zone)));

  const locationOptions = [
    { label: t('allLocations'), value: 'all' },
    ...cities.map(city => ({ label: city, value: city })),
    ...countries.map(country => ({ label: country, value: country })),
    ...zones.map(zone => ({ label: zone, value: zone }))
  ];

  const handleFilterChange = (
    field: keyof PropertyFilter,
    value: string | number | string[] | null
  ) => {
    const updatedFilters = { ...filters, [field]: value };
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  const handleAmenitiesChange = (amenityIds: string[]) => {
    const updatedFilters = { ...filters };
    updatedFilters.amenities = amenityIds.length > 0 ? amenityIds : undefined;
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  const handleInvestorLevelChange = (level: string) => {
    const updatedFilters = { ...filters };
    updatedFilters.investorLevel = level !== "all" ? level : undefined;
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  const handleApplyFilters = () => {
    onFilterChange(filters);
  };

  const handleResetFilters = () => {
    setFilters({});
    onFilterChange({});
  };

  return (
    <div className={`bg-gray-50 rounded-lg p-4 mb-8 border border-gray-200 ${className}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Location filter */}
        <div>
          <h3 className="font-medium mb-2 text-gray-700">{t('location')}</h3>
          <Select 
            value={filters.locations?.length ? filters.locations[0] : 'all'} 
            onValueChange={(value) => handleFilterChange('locations', value !== 'all' ? [value] : undefined)}
          >
            <SelectTrigger className="w-full bg-white border-gray-300 text-gray-800">
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
          <h3 className="font-medium mb-2 text-gray-700">{t('priceRange')}</h3>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Input
                type="number"
                placeholder={t('min')}
                className="bg-white border-gray-300 text-gray-800"
                value={filters.priceMin || ''}
                onChange={(e) => handleFilterChange('priceMin', e.target.value ? Number(e.target.value) : undefined)}
              />
            </div>
            <div>
              <Input
                type="number"
                placeholder={t('max')}
                className="bg-white border-gray-300 text-gray-800"
                value={filters.priceMax || ''}
                onChange={(e) => handleFilterChange('priceMax', e.target.value ? Number(e.target.value) : undefined)}
              />
            </div>
          </div>
        </div>

        {/* Property type filter */}
        <div>
          <h3 className="font-medium mb-2 text-gray-700">{t('propertyType')}</h3>
          <Select 
            value={filters.propertyTypes?.length ? filters.propertyTypes[0] : 'all'} 
            onValueChange={(value) => handleFilterChange('propertyTypes', value !== 'all' ? [value] : undefined)}
          >
            <SelectTrigger className="w-full bg-white border-gray-300 text-gray-800">
              <SelectValue placeholder={t('allTypes')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('allTypes')}</SelectItem>
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
          <h3 className="font-medium mb-2 text-gray-700">{t('investorLevel')}</h3>
          <Select 
            value={filters.investorLevel || 'all'} 
            onValueChange={(value) => handleInvestorLevelChange(value)}
          >
            <SelectTrigger className="w-full bg-white border-gray-300 text-gray-800">
              <SelectValue placeholder={t('allLevels')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('allLevels')}</SelectItem>
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
      <div className="mt-4">
        <Collapsible
          open={filtersOpen}
          onOpenChange={setFiltersOpen}
        >
          <div className="flex items-center justify-between border-t border-gray-200 pt-4 mt-2">
            <h3 className="font-medium text-gray-700">{t('amenities')}</h3>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm">
                <ChevronDown className={`h-5 w-5 transition-transform ${filtersOpen ? 'rotate-180' : ''}`} />
                <span className="ml-1">{filtersOpen ? t('hideAmenities') : t('showAmenities')}</span>
              </Button>
            </CollapsibleTrigger>
          </div>
          
          <CollapsibleContent className="mt-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {amenities.map((amenity) => (
                <div key={amenity.id} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`amenity-${amenity.id}`} 
                    checked={filters.amenities?.includes(amenity.id)}
                    onCheckedChange={(checked) => handleAmenitiesChange(checked ? [amenity.id] : [])}
                    className="border-gray-300 data-[state=checked]:bg-easyroi-gold data-[state=checked]:text-easyroi-navy"
                  />
                  <label 
                    htmlFor={`amenity-${amenity.id}`}
                    className="text-sm text-gray-700 cursor-pointer"
                  >
                    {amenity.name}
                  </label>
                </div>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>

      <div className="flex justify-end space-x-2 pt-4 mt-4 border-t border-gray-200">
        <Button 
          variant="outline" 
          className="border-gray-300 text-gray-700 hover:bg-gray-100"
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
    </div>
  );
}
