
import React from "react";
import { UserBadge } from "@/components/ui/user-badge";
import { useUserLevel } from "@/hooks/useUserLevel";
import { NotificationDropdown } from "@/components/notifications/NotificationDropdown";

interface DashboardHeaderProps {
  title: string;
  subtitle?: string;
  userData?: any;
}

export function DashboardHeader({
  title,
  subtitle,
  userData
}: DashboardHeaderProps) {
  const {
    userLevel
  } = useUserLevel();
  const displayLevel = userData?.level || userLevel;
  
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 pb-4 border-b">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        {subtitle && <p className="text-muted-foreground">{subtitle}</p>}
      </div>
      
      <div className="mt-2 md:mt-0 flex items-center gap-4">
        <NotificationDropdown />
        
        {displayLevel && (
          <div>
            <UserBadge level={displayLevel} size="lg" className="my-5 mx-5" />
          </div>
        )}
      </div>
    </div>
  );
}
