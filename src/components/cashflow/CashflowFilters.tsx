
import React, { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from "@/contexts/LanguageContext";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface CashflowFiltersProps {
  onFilterChange: (startDate: Date | undefined, endDate: Date | undefined, propertyId?: string) => void;
}

export const CashflowFilters: React.FC<CashflowFiltersProps> = ({ onFilterChange }) => {
  const { t } = useLanguage();
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [propertyId, setPropertyId] = useState<string | undefined>();
  
  // Mock properties for selection
  const mockProperties = [
    { id: "1", name: "Dubai Marina Apartment" },
    { id: "2", name: "JBR Beach Residence" },
    { id: "3", name: "Palm Jumeirah Villa" }
  ];

  const handleApplyFilters = () => {
    onFilterChange(startDate, endDate, propertyId);
  };

  const handleResetFilters = () => {
    setStartDate(undefined);
    setEndDate(undefined);
    setPropertyId(undefined);
    onFilterChange(undefined, undefined, undefined);
  };
  
  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm mb-6">
      <h2 className="text-lg font-semibold mb-4">{t('cashflowFilters') || 'Filters'}</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Start Date Filter */}
        <div className="space-y-2">
          <Label htmlFor="start-date">{t('startDate') || 'Start Date'}</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="start-date"
                variant="outline"
                className={cn(
                  "w-full justify-start text-left",
                  !startDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {startDate ? format(startDate, "PPP") : (t('selectDate') || 'Select date')}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={setStartDate}
                initialFocus
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>
        
        {/* End Date Filter */}
        <div className="space-y-2">
          <Label htmlFor="end-date">{t('endDate') || 'End Date'}</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="end-date"
                variant="outline"
                className={cn(
                  "w-full justify-start text-left",
                  !endDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {endDate ? format(endDate, "PPP") : (t('selectDate') || 'Select date')}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={endDate}
                onSelect={setEndDate}
                initialFocus
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>
        
        {/* Property Filter */}
        <div className="space-y-2">
          <Label htmlFor="property">{t('property') || 'Property'}</Label>
          <Select value={propertyId} onValueChange={setPropertyId}>
            <SelectTrigger id="property">
              <SelectValue placeholder={t('allProperties') || 'All Properties'} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">{t('allProperties') || 'All Properties'}</SelectItem>
              {mockProperties.map(property => (
                <SelectItem key={property.id} value={property.id}>
                  {property.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="flex justify-end mt-6 space-x-3">
        <Button variant="outline" onClick={handleResetFilters}>
          {t('resetFilters') || 'Reset'}
        </Button>
        <Button onClick={handleApplyFilters}>
          {t('applyFilters') || 'Apply'}
        </Button>
      </div>
    </div>
  );
};
