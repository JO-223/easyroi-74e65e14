
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { useTranslation } from "@/hooks/useTranslation";
import { AllConsultantsList } from "@/components/consultations/AllConsultantsList";
import { Card } from "@/components/ui/card";

const Consultations = () => {
  const t = useTranslation();
  
  return (
    <DashboardLayout title={t('consultations')}>
      <div className="space-y-6 container mx-auto py-6 px-4 md:px-6">
        <Card className="p-6">
          <h1 className="text-2xl font-semibold mb-4">{t('consultations')}</h1>
          <p className="text-muted-foreground max-w-3xl">{t('consultationsDescription')}</p>
        </Card>
        
        <AllConsultantsList />
      </div>
    </DashboardLayout>
  );
};

export default Consultations;
