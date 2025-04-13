
import React from "react";
import { UserBadge } from "@/components/ui/user-badge";
import { useUserLevel } from "@/hooks/useUserLevel";

interface DashboardHeaderProps {
  title: string;
  subtitle?: string;
  userData?: any; // Added userData prop
}

export function DashboardHeader({ title, subtitle, userData }: DashboardHeaderProps) {
  const { userLevel } = useUserLevel();
  
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 pb-4 border-b">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        {subtitle && <p className="text-muted-foreground">{subtitle}</p>}
      </div>
      
      {userLevel && (
        <div className="mt-2 md:mt-0">
          <UserBadge level={userLevel} size="lg" />
        </div>
      )}
    </div>
  );
}
