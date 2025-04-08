
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { NetworkSearchBar } from "@/components/network/NetworkSearchBar";
import { NetworkInvestor } from "@/services/network/types";

interface NetworkFilterBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  investors: NetworkInvestor[];
}

export function NetworkFilterBar({ 
  searchQuery, 
  setSearchQuery, 
  investors 
}: NetworkFilterBarProps) {
  const { t } = useLanguage();
  
  const filteredInvestors = investors
    .filter(investor => 
      investor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      investor.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      investor.bio?.toLowerCase().includes(searchQuery.toLowerCase())
    );

  return (
    <NetworkSearchBar 
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      resultsCount={filteredInvestors.length}
    />
  );
}
