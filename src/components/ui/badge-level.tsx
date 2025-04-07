
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type BadgeLevelProps = {
  level: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
  className?: string;
};

const badgeConfig = {
  bronze: {
    label: 'Bronze',
    className: 'badge-bronze',
  },
  silver: {
    label: 'Silver',
    className: 'badge-silver',
  },
  gold: {
    label: 'Gold',
    className: 'badge-gold',
  },
  platinum: {
    label: 'Platinum',
    className: 'badge-platinum',
  },
  diamond: {
    label: 'Diamond',
    className: 'badge-diamond',
  },
};

export function BadgeLevel({ level, className }: BadgeLevelProps) {
  // If the level is null or undefined, return null to avoid rendering anything
  if (!level) {
    return null;
  }
  
  // Make sure the level is a valid key in our badgeConfig
  const config = badgeConfig[level] || badgeConfig.bronze;
  
  return (
    <Badge className={cn(config.className, className)}>
      {config.label} Investor
    </Badge>
  );
}
