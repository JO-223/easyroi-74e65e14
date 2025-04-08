
import React from "react";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { UserProfile } from "@/components/profile/UserProfile";

const Profile = () => {
  return (
    <DashboardLayout title="My Profile" subtitle="View and edit your profile information">
      <UserProfile />
    </DashboardLayout>
  );
};

export default Profile;
