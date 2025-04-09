
import React from "react";
import { ProfileMainCard } from "./ProfileMainCard";
import { SecurityPrivacyCard } from "./SecurityPrivacyCard";
import InvestmentSummary from "./InvestmentSummaryCard";
import RecentActivityCard from "./RecentActivityCard";
import { ProfileData, ProfileInterest } from "./hooks/useProfileData";

type UserProfileContentProps = {
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

export const UserProfileContent: React.FC<UserProfileContentProps> = ({
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
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <ProfileMainCard
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
        
        <SecurityPrivacyCard />
      </div>
      
      <div>
        <InvestmentSummary />
        <RecentActivityCard />
      </div>
    </div>
  );
};
