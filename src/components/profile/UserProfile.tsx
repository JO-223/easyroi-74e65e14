
import React from "react";
import { Loader2 } from "lucide-react";
import { UserProfileContent } from "./UserProfileContent";
import { ProfileContentLoader } from "./ProfileContentLoader";
import { useProfileData } from "./hooks/useProfileData";
import { useProfileActions } from "./hooks/useProfileActions";

export const UserProfile = () => {
  const {
    profile,
    setProfile,
    isLoading,
    interests,
    availableInterests,
    setInterests
  } = useProfileData();

  const {
    isEditing,
    setIsEditing,
    isSaving,
    handleSaveProfile,
    addInterest,
    removeInterest
  } = useProfileActions(profile, interests, setInterests);

  if (isLoading) {
    return <ProfileContentLoader />;
  }

  return (
    <UserProfileContent
      profile={profile}
      isEditing={isEditing}
      isSaving={isSaving}
      setProfile={setProfile}
      interests={interests}
      availableInterests={availableInterests}
      handleSaveProfile={handleSaveProfile}
      setIsEditing={setIsEditing}
      addInterest={addInterest}
      removeInterest={removeInterest}
    />
  );
};
