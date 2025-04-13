import React from "react";
import { UserBadge } from "@/components/ui/user-badge";
import { useUserLevel } from "@/hooks/useUserLevel";
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
  return <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 pb-4 border-b">
      <div>
        
        {subtitle}
      </div>
      
      {displayLevel && <div className="mt-2 md:mt-0">
          <UserBadge level={displayLevel} size="lg" className="my-5 mx-5" />
        </div>}
    </div>;
}