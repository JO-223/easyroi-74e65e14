
import React from "react";
import { NetworkInvestor } from "@/services/network/types";
import { NetworkInvestorCard } from "@/components/network/NetworkInvestorCard";

interface NetworkInvestorGridProps {
  investors: NetworkInvestor[];
  onConnect: (investorId: string, investorName: string) => void;
  onDisconnect: (investorId: string, investorName: string) => void;
  onMessage: (investorId: string, investorName: string) => void;
}

export function NetworkInvestorGrid({
  investors,
  onConnect,
  onDisconnect,
  onMessage
}: NetworkInvestorGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {investors.map(investor => (
        <NetworkInvestorCard
          key={investor.id}
          investor={investor}
          onConnect={onConnect}
          onDisconnect={onDisconnect}
          onMessage={onMessage}
        />
      ))}
    </div>
  );
}
