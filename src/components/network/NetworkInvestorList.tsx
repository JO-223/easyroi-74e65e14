
import React from "react";
import { NetworkInvestor } from "@/services/network/types";
import { NetworkInvestorGrid } from "@/components/network/NetworkInvestorGrid";
import { NetworkConnectionManager } from "@/components/network/NetworkConnectionManager";

interface NetworkInvestorListProps {
  investors: NetworkInvestor[];
  filteredInvestors: NetworkInvestor[];
  setInvestors: React.Dispatch<React.SetStateAction<NetworkInvestor[]>>;
}

export function NetworkInvestorList({
  investors,
  filteredInvestors,
  setInvestors
}: NetworkInvestorListProps) {
  const { handleConnect, handleDisconnect, handleMessage } = NetworkConnectionManager({ 
    investors, 
    setInvestors 
  });
  
  return (
    <NetworkInvestorGrid
      investors={filteredInvestors}
      onConnect={handleConnect}
      onDisconnect={handleDisconnect}
      onMessage={handleMessage}
    />
  );
}
