
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar } from "@/components/ui/calendar";
import { Switch } from "@/components/ui/switch";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";
import { EventFilter } from "@/types/property";

interface EventFiltersProps {
  onApplyFilters: (filters: EventFilter) => void;
}

export function EventFilters({ onApplyFilters }: EventFiltersProps) {
  const { t } = useLanguage();
  const [eventType, setEventType] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [dateFrom, setDateFrom] = useState<Date | undefined>(undefined);
  const [dateTo, setDateTo] = useState<Date | undefined>(undefined);
  const [hasAvailability, setHasAvailability] = useState<boolean>(false);
  const [isOnline, setIsOnline] = useState<boolean | undefined>(undefined);
  
  const handleApplyFilters = () => {
    onApplyFilters({
      eventType: eventType || undefined,
      location: location || undefined,
      dateFrom,
      dateTo,
      hasAvailability: hasAvailability || undefined,
      isOnline,
    });
  };
  
  const handleClearFilters = () => {
    setEventType("");
    setLocation("");
    setDateFrom(undefined);
    setDateTo(undefined);
    setHasAvailability(false);
    setIsOnline(undefined);
    onApplyFilters({});
  };
  
  return (
    <Card className="sticky top-6">
      <CardHeader className="pb-3">
        <CardTitle>{t('filters')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>{t('eventType')}</Label>
          <RadioGroup value={eventType} onValueChange={setEventType}>
            <div className="flex items-center space-x-2 mb-2">
              <RadioGroupItem value="networking" id="networking" />
              <Label htmlFor="networking">{t('networking')}</Label>
            </div>
            <div className="flex items-center space-x-2 mb-2">
              <RadioGroupItem value="property_viewing" id="property_viewing" />
              <Label htmlFor="property_viewing">{t('propertyViewing')}</Label>
            </div>
            <div className="flex items-center space-x-2 mb-2">
              <RadioGroupItem value="investment_seminar" id="investment_seminar" />
              <Label htmlFor="investment_seminar">{t('investmentSeminar')}</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="project_launch" id="project_launch" />
              <Label htmlFor="project_launch">{t('projectLaunch')}</Label>
            </div>
          </RadioGroup>
        </div>
        
        <div className="space-y-2">
          <Label>{t('eventFormat')}</Label>
          <RadioGroup 
            value={isOnline === undefined ? "" : isOnline ? "online" : "inperson"} 
            onValueChange={(val) => {
              if (val === "") {
                setIsOnline(undefined);
              } else {
                setIsOnline(val === "online");
              }
            }}
          >
            <div className="flex items-center space-x-2 mb-2">
              <RadioGroupItem value="" id="all_formats" />
              <Label htmlFor="all_formats">{t('allFormats')}</Label>
            </div>
            <div className="flex items-center space-x-2 mb-2">
              <RadioGroupItem value="online" id="online" />
              <Label htmlFor="online">{t('onlineEvents')}</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="inperson" id="inperson" />
              <Label htmlFor="inperson">{t('inPersonEvents')}</Label>
            </div>
          </RadioGroup>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="location">{t('location')}</Label>
          <Input
            id="location"
            placeholder={t('enterLocation')}
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label>{t('dateRange')}</Label>
          <div className="grid grid-cols-2 gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "justify-start text-left font-normal",
                    !dateFrom && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateFrom ? format(dateFrom, "PP") : t('fromDate')}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dateFrom}
                  onSelect={setDateFrom}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "justify-start text-left font-normal",
                    !dateTo && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateTo ? format(dateTo, "PP") : t('toDate')}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dateTo}
                  onSelect={setDateTo}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Switch
              id="availability"
              checked={hasAvailability}
              onCheckedChange={setHasAvailability}
            />
            <Label htmlFor="availability">{t('showOnlyAvailableEvents')}</Label>
          </div>
        </div>
        
        <div className="flex flex-col space-y-2 pt-2">
          <Button onClick={handleApplyFilters}>{t('applyFilters')}</Button>
          <Button variant="outline" onClick={handleClearFilters}>{t('clearFilters')}</Button>
        </div>
      </CardContent>
    </Card>
  );
}
