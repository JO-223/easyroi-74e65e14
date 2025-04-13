
import React from "react";
import { cn } from "@/lib/utils";

interface SideCardItemProps {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
  className?: string;
}

export function SideCardItem({ icon, label, value, className }: SideCardItemProps) {
  return (
    <div className={cn("flex items-start space-x-3 py-2", className)}>
      <div className="flex-shrink-0 text-muted-foreground mt-0.5">{icon}</div>
      <div className="space-y-1">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="font-medium">{value}</p>
      </div>
    </div>
  );
}
