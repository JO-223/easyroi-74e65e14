
import React from "react";
import { Textarea } from "@/components/ui/textarea";
import { ProfileData } from "./hooks/useProfileData";

type ProfileBioProps = {
  profile: ProfileData;
  isEditing: boolean;
  setProfile: React.Dispatch<React.SetStateAction<ProfileData>>;
};

export const ProfileBio = ({ profile, isEditing, setProfile }: ProfileBioProps) => {
  return (
    <div>
      <label className="text-sm font-medium">Bio</label>
      {isEditing ? (
        <Textarea 
          value={profile.bio || ''} 
          onChange={(e) => setProfile({...profile, bio: e.target.value})}
          rows={4}
        />
      ) : (
        <p className="mt-1 text-sm">{profile.bio || '-'}</p>
      )}
    </div>
  );
};
