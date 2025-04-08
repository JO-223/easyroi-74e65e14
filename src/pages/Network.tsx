
import React from "react";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { useLanguage } from "@/contexts/LanguageContext";
import { NetworkPageContent } from "@/components/network/NetworkPageContent";

const Network = () => {
  const { t } = useLanguage();
  
  return (
    <DashboardLayout title={t('investorNetwork')} subtitle={t('connectInvestors')}>
      <NetworkPageContent />
    </DashboardLayout>
  );
};

export default Network;
