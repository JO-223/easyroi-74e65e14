
import React from "react";
import { useNetworkData } from "@/hooks/network/useNetworkData";
import { NetworkFilterBar } from "@/components/network/NetworkFilterBar";
import { NetworkInvestorList } from "@/components/network/NetworkInvestorList";
import { NetworkEmpty } from "@/components/network/NetworkEmpty";
import { NetworkLoading } from "@/components/network/NetworkLoading";

export function NetworkPageContent() {
  const {
    searchQuery,
    setSearchQuery,
    userVisibility,
    investors,
    setInvestors,
    filteredInvestors,
    isLoading
  } = useNetworkData();

  // If user has private profile, show message
  if (userVisibility === 'private') {
    return <NetworkEmpty />;
  }

  if (isLoading) {
    return <NetworkLoading />;
  }

  return (
    <>
      <NetworkFilterBar 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        investors={investors}
      />

      <NetworkInvestorList 
        investors={investors}
        filteredInvestors={filteredInvestors}
        setInvestors={setInvestors}
      />
    </>
  );
}
