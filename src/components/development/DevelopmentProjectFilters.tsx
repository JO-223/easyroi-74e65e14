
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

interface DevelopmentProjectFiltersProps {
  onApplyFilters: (filters: any) => void;
}

export function DevelopmentProjectFilters({ onApplyFilters }: DevelopmentProjectFiltersProps) {
  const { t } = useLanguage();
  const [progressRange, setProgressRange] = useState<number[]>([0, 100]);
  const [minInvestment, setMinInvestment] = useState<string>("");
  const [investorLevel, setInvestorLevel] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [stage, setStage] = useState<string>("");
  
  const clearFilters = () => {
    setProgressRange([0, 100]);
    setMinInvestment("");
    setInvestorLevel("");
    setLocation("");
    setStage("");
    
    onApplyFilters({});
  };
  
  const applyFilters = () => {
    const filters = {
      progressMin: progressRange[0],
      progressMax: progressRange[1],
      minInvestment: minInvestment ? parseInt(minInvestment) : undefined,
      investorLevel: investorLevel || undefined,
      location: location || undefined,
      stage: stage || undefined,
    };
    
    onApplyFilters(filters);
  };
  
  return (
    <div className="space-y-4 p-4 bg-white rounded-lg shadow-sm border">
      <h3 className="font-medium text-lg">{t('filterProjects')}</h3>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">{t('constructionProgress')}</label>
          <div className="px-2">
            <Slider 
              value={progressRange}
              min={0}
              max={100}
              step={5}
              onValueChange={setProgressRange}
            />
            <div className="flex justify-between mt-1 text-xs text-muted-foreground">
              <span>{progressRange[0]}%</span>
              <span>{progressRange[1]}%</span>
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
          <label className="text-sm font-medium">{t('investorLevel')}</label>
          <Select value={investorLevel} onValueChange={setInvestorLevel}>
            <SelectTrigger>
              <SelectValue placeholder={t('selectInvestorLevel')} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="bronze">Bronze</SelectItem>
                <SelectItem value="silver">Silver</SelectItem>
                <SelectItem value="gold">Gold</SelectItem>
                <SelectItem value="platinum">Platinum</SelectItem>
                <SelectItem value="diamond">Diamond</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">{t('location')}</label>
          <Input
            type="text"
            placeholder={t('enterLocation')}
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">{t('constructionStage')}</label>
          <Select value={stage} onValueChange={setStage}>
            <SelectTrigger>
              <SelectValue placeholder={t('selectStage')} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="planning">Planning</SelectItem>
                <SelectItem value="foundation">Foundation</SelectItem>
                <SelectItem value="structure">Structure</SelectItem>
                <SelectItem value="finishing">Finishing</SelectItem>
                <SelectItem value="interior">Interior</SelectItem>
                <SelectItem value="final">Final Touches</SelectItem>
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
            {t('clearAll')}
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
