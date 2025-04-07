
import React, { useState } from "react";
import { BadgeLevel } from "@/components/ui/badge-level";
import { Button } from "@/components/ui/button";
import { User, Edit, Save, Loader2 } from "lucide-react";
import { Database } from "@/integrations/supabase/types";

type InvestorLevel = Database['public']['Tables']['profiles']['Row']['level'];

type ProfileHeaderProps = {
  profile: {
    id: string;
    first_name: string | null;
    last_name: string | null;
    join_date: string;
    level: string | null;
  };
  isEditing: boolean;
  isSaving: boolean;
  onEditToggle: () => void;
  onSave: () => void;
};

export const ProfileHeader = ({
  profile,
  isEditing,
  isSaving,
  onEditToggle,
  onSave
}: ProfileHeaderProps) => {
  return (
    <div className="flex justify-between items-start">
      <div>
        <h2 className="text-2xl font-bold">Profile Information</h2>
        <p className="text-muted-foreground">Manage your personal information and preferences</p>
      </div>
      <Button 
        variant={isEditing ? "default" : "outline"} 
        size="sm" 
        onClick={() => isEditing ? onSave() : onEditToggle()}
        disabled={isSaving}
        className={isEditing ? "bg-easyroi-navy hover:bg-easyroi-navy/90" : ""}
      >
        {isSaving ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Saving
          </>
        ) : isEditing ? (
          <>
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </>
        ) : (
          <>
            <Edit className="mr-2 h-4 w-4" />
            Edit Profile
          </>
        )}
      </Button>
    </div>
  );
};
