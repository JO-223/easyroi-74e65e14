
import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/contexts/LanguageContext";

interface NetworkSearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  resultsCount: number;
}

export function NetworkSearchBar({ 
  searchQuery, 
  setSearchQuery, 
  resultsCount 
}: NetworkSearchBarProps) {
  const { t } = useLanguage();

  return (
    <div className="mb-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <Input
          placeholder={t('searchInvestors')}
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div className="flex justify-between items-center mt-4">
        <p className="text-sm text-muted-foreground">
          {resultsCount} {t('investorsFound')}
        </p>
      </div>
    </div>
  );
}
