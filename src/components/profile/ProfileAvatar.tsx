
import React from "react";
import { BadgeLevel } from "@/components/ui/badge-level";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import { Database } from "@/integrations/supabase/types";

type InvestorLevel = Database['public']['Tables']['profiles']['Row']['level'];

type ProfileAvatarProps = {
  level: InvestorLevel | null;
  joinDate: string;
  isEditing: boolean;
};

export const ProfileAvatar = ({ level, joinDate, isEditing }: ProfileAvatarProps) => {
  // Convert level to the expected type for BadgeLevel
  const typedLevel = level as 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond' | null;
  
  return (
    <div className="md:w-1/3 flex flex-col items-center">
      <div className="h-32 w-32 rounded-full bg-gray-200 mb-4 flex items-center justify-center shadow-md">
        <User className="h-16 w-16 text-gray-400" />
      </div>
      <div className="mt-2 mb-3">
        <BadgeLevel level={typedLevel} className="animate-fade-in" />
      </div>
      <p className="text-sm text-center text-gray-500 mt-1">{joinDate}</p>
      
      {isEditing && (
        <Button variant="outline" size="sm" className="mt-4 w-full hover:bg-accent/80">
          Change Photo
        </Button>
      )}
    </div>
  );
};
