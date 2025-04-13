
import React from "react";
import { UserBadge } from "@/components/ui/user-badge";
import { useUserLevel } from "@/hooks/useUserLevel";
import { useLanguage } from "@/contexts/LanguageContext";
import { Skeleton } from "@/components/ui/skeleton";

export function SidebarBadge() {
  const { userLevel, isLoading } = useUserLevel();
  const { t } = useLanguage();
  
  if (isLoading) {
    return <Skeleton className="h-6 w-20" />;
  }
  
  if (!userLevel) {
    return null;
  }
  
  return (
    <div className="px-3 py-2">
      <div className="mb-1 text-xs text-muted-foreground">
        {t('investorLevel')}:
      </div>
      <UserBadge 
        level={userLevel} 
        size="md"
        className="w-full justify-center py-1"
        // Remove any animation classes
      />
    </div>
  );
}
