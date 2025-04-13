
import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchDashboardData } from '@/services/portfolioService';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { PortfolioSummary } from '@/components/dashboard/PortfolioSummary';
import { InvestmentChart } from '@/components/dashboard/InvestmentChart';
import { PortfolioAllocationChart } from '@/components/dashboard/PortfolioAllocationChart';
import { useAuth } from '@/hooks/useAuth';
import { EmptyState } from '@/components/ui/empty-state';
import { AlertTriangle } from 'lucide-react';

const Dashboard = () => {
  const { user, userDetails } = useAuth();

  const { data, isLoading, error } = useQuery({
    queryKey: ['dashboardData'],
    queryFn: () => fetchDashboardData(user?.id || ''),
    enabled: !!user,
  });
  
  useEffect(() => {
    if (error) {
      console.error("Error fetching dashboard data:", error);
    }
  }, [error]);
  
  if (!user) {
    return (
      <DashboardLayout title="Dashboard" subtitle="">
        <EmptyState 
          icon={<AlertTriangle size={40} />}
          title="Not authenticated"
          description="Please sign in to view your dashboard."
        />
      </DashboardLayout>
    );
  }
  
  if (isLoading) {
    return (
      <DashboardLayout title="Dashboard" subtitle="">
        <div className="w-full text-center p-10">
          <div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading dashboard data...</p>
        </div>
      </DashboardLayout>
    );
  }
  
  if (error) {
    return (
      <DashboardLayout title="Dashboard" subtitle="">
        <EmptyState 
          icon={<AlertTriangle size={40} />}
          title="Error"
          description="Failed to load dashboard data."
        />
      </DashboardLayout>
    );
  }

  // Transform data to match the expected ChartDataItem format
  const allocationData = data?.allocation ? data.allocation.map(item => ({
    name: item.location,
    value: item.percentage
  })) : [];

  return (
    <DashboardLayout title="Dashboard" subtitle={`Welcome back, ${userDetails?.firstName || 'User'}!`}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <PortfolioSummary isLoading={isLoading} />
        
        <InvestmentChart 
          growthData={data?.growth || []} 
          isLoading={isLoading} 
        />
        
        <PortfolioAllocationChart 
          data={allocationData} 
          isLoading={isLoading} 
        />
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
