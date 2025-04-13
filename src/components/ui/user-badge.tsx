
import React from "react";
import { Badge } from "./badge";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

export type UserLevel = "starter" | "bronze" | "silver" | "gold" | "ruby" | "emerald" | "platinum" | "diamond" | null;

const userBadgeVariants = cva("inline-flex items-center rounded-full", {
  variants: {
    variant: {
      starter: "bg-gray-200 text-gray-700 border-gray-300",
      bronze: "bg-amber-100 text-amber-800 border-amber-300",
      silver: "bg-slate-200 text-slate-700 border-slate-300",
      gold: "bg-yellow-100 text-yellow-800 border-yellow-300",
      ruby: "bg-red-100 text-red-800 border-red-300",
      emerald: "bg-emerald-100 text-emerald-800 border-emerald-300",
      platinum: "bg-blue-100 text-blue-800 border-blue-300",
      diamond: "bg-purple-100 text-purple-800 border-purple-300",
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
  starter: "⭐",
  bronze: "🥉",
  silver: "🥈",
  gold: "🥇",
  ruby: "💎",
  emerald: "💚",
  platinum: "✨",
  diamond: "💎💎",
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
  
  return (
    <div
      className={cn(
        userBadgeVariants({ 
          variant: actualVariant, 
          size,
          withIcon: showIcon 
        }),
        "font-medium border",
        className
      )}
      {...props}
    >
      {showIcon && (
        <span className={cn("mr-1", iconClassName)} aria-hidden="true">
          {levelIcons[level as keyof typeof levelIcons]}
        </span>
      )}
      {!hideLabel && (
        <span className="capitalize">
          {level}
        </span>
      )}
    </div>
  )
}
