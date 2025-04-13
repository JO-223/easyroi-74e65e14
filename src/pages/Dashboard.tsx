
import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { DashboardContent } from "@/components/dashboard/DashboardContent";
import { DashboardLoading } from "@/components/dashboard/DashboardLoading";
import { DashboardError } from "@/components/dashboard/DashboardError";
import { useLanguage } from "@/contexts/LanguageContext";
import { fetchDashboardData, DashboardData } from "@/services/dashboard/dashboardService";
import { useToast } from "@/hooks/use-toast";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Dashboard = () => {
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  
  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      const data = await fetchDashboardData();
      setDashboardData(data);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
      toast({
        title: t('error'),
        description: t('unableToLoadData'),
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    console.log("Dashboard: Loading user data for user ID:", user?.id);
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const renderContent = () => {
    if (isLoading) {
      return <DashboardLoading />;
    }
    
    if (!dashboardData) {
      return (
        <EmptyState
          title={t('noData')}
          description={t('refreshOrContactSupport')}
          action={
            <Button 
              onClick={loadDashboardData} 
              variant="outline" 
              size="sm"
              className="mt-4"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              {t('refresh')}
            </Button>
          }
        />
      );
    }
    
    return <DashboardContent dashboardData={dashboardData} />;
  };

  return (
    <DashboardLayout title={t('dashboard')}>
      <ErrorBoundary>
        {renderContent()}
      </ErrorBoundary>
    </DashboardLayout>
  );
};

export default Dashboard;
