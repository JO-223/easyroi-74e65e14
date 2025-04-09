
import React from "react";
import { Textarea } from "@/components/ui/textarea";
import { ProfileData } from "./hooks/useProfileData";

type ProfileBioProps = {
  profile: ProfileData;
  isEditing: boolean;
  setProfile: React.Dispatch<React.SetStateAction<ProfileData>>;
};

export const ProfileBio = ({ profile, isEditing, setProfile }: ProfileBioProps) => {
  const handleBioChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setProfile(prev => ({...prev, bio: e.target.value}));
  };

  return (
    <div>
      <label className="text-sm font-medium">Bio</label>
      {isEditing ? (
        <Textarea 
          value={profile.bio || ''} 
          onChange={handleBioChange}
          rows={4}
        />
      ) : (
        <p className="mt-1 text-sm">{profile.bio || '-'}</p>
      )}
    </div>
  );
};
