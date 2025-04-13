
import React from "react";
import { Badge } from "./badge";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Award, Crown, Diamond, Gem, Star, Settings } from "lucide-react";

export type UserLevel = "starter" | "bronze" | "silver" | "gold" | "ruby" | "emerald" | "platinum" | "diamond" | null;

const userBadgeVariants = cva("inline-flex items-center rounded-full", {
  variants: {
    variant: {
      starter: "bg-gradient-to-b from-gray-300 to-gray-400 text-gray-800 border-gray-300 shadow-sm",
      bronze: "bg-gradient-to-b from-amber-400 to-amber-600 text-white border-amber-300 shadow-sm",
      silver: "bg-gradient-to-b from-gray-300 to-gray-400 text-gray-800 border-gray-300 shadow-sm",
      gold: "bg-gradient-to-b from-yellow-300 to-yellow-500 text-yellow-900 border-yellow-300 shadow-md",
      ruby: "bg-gradient-to-b from-red-400 to-red-600 text-white border-red-300 shadow-md", // Removed animation
      emerald: "bg-gradient-to-b from-emerald-400 to-emerald-600 text-white border-emerald-300 shadow-md", // Removed animation
      platinum: "bg-gradient-to-b from-slate-200 to-slate-300 text-slate-700 border-slate-300 shadow-md", // Removed animation
      diamond: "bg-gradient-to-b from-blue-300 to-blue-400 text-blue-800 border-blue-300 shadow-md", // Removed animation
    },
    size: {
      sm: "px-2 py-0.5 text-xs",
      md: "px-2.5 py-0.5 text-sm",
      lg: "px-3 py-1 text-base",
    },
    withIcon: {
      true: "pl-1.5",
    }
  },
  defaultVariants: {
    variant: "bronze",
    size: "md",
    withIcon: false,
  },
})

export interface UserBadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof userBadgeVariants> {
  level: UserLevel;
  showIcon?: boolean;
  hideLabel?: boolean;
  iconClassName?: string;
}

const levelIcons = {
  starter: Settings,
  bronze: Award,
  silver: Award,
  gold: Crown,
  ruby: Gem,
  emerald: Gem,
  platinum: Star,
  diamond: Diamond,
};

export function UserBadge({
  className,
  variant,
  level,
  size,
  showIcon = true,
  hideLabel = false,
  iconClassName,
  ...props
}: UserBadgeProps) {
  if (!level) return null;
  
  // Se il variant non è specificato, usa il livello come variant
  const actualVariant = variant || level as any;
  const IconComponent = levelIcons[level as keyof typeof levelIcons];
  
  return (
    <div
      className={cn(
        userBadgeVariants({ 
          variant: actualVariant, 
          size,
          withIcon: showIcon 
        }),
        "font-medium border backdrop-blur-sm transition-all duration-300 hover:shadow-lg",
        className
      )}
      {...props}
    >
      {showIcon && IconComponent && (
        <span className={cn("mr-1", iconClassName)} aria-hidden="true">
          <IconComponent className="h-3.5 w-3.5" />
        </span>
      )}
      {!hideLabel && (
        <span className="capitalize">
          {level} Investor
        </span>
      )}
    </div>
  )
}
