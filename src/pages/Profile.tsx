
import React from "react";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { UserProfile } from "@/components/profile/UserProfile";
import { useLanguage } from "@/contexts/LanguageContext";

const Profile = () => {
  const { t } = useLanguage();
  
  return (
    <DashboardLayout title={t("myProfile")} subtitle={t("viewEditProfile")}>
      <UserProfile />
    </DashboardLayout>
  );
};

export default Profile;
