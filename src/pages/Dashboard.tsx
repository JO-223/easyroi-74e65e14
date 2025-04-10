
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
import { useQuery } from "@tanstack/react-query";

const Dashboard = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<{ id: string } | null>(null);
  
  // Check if user is authenticated
  useEffect(() => {
    async function checkAuth() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/login');
      } else {
        setUser({ id: session.user.id });
      }
    }
    
    checkAuth();
  }, [navigate]);
  
  // Use React Query to fetch and cache dashboard data
  const { 
    data: dashboardData,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['dashboardData', user?.id],
    queryFn: fetchDashboardData,
    enabled: !!user,
    staleTime: 30000, // Consider data fresh for 30 seconds
    refetchOnWindowFocus: true, // Refetch when window regains focus
  });
  
  // Handle errors
  useEffect(() => {
    if (error) {
      console.error("Error loading dashboard data:", error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive"
      });
    }
  }, [error, toast]);

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
