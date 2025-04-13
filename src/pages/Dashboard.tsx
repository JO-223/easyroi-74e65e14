
import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { DashboardContent } from "@/components/dashboard/DashboardContent";
import { DashboardLoading } from "@/components/dashboard/DashboardLoading";
import { DashboardError } from "@/components/dashboard/DashboardError";
import { useLanguage } from "@/contexts/LanguageContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { fetchDashboardData, DashboardData } from "@/services/dashboard/dashboardService";
import { useToast } from "@/hooks/use-toast";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

const Dashboard = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const { toast } = useToast();
  
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
    async function checkAuthAndLoadData() {
      // Check if user is authenticated
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate('/login');
        return;
      }
      
      loadDashboardData();
    }
    
    checkAuthAndLoadData();
  }, [navigate, toast]);

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
