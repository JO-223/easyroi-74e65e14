
import React, { useEffect } from 'react';
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Award, Crown, Diamond, Medal, Star } from "lucide-react";

export type BadgeLevelProps = {
  level?: 'starter' | 'bronze' | 'silver' | 'gold' | 'ruby' | 'emerald' | 'platinum' | 'diamond' | null;
  className?: string;
};

const badgeConfig = {
  starter: {
    label: 'Starter',
    className: 'badge-starter bg-gradient-to-r from-[#D3D3D3] to-[#A9A9A9] text-black',
    icon: Medal,
    iconProps: { size: 14 },
    animation: ''
  },
  bronze: {
    label: 'Bronze',
    className: 'badge-bronze bg-gradient-to-r from-[#CD7F32] to-[#B87333] text-white animate-bronze-pulse',
    icon: Medal,
    iconProps: { size: 14 },
    animation: 'animate-bronze-pulse'
  },
  silver: {
    label: 'Silver',
    className: 'badge-silver bg-gradient-to-r from-[#C0C0C0] to-[#A8A9AD] text-white animate-silver-shimmer',
    icon: Award,
    iconProps: { size: 14 },
    animation: 'animate-silver-shimmer'
  },
  gold: {
    label: 'Gold',
    className: 'badge-gold bg-gradient-to-r from-[#FFD700] to-[#FFC300] text-black hover:animate-gold-shimmer',
    icon: Crown,
    iconProps: { size: 14 },
    animation: 'hover:animate-gold-shimmer'
  },
  ruby: {
    label: 'Ruby',
    className: 'badge-ruby bg-gradient-to-r from-[#9B111E] to-[#C41E3A] text-white animate-ruby-pulse',
    icon: Star,
    iconProps: { size: 14 },
    animation: 'animate-ruby-pulse'
  },
  emerald: {
    label: 'Emerald',
    className: 'badge-emerald bg-gradient-to-r from-[#50C878] to-[#2E8B57] text-white animate-emerald-glint',
    icon: Star,
    iconProps: { size: 14 },
    animation: 'animate-emerald-glint'
  },
  platinum: {
    label: 'Platinum',
    className: 'badge-platinum bg-gradient-to-r from-[#E5E4E2] to-[#BCC6CC] text-black animate-platinum-glow',
    icon: Diamond,
    iconProps: { size: 14 },
    animation: 'animate-platinum-glow'
  },
  diamond: {
    label: 'Diamond',
    className: 'badge-diamond bg-gradient-to-r from-[#B9F2FF] to-[#E0FFFF] text-black animate-diamond-sparkle',
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
      "transition-all duration-300 hover:scale-105 flex items-center gap-1 font-medium",
      className
    )}>
      <Icon {...config.iconProps} className="mr-1" />
      {config.label} Investor
    </Badge>
  );
}
