
import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, Calendar, Building2 } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { CashflowFilters as CashflowFiltersType } from "@/services/cashflowService";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface CashflowFiltersProps {
  filters: CashflowFiltersType;
  onFiltersChange: (filters: CashflowFiltersType) => void;
}

interface PropertyOption {
  id: string;
  name: string;
}

export function CashflowFilters({ filters, onFiltersChange }: CashflowFiltersProps) {
  const t = useTranslation();
  const years = [2022, 2023, 2024, 2025, 2026];
  
  // Load properties for the filter
  const { data: properties = [] } = useQuery({
    queryKey: ['properties-for-filter'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('properties')
        .select('id, name')
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id || '')
        .order('name');
      
      if (error) throw error;
      return data as PropertyOption[];
    }
  });

  const handleYearChange = (year: string) => {
    onFiltersChange({
      ...filters,
      year: parseInt(year, 10)
    });
  };

  const handlePropertyChange = (propertyId: string) => {
    onFiltersChange({
      ...filters,
      propertyId: propertyId === "all" ? null : propertyId
    });
  };
  
  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      onFiltersChange({
        ...filters,
        month: date.getMonth() + 1,
        year: date.getFullYear()
      });
    }
  };
  
  const handleResetFilters = () => {
    onFiltersChange({
      year: new Date().getFullYear(),
      month: null,
      propertyId: null
    });
  };
  
  const selectedMonth = filters.month ? new Date(filters.year, filters.month - 1) : undefined;
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3">
        <div className="grid w-full md:w-auto grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="flex items-center space-x-2">
            <Select value={filters.year.toString()} onValueChange={handleYearChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder={t("selectYear")} />
              </SelectTrigger>
              <SelectContent>
                {years.map(year => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center space-x-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !selectedMonth && "text-muted-foreground"
                  )}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {selectedMonth ? format(selectedMonth, "MMMM yyyy") : t("selectMonth")}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <CalendarComponent
                  mode="single"
                  selected={selectedMonth}
                  onSelect={handleDateChange}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="flex items-center space-x-2">
            <Select 
              value={filters.propertyId || "all"} 
              onValueChange={handlePropertyChange}
            >
              <SelectTrigger className="w-full">
                <Building2 className="mr-2 h-4 w-4" />
                <SelectValue placeholder={t("property")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("allProperties")}</SelectItem>
                {properties.map(property => (
                  <SelectItem key={property.id} value={property.id}>
                    {property.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <Button 
          variant="outline"
          onClick={handleResetFilters}
          className="shrink-0"
        >
          {t("resetFilters")}
        </Button>
      </div>
    </div>
  );
}
