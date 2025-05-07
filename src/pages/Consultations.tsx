
import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { useTranslation } from "@/hooks/useTranslation";
import { ConsultationTabs } from "@/components/consultations/ConsultationTabs";

const Consultations = () => {
  const t = useTranslation();
  
  return (
    <DashboardLayout title={t('consultations')}>
      <ConsultationTabs />
    </DashboardLayout>
  );
};

export default Consultations;
