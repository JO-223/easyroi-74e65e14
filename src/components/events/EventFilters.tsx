
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { useLanguage } from '@/contexts/LanguageContext';
import { CalendarIcon, MapPinIcon } from 'lucide-react';
import { EventFilter } from '@/types/event';

interface EventFiltersProps {
  onApplyFilters: (filters: EventFilter) => void;
}

export function EventFilters({ onApplyFilters }: EventFiltersProps) {
  const { t } = useLanguage();
  const [filters, setFilters] = useState<EventFilter>({});
  
  const handleInputChange = (field: keyof EventFilter, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };
  
  const handleCheckboxChange = (field: keyof EventFilter, checked: boolean) => {
    setFilters(prev => ({ ...prev, [field]: checked }));
  };
  
  const handleApplyFilters = () => {
    // Convert Date objects to strings if they exist
    const formattedFilters = {
      ...filters,
      fromDate: filters.fromDate ? filters.fromDate.toString() : undefined,
      toDate: filters.toDate ? filters.toDate.toString() : undefined
    };
    onApplyFilters(formattedFilters);
  };
  
  const clearFilters = () => {
    setFilters({});
    onApplyFilters({});
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('filters')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>{t('eventFormat')}</Label>
          <Select onValueChange={(value) => handleInputChange('eventFormat', value)}>
            <SelectTrigger>
              <SelectValue placeholder={t('allFormats')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('allFormats')}</SelectItem>
              <SelectItem value="online">{t('onlineEvents')}</SelectItem>
              <SelectItem value="in-person">{t('inPersonEvents')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label>{t('location')}</Label>
          <div className="relative">
            <Input 
              type="text" 
              placeholder={t('enterLocation')}
              value={filters.location || ''}
              onChange={(e) => handleInputChange('location', e.target.value)}
            />
            <MapPinIcon className="absolute top-2.5 right-3 h-5 w-5 text-gray-500" />
          </div>
        </div>
        
        <div>
          <Label>{t('dateRange')}</Label>
          <div className="flex items-center space-x-2">
            <div className="relative w-1/2">
              <Input 
                type="date" 
                placeholder={t('fromDate')}
                value={filters.fromDate || ''}
                onChange={(e) => handleInputChange('fromDate', e.target.value)}
              />
              <CalendarIcon className="absolute top-2.5 right-3 h-5 w-5 text-gray-500" />
            </div>
            <div className="relative w-1/2">
              <Input 
                type="date" 
                placeholder={t('toDate')}
                value={filters.toDate || ''}
                onChange={(e) => handleInputChange('toDate', e.target.value)}
              />
              <CalendarIcon className="absolute top-2.5 right-3 h-5 w-5 text-gray-500" />
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="available" 
            checked={!!filters.onlyAvailable}
            onCheckedChange={(checked) => handleCheckboxChange('onlyAvailable', !!checked)}
          />
          <Label htmlFor="available" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed">
            {t('showOnlyAvailableEvents')}
          </Label>
        </div>
        
        <Separator />
        
        <Button variant="outline" className="w-full" onClick={handleApplyFilters}>
          {t('applyFilters')}
        </Button>
        <Button variant="ghost" className="w-full" onClick={clearFilters}>
          {t('clearFilters')}
        </Button>
      </CardContent>
    </Card>
  );
}
