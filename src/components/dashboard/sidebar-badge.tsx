
import React from "react";
import { UserBadge } from "@/components/ui/user-badge";
import { useUserLevel } from "@/hooks/useUserLevel";
import { useLanguage } from "@/contexts/LanguageContext";
import { Skeleton } from "@/components/ui/skeleton";

interface SidebarBadgeProps {
  level?: string | null;
}

export function SidebarBadge({ level }: SidebarBadgeProps) {
  const { userLevel, isLoading } = useUserLevel();
  const { t } = useLanguage();
  
  // Use the passed level if provided, otherwise use the one from the hook
  const displayLevel = level || userLevel;
  
  if (isLoading && !displayLevel) {
    return <Skeleton className="h-6 w-20" />;
  }
  
  if (!displayLevel) {
    return null;
  }
  
  return (
    <div className="px-3 py-2">
      <div className="mb-1 text-xs text-muted-foreground">
        {t('investorLevel')}:
      </div>
      <UserBadge 
        level={displayLevel as any} 
        size="md"
        className="w-full justify-center py-1"
        // Remove any animation classes
      />
    </div>
  );
}
