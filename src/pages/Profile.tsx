
import React from "react";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { UserProfile } from "@/components/profile/UserProfile";
import { useTranslation } from "@/hooks/useTranslation";

const Profile = () => {
  const t = useTranslation();
  
  return (
    <DashboardLayout title={t("myProfile")} subtitle={t("viewEditProfile")}>
      <UserProfile />
    </DashboardLayout>
  );
};

export default Profile;
