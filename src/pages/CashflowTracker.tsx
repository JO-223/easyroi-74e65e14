
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { CashflowContent } from "@/components/cashflow/CashflowContent";
import { useTranslation } from "@/hooks/useTranslation";

export default function CashflowTracker() {
  const t = useTranslation();
  
  return (
    <DashboardLayout title="Cashflow Tracker" subtitle={t("cashflowTrackerDesc")}>
      <CashflowContent />
    </DashboardLayout>
  );
}
