
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { useTranslation } from "@/hooks/useTranslation";
import { InvestmentTabs } from "@/components/investments/InvestmentTabs";
import { useQuery } from "@tanstack/react-query";
import { fetchUserInvestments } from "@/services/user/investmentService";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const MyInvestments = () => {
  const t = useTranslation();
  
  const { data: investments, isLoading, error } = useQuery({
    queryKey: ['user-investments'],
    queryFn: fetchUserInvestments,
  });

  return (
    <DashboardLayout title={t('myInvestments')}>
      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      ) : error ? (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {t('errorLoadingData')}
          </AlertDescription>
        </Alert>
      ) : (
        <InvestmentTabs investments={investments || []} />
      )}
    </DashboardLayout>
  );
};

export default MyInvestments;
