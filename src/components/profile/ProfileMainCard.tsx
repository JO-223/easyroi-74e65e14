
import React from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { ProfileHeader } from "./ProfileHeader";
import { ProfileAvatar } from "./ProfileAvatar";
import { ProfileForm } from "./ProfileForm";
import { Database } from "@/integrations/supabase/types";

type InvestorLevel = Database['public']['Tables']['profiles']['Row']['level'];

type ProfileData = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string;
  phone: string | null;
  location: string | null;
  bio: string | null;
  join_date: string;
  level: InvestorLevel | null;
  avatar_url: string | null;
};

type ProfileMainCardProps = {
  profile: ProfileData;
  isEditing: boolean;
  isSaving: boolean;
  setProfile: React.Dispatch<React.SetStateAction<any>>;
  interests: { name: string }[];
  availableInterests: { id: string, name: string }[];
  handleSaveProfile: () => Promise<void>;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  addInterest: (interestId: string) => Promise<void>;
  removeInterest: (interestName: string) => Promise<void>;
};

export const ProfileMainCard = ({
  profile,
  isEditing,
  isSaving,
  setProfile,
  interests,
  availableInterests,
  handleSaveProfile,
  setIsEditing,
  addInterest,
  removeInterest
}: ProfileMainCardProps) => {
  return (
    <Card>
      <CardHeader className="pb-0">
        <ProfileHeader 
          profile={profile}
          isEditing={isEditing}
          isSaving={isSaving}
          onEditToggle={() => setIsEditing(true)}
          onSave={handleSaveProfile}
        />
      </CardHeader>
      <CardContent className="pt-6">
        <div className="flex flex-col md:flex-row gap-6">
          <ProfileAvatar 
            level={profile.level}
            joinDate={profile.join_date}
            isEditing={isEditing}
          />
          
          <ProfileForm 
            profile={profile}
            isEditing={isEditing}
            setProfile={setProfile}
            interests={interests}
            availableInterests={availableInterests}
            addInterest={addInterest}
            removeInterest={removeInterest}
          />
        </div>
      </CardContent>
    </Card>
  );
};
