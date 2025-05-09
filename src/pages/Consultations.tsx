
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { useTranslation } from "@/hooks/useTranslation";
import { AllConsultantsList } from "@/components/consultations/AllConsultantsList";

const Consultations = () => {
  const t = useTranslation();
  
  return (
    <DashboardLayout title={t('consultations')}>
      <div className="space-y-6 max-w-full">
        <p className="text-muted-foreground break-words">{t('consultationsDescription')}</p>
        
        <AllConsultantsList />
      </div>
    </DashboardLayout>
  );
};

export default Consultations;
