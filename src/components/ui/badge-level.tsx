
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Award, Crown, Diamond, Medal, Star } from "lucide-react";

export type BadgeLevelProps = {
  level?: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond' | null;
  className?: string;
};

const badgeConfig = {
  bronze: {
    label: 'Bronze',
    className: 'badge-bronze',
    icon: Medal,
    iconProps: { size: 14 }
  },
  silver: {
    label: 'Silver',
    className: 'badge-silver',
    icon: Award,
    iconProps: { size: 14 }
  },
  gold: {
    label: 'Gold',
    className: 'badge-gold',
    icon: Crown,
    iconProps: { size: 14 }
  },
  platinum: {
    label: 'Platinum',
    className: 'badge-platinum',
    icon: Star,
    iconProps: { size: 14 }
  },
  diamond: {
    label: 'Diamond',
    className: 'badge-diamond',
    icon: Diamond,
    iconProps: { size: 14 }
  },
};

export function BadgeLevel({ level, className }: BadgeLevelProps) {
  // If the level is null, undefined, or not a valid key, return null
  if (!level || !badgeConfig[level as keyof typeof badgeConfig]) {
    return null;
  }
  
  const config = badgeConfig[level as keyof typeof badgeConfig];
  const Icon = config.icon;
  
  return (
    <Badge className={cn(
      config.className,
      "transition-all duration-300 hover:scale-105 flex items-center gap-1 font-medium",
      className
    )}>
      <Icon {...config.iconProps} className="mr-1" />
      {config.label} Investor
    </Badge>
  );
}
