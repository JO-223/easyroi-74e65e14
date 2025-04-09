
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

const Dashboard = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    async function checkAuthAndLoadData() {
      // Check if user is authenticated
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate('/login');
        return;
      }
      
      try {
        setIsLoading(true);
        const data = await fetchDashboardData();
        setDashboardData(data);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
        toast({
          title: "Error",
          description: "Failed to load dashboard data",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    }
    
    checkAuthAndLoadData();
  }, [navigate, toast]);

  return (
    <DashboardLayout title={t('dashboard')}>
      {isLoading ? (
        <DashboardLoading />
      ) : !dashboardData ? (
        <DashboardError />
      ) : (
        <DashboardContent dashboardData={dashboardData} />
      )}
    </DashboardLayout>
  );
};

export default Dashboard;
