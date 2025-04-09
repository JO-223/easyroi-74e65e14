
import React from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { ProfileHeader } from "./ProfileHeader";
import { ProfileAvatar } from "./ProfileAvatar";
import { ProfileForm } from "./ProfileForm";
import { ProfileData, ProfileInterest } from "./hooks/useProfileData";

type ProfileMainCardProps = {
  profile: ProfileData;
  isEditing: boolean;
  isSaving: boolean;
  setProfile: React.Dispatch<React.SetStateAction<ProfileData>>;
  interests: ProfileInterest[];
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
