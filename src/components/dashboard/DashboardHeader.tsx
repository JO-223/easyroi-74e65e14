
import React from "react";
import { UserBadge } from "@/components/ui/user-badge";
import { useUserLevel } from "@/hooks/useUserLevel";
import { NotificationDropdown } from "@/components/notifications/NotificationDropdown";

interface DashboardHeaderProps {
  title?: string;
  subtitle?: string;
  userData?: any;
}

export function DashboardHeader({
  userData
}: DashboardHeaderProps) {
  const {
    userLevel
  } = useUserLevel();
  const displayLevel = userData?.level || userLevel;
  
  return (
    <div className="flex flex-col md:flex-row justify-end items-center mb-6 pb-4 border-b">
      <div className="flex items-center gap-4">
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
