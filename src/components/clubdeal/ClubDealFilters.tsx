
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLanguage } from "@/contexts/LanguageContext";
import { Badge } from "@/components/ui/badge";

interface ClubDealFiltersProps {
  onApplyFilters: (filters: any) => void;
}

export function ClubDealFilters({ onApplyFilters }: ClubDealFiltersProps) {
  const { t } = useLanguage();
  const [roiRange, setRoiRange] = useState<number[]>([0, 50]);
  const [minInvestment, setMinInvestment] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  
  const clearFilters = () => {
    setRoiRange([0, 50]);
    setMinInvestment("");
    setLocation("");
    setStatus("");
    
    onApplyFilters({});
  };
  
  const applyFilters = () => {
    const filters = {
      roiMin: roiRange[0],
      roiMax: roiRange[1],
      minInvestment: minInvestment ? parseInt(minInvestment) : undefined,
      location: location || undefined,
      status: status || undefined,
    };
    
    onApplyFilters(filters);
  };
  
  return (
    <div className="space-y-4 p-4 bg-white rounded-lg shadow-sm border">
      <h3 className="font-medium text-lg">{t('filterClubDeals')}</h3>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">{t('roiRange')}</label>
          <div className="px-2">
            <Slider 
              value={roiRange}
              min={0}
              max={50}
              step={1}
              onValueChange={setRoiRange}
            />
            <div className="flex justify-between mt-1 text-xs text-muted-foreground">
              <span>{roiRange[0]}%</span>
              <span>{roiRange[1]}%</span>
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">{t('minInvestment')}</label>
          <Input
            type="number"
            placeholder="€"
            value={minInvestment}
            onChange={(e) => setMinInvestment(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">{t('location')}</label>
          <Input
            type="text"
            placeholder={t('selectLocation')}
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">{t('projectStatus')}</label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger>
              <SelectValue placeholder={t('all')} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="fundraising">{t('clubDealStatus_fundraising')}</SelectItem>
                <SelectItem value="purchased">{t('clubDealStatus_purchased')}</SelectItem>
                <SelectItem value="rented">{t('clubDealStatus_rented')}</SelectItem>
                <SelectItem value="readyForSale">{t('clubDealStatus_readyForSale')}</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex gap-2 pt-2">
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={clearFilters}
          >
            {t('clearFilters')}
          </Button>
          <Button 
            className="flex-1 bg-easyroi-navy text-white hover:bg-easyroi-navy/90"
            onClick={applyFilters}
          >
            {t('applyFilters')}
          </Button>
        </div>
      </div>
    </div>
  );
}
