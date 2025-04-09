
import React from "react";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { NetworkPageContent } from "@/components/network/NetworkPageContent";
import { useTranslation } from "@/hooks/useTranslation";

const Network = () => {
  const t = useTranslation();
  
  return (
    <DashboardLayout title={t('investorNetwork')} subtitle={t('connectInvestors')}>
      <NetworkPageContent />
    </DashboardLayout>
  );
};

export default Network;
