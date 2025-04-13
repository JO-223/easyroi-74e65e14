
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Award, Crown, Diamond, Gem, Star, Settings } from "lucide-react";

export type BadgeLevelProps = {
  level?: 'starter' | 'bronze' | 'silver' | 'gold' | 'ruby' | 'emerald' | 'platinum' | 'diamond' | null;
  className?: string;
};

const badgeConfig = {
  starter: {
    label: 'Starter',
    className: 'badge-starter bg-gradient-to-b from-gray-300 to-gray-400 text-gray-800',
    icon: Settings,
    iconProps: { size: 14 },
    animation: ''
  },
  bronze: {
    label: 'Bronze',
    className: 'badge-bronze bg-gradient-to-b from-amber-400 to-amber-600 text-white',
    icon: Award,
    iconProps: { size: 14 },
    animation: ''
  },
  silver: {
    label: 'Silver',
    className: 'badge-silver bg-gradient-to-b from-gray-300 to-gray-400 text-gray-800',
    icon: Award,
    iconProps: { size: 14 },
    animation: 'animate-silver-shimmer'
  },
  gold: {
    label: 'Gold',
    className: 'badge-gold bg-gradient-to-b from-yellow-300 to-yellow-500 text-yellow-900',
    icon: Crown,
    iconProps: { size: 14 },
    animation: 'hover:animate-gold-shimmer'
  },
  ruby: {
    label: 'Ruby',
    className: 'badge-ruby bg-gradient-to-b from-red-400 to-red-600 text-white',
    icon: Gem,
    iconProps: { size: 14 },
    animation: 'animate-ruby-shimmer'
  },
  emerald: {
    label: 'Emerald',
    className: 'badge-emerald bg-gradient-to-b from-emerald-400 to-emerald-600 text-white',
    icon: Gem,
    iconProps: { size: 14 },
    animation: 'animate-emerald-glint'
  },
  platinum: {
    label: 'Platinum',
    className: 'badge-platinum bg-gradient-to-b from-slate-200 to-slate-300 text-slate-700',
    icon: Star,
    iconProps: { size: 14 },
    animation: 'animate-platinum-glow'
  },
  diamond: {
    label: 'Diamond',
    className: 'badge-diamond bg-gradient-to-b from-blue-300 to-blue-400 text-blue-800',
    icon: Diamond,
    iconProps: { size: 14 },
    animation: 'animate-diamond-sparkle'
  },
};

export function BadgeLevel({ level, className }: BadgeLevelProps) {
  // Se il livello è null, undefined, o non un livello valido, ritorna null
  if (!level || !badgeConfig[level as keyof typeof badgeConfig]) {
    return null;
  }
  
  const config = badgeConfig[level as keyof typeof badgeConfig];
  const Icon = config.icon;
  
  return (
    <Badge className={cn(
      config.className,
      config.animation,
      "transition-all duration-300 hover:scale-105 flex items-center gap-1 font-medium shadow-sm border",
      className
    )}>
      <Icon {...config.iconProps} className="mr-1" />
      {config.label} Investor
    </Badge>
  );
}
