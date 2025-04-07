
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type BadgeLevelProps = {
  level?: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond' | null;
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
  // If the level is null, undefined, or not a valid key, return null
  if (!level || !badgeConfig[level as keyof typeof badgeConfig]) {
    return null;
  }
  
  const config = badgeConfig[level as keyof typeof badgeConfig];
  
  return (
    <Badge className={cn(config.className, className)}>
      {config.label} Investor
    </Badge>
  );
}
