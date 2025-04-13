
import React from "react";
import { UserBadge } from "@/components/ui/user-badge";
import { useUserLevel } from "@/hooks/useUserLevel";
import { useLanguage } from "@/contexts/LanguageContext";

interface ProfileHeaderProps {
  name: string;
  joinDate?: string;
  userId?: string;
}

export function ProfileHeader({ name, joinDate, userId }: ProfileHeaderProps) {
  const { userLevel } = useUserLevel(userId);
  const { t } = useLanguage();
  
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
      <div>
        <h2 className="text-2xl font-bold">{name}</h2>
        {joinDate && (
          <p className="text-sm text-muted-foreground">
            {t('memberSince')}: {joinDate}
          </p>
        )}
      </div>
      
      {userLevel && (
        <UserBadge 
          level={userLevel} 
          size="lg" 
          className="mt-2 sm:mt-0"
        />
      )}
    </div>
  );
}
