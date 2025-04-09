
import React from "react";
import { Input } from "@/components/ui/input";
import { ProfileData } from "./hooks/useProfileData";

type ProfileBasicInfoProps = {
  profile: ProfileData;
  isEditing: boolean;
  setProfile: React.Dispatch<React.SetStateAction<ProfileData>>;
};

export const ProfileBasicInfo = ({ profile, isEditing, setProfile }: ProfileBasicInfoProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
      <div>
        <label className="text-sm font-medium">First Name</label>
        {isEditing ? (
          <Input 
            value={profile.first_name || ''} 
            onChange={(e) => setProfile({...profile, first_name: e.target.value})} 
          />
        ) : (
          <p className="mt-1">{profile.first_name || '-'}</p>
        )}
      </div>
      <div>
        <label className="text-sm font-medium">Last Name</label>
        {isEditing ? (
          <Input 
            value={profile.last_name || ''} 
            onChange={(e) => setProfile({...profile, last_name: e.target.value})} 
          />
        ) : (
          <p className="mt-1">{profile.last_name || '-'}</p>
        )}
      </div>
    </div>
  );
};
