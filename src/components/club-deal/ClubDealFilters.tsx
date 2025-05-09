
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent, 
  CardFooter 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BadgeLevel } from "@/components/ui/badge-level";
import { useLanguage } from "@/contexts/LanguageContext";

interface ClubDealFiltersProps {
  onApplyFilters: (filters: any) => void;
}

export function ClubDealFilters({ onApplyFilters }: ClubDealFiltersProps) {
  const { t } = useLanguage();
  
  // Filter states
  const [investorLevel, setInvestorLevel] = useState<string>("");
  const [minInvestment, setMinInvestment] = useState<number>(0);
  const [rentalROIRange, setRentalROIRange] = useState<[number, number]>([0, 10]);
  const [totalROIRange, setTotalROIRange] = useState<[number, number]>([0, 50]);
  const [location, setLocation] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  
  const handleApplyFilters = () => {
    // Collect all filter values
    const filters = {
      investorLevel: investorLevel || undefined,
      minInvestment: minInvestment || undefined,
      rentalROIMin: rentalROIRange[0],
      rentalROIMax: rentalROIRange[1],
      totalROIMin: totalROIRange[0],
      totalROIMax: totalROIRange[1],
      location: location || undefined,
      status: status || undefined,
    };
    
    onApplyFilters(filters);
  };
  
  const handleClearFilters = () => {
    setInvestorLevel("");
    setMinInvestment(0);
    setRentalROIRange([0, 10]);
    setTotalROIRange([0, 50]);
    setLocation("");
    setStatus("");
    
    // Apply the cleared filters
    onApplyFilters({});
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('filterProjects')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Investor Level Filter */}
        <div className="space-y-2">
          <Label htmlFor="investorLevel">{t('investmentLevel')}</Label>
          <Select
            value={investorLevel}
            onValueChange={(value) => setInvestorLevel(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder={t('allLevels')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                {t('allLevels')}
              </SelectItem>
              <SelectItem value="bronze">
                <div className="flex items-center">
                  <BadgeLevel level="bronze" className="mr-2" />
                  <span>Bronze</span>
                </div>
              </SelectItem>
              <SelectItem value="silver">
                <div className="flex items-center">
                  <BadgeLevel level="silver" className="mr-2" />
                  <span>Silver</span>
                </div>
              </SelectItem>
              <SelectItem value="gold">
                <div className="flex items-center">
                  <BadgeLevel level="gold" className="mr-2" />
                  <span>Gold</span>
                </div>
              </SelectItem>
              <SelectItem value="platinum">
                <div className="flex items-center">
                  <BadgeLevel level="platinum" className="mr-2" />
                  <span>Platinum</span>
                </div>
              </SelectItem>
              <SelectItem value="diamond">
                <div className="flex items-center">
                  <BadgeLevel level="diamond" className="mr-2" />
                  <span>Diamond</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Min Investment Filter */}
        <div className="space-y-2">
          <Label htmlFor="minInvestment">{t('minInvestment')}</Label>
          <Input
            id="minInvestment"
            type="number"
            value={minInvestment}
            min={0}
            onChange={(e) => setMinInvestment(Number(e.target.value))}
          />
        </div>
        
        {/* Rental ROI Range */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="rentalROI">{t('estimatedRentalROI')}</Label>
            <span className="text-sm text-muted-foreground">
              {rentalROIRange[0]}% - {rentalROIRange[1]}%
            </span>
          </div>
          <Slider
            id="rentalROI"
            defaultValue={[0, 10]}
            max={15}
            step={0.5}
            value={rentalROIRange}
            onValueChange={(value) => setRentalROIRange(value as [number, number])}
          />
        </div>
        
        {/* Total ROI Range */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="totalROI">{t('estimatedTotalROI')}</Label>
            <span className="text-sm text-muted-foreground">
              {totalROIRange[0]}% - {totalROIRange[1]}%
            </span>
          </div>
          <Slider
            id="totalROI"
            defaultValue={[0, 50]}
            max={100}
            step={1}
            value={totalROIRange}
            onValueChange={(value) => setTotalROIRange(value as [number, number])}
          />
        </div>
        
        {/* Location Filter */}
        <div className="space-y-2">
          <Label htmlFor="location">{t('location')}</Label>
          <Input
            id="location"
            placeholder={t('enterLocation')}
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>
        
        {/* Status Filter */}
        <div className="space-y-2">
          <Label htmlFor="status">{t('dealStatus')}</Label>
          <Select
            value={status}
            onValueChange={(value) => setStatus(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder={t('all')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('all')}</SelectItem>
              <SelectItem value="funding_in_progress">{t('fundingInProgress')}</SelectItem>
              <SelectItem value="property_acquired">{t('propertyAcquired')}</SelectItem>
              <SelectItem value="in_rental">{t('inRental')}</SelectItem>
              <SelectItem value="ready_for_sale">{t('readyForSale')}</SelectItem>
              <SelectItem value="completed">{t('completedDeal')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={handleClearFilters}
        >
          {t('clearFilters')}
        </Button>
        <Button onClick={handleApplyFilters}>
          {t('applyFilters')}
        </Button>
      </CardFooter>
    </Card>
  );
}
