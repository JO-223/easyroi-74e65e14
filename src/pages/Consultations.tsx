
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { useTranslation } from "@/hooks/useTranslation";
import { ConsultationTabs } from "@/components/consultations/ConsultationTabs";

const Consultations = () => {
  const t = useTranslation();
  
  return (
    <DashboardLayout title={t('consultations')}>
      <div className="space-y-6">
        <p className="text-muted-foreground">{t('consultationsDescription')}</p>
        
        <ConsultationTabs />
      </div>
    </DashboardLayout>
  );
};

export default Consultations;
