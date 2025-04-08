
import React from 'react';
import { 
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { BadgeLevel } from "@/components/ui/badge-level";
import { Info } from "lucide-react";

const investorLevelRequirements = [
  { level: 'bronze', min: 0, max: 500000, label: 'Bronze' },
  { level: 'silver', min: 500000, max: 1000000, label: 'Silver' },
  { level: 'gold', min: 1000000, max: 2500000, label: 'Gold' },
  { level: 'platinum', min: 2500000, max: 5000000, label: 'Platinum' },
  { level: 'diamond', min: 5000000, max: 20000000, label: 'Diamond' },
  { level: 'cosmic', min: 20000000, max: null, label: 'Cosmic' },
];

export function InvestorLevelInfo() {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <button className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700">
          <Info className="h-4 w-4 mr-1" /> Livelli Investitore
        </button>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="space-y-2">
          <h4 className="font-medium">Livelli di Investimento</h4>
          <p className="text-sm text-gray-500">I livelli sono basati sul totale investito:</p>
          
          <div className="space-y-3 pt-2">
            {investorLevelRequirements.map((req) => (
              <div key={req.level} className="flex items-center justify-between">
                <BadgeLevel level={req.level as any} />
                <span className="text-sm">
                  {req.min.toLocaleString('it-IT')}€ 
                  {req.max ? ` - ${req.max.toLocaleString('it-IT')}€` : ' +'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
