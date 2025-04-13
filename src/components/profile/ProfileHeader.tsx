
import React from "react";
import { UserBadge } from "@/components/ui/user-badge";
import { useUserLevel } from "@/hooks/useUserLevel";
import { useLanguage } from "@/contexts/LanguageContext";
import { ProfileData } from "./hooks/useProfileData";

interface ProfileHeaderProps {
  name: string;
  joinDate?: string;
  userId?: string;
  profile?: ProfileData;
  isEditing?: boolean;
  isSaving?: boolean;
  onEditToggle?: () => void;
  onSave?: () => Promise<void>;
}

export function ProfileHeader({ 
  name, 
  joinDate, 
  userId, 
  profile,
  isEditing,
  isSaving,
  onEditToggle,
  onSave 
}: ProfileHeaderProps) {
  const { userLevel } = useUserLevel(userId);
  const { t } = useLanguage();
  
  const displayLevel = profile?.level || userLevel;
  const displayJoinDate = profile?.join_date || joinDate;
  const displayName = profile ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() : name;
  
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
      <div>
        <h2 className="text-2xl font-bold">{displayName}</h2>
        {displayJoinDate && (
          <p className="text-sm text-muted-foreground">
            {t('memberSince')}: {displayJoinDate}
          </p>
        )}
      </div>
      
      <div className="flex items-center gap-4 mt-2 sm:mt-0">
        {isEditing !== undefined && (
          <div>
            {isEditing ? (
              <button 
                onClick={onSave} 
                disabled={isSaving}
                className="bg-primary text-white px-3 py-1 rounded-md text-sm hover:bg-primary/90 transition-colors"
              >
                {isSaving ? t('saving') : t('save')}
              </button>
            ) : (
              <button 
                onClick={onEditToggle}
                className="text-primary hover:underline text-sm"
              >
                {t('edit')}
              </button>
            )}
          </div>
        )}
        
        {displayLevel && (
          <UserBadge 
            level={displayLevel} 
            size="lg" 
          />
        )}
      </div>
    </div>
  );
}
