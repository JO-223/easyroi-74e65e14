
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Award, Crown, Diamond, Medal, Star, Sparkles } from "lucide-react";

export type BadgeLevelProps = {
  level?: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond' | 'cosmic' | null;
  className?: string;
};

const badgeConfig = {
  bronze: {
    label: 'Bronze',
    className: 'badge-bronze bg-amber-700/80 hover:bg-amber-700',
    icon: Medal,
    iconProps: { size: 14 },
    description: 'Investimenti fino a 500K'
  },
  silver: {
    label: 'Silver',
    className: 'badge-silver bg-slate-400/80 hover:bg-slate-400',
    icon: Award,
    iconProps: { size: 14 },
    description: 'Investimenti da 500K a 1M'
  },
  gold: {
    label: 'Gold',
    className: 'badge-gold bg-easyroi-gold/80 hover:bg-easyroi-gold',
    icon: Crown,
    iconProps: { size: 14 },
    description: 'Investimenti da 1M a 2.5M'
  },
  platinum: {
    label: 'Platinum',
    className: 'badge-platinum bg-zinc-500/80 hover:bg-zinc-500',
    icon: Star,
    iconProps: { size: 14 },
    description: 'Investimenti da 2.5M a 5M'
  },
  diamond: {
    label: 'Diamond',
    className: 'badge-diamond bg-blue-500/80 hover:bg-blue-500',
    icon: Diamond,
    iconProps: { size: 14 },
    description: 'Investimenti da 5M a 20M'
  },
  cosmic: {
    label: 'Cosmic',
    className: 'badge-cosmic bg-purple-600/80 hover:bg-purple-600 text-white',
    icon: Sparkles,
    iconProps: { size: 14 },
    description: 'Investimenti superiori a 20M'
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
    )}
    title={config.description}>
      <Icon {...config.iconProps} className="mr-1" />
      {config.label} Investor
    </Badge>
  );
}
