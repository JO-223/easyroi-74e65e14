
import React from "react";
import { Input } from "@/components/ui/input";
import { ProfileData } from "./hooks/useProfileData";

type ProfileContactInfoProps = {
  profile: ProfileData;
  isEditing: boolean;
  setProfile: React.Dispatch<React.SetStateAction<ProfileData>>;
};

export const ProfileContactInfo = ({ profile, isEditing, setProfile }: ProfileContactInfoProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
      <div>
        <label className="text-sm font-medium">Email</label>
        {isEditing ? (
          <Input 
            value={profile.email} 
            onChange={(e) => setProfile({...profile, email: e.target.value})} 
          />
        ) : (
          <p className="mt-1">{profile.email}</p>
        )}
      </div>
      <div>
        <label className="text-sm font-medium">Phone</label>
        {isEditing ? (
          <Input 
            value={profile.phone || ''} 
            onChange={(e) => setProfile({...profile, phone: e.target.value})} 
          />
        ) : (
          <p className="mt-1">{profile.phone || '-'}</p>
        )}
      </div>
    </div>
  );
};
