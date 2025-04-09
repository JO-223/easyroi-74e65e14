
import React from "react";
import { ProfileBasicInfo } from "./ProfileBasicInfo";
import { ProfileContactInfo } from "./ProfileContactInfo";
import { ProfileLocation } from "./ProfileLocation";
import { ProfileBio } from "./ProfileBio";
import { ProfileInterests } from "./ProfileInterests";
import { ProfileData } from "./hooks/useProfileData";

type ProfileFormProps = {
  profile: ProfileData;
  isEditing: boolean;
  setProfile: React.Dispatch<React.SetStateAction<any>>;
  interests: { name: string }[];
  availableInterests: { id: string, name: string }[];
  addInterest: (interestId: string) => Promise<void>;
  removeInterest: (interestName: string) => Promise<void>;
};

export const ProfileForm = ({
  profile,
  isEditing,
  setProfile,
  interests,
  availableInterests,
  addInterest,
  removeInterest
}: ProfileFormProps) => {
  return (
    <div className="md:w-2/3">
      <ProfileBasicInfo 
        profile={profile} 
        isEditing={isEditing} 
        setProfile={setProfile} 
      />
      
      <ProfileContactInfo 
        profile={profile} 
        isEditing={isEditing} 
        setProfile={setProfile} 
      />
      
      <ProfileLocation 
        profile={profile} 
        isEditing={isEditing} 
        setProfile={setProfile} 
      />
      
      <ProfileBio 
        profile={profile} 
        isEditing={isEditing} 
        setProfile={setProfile} 
      />
      
      {isEditing && (
        <ProfileInterests
          interests={interests}
          availableInterests={availableInterests}
          addInterest={addInterest}
          removeInterest={removeInterest}
        />
      )}
    </div>
  );
};
