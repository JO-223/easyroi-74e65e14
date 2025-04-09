
import React from "react";
import { Input } from "@/components/ui/input";
import { MapPin } from "lucide-react";
import { ProfileData } from "./hooks/useProfileData";

type ProfileLocationProps = {
  profile: ProfileData;
  isEditing: boolean;
  setProfile: React.Dispatch<React.SetStateAction<ProfileData>>;
};

export const ProfileLocation = ({ profile, isEditing, setProfile }: ProfileLocationProps) => {
  return (
    <div className="mb-4">
      <label className="text-sm font-medium">Location</label>
      {isEditing ? (
        <Input 
          value={profile.location || ''} 
          onChange={(e) => setProfile({...profile, location: e.target.value})} 
        />
      ) : (
        <p className="mt-1 flex items-center">
          {profile.location ? (
            <>
              <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
              {profile.location}
            </>
          ) : '-'}
        </p>
      )}
    </div>
  );
};
