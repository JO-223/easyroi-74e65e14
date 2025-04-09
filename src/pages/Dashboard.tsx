
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { BarChart3, Building2, Calendar, Loader2, TrendingUp } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { 
  fetchDashboardData, 
  DashboardData, 
  formatCurrency 
} from "@/services/dashboard/dashboardService";
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

  // Define chart colors
  const COLORS = ["#0C2340", "#D4AF37", "#4CAF50", "#E57373"];
  
  if (isLoading) {
    return (
      <DashboardLayout title={t('dashboard')}>
        <div className="flex items-center justify-center h-96">
          <Loader2 className="h-12 w-12 animate-spin text-easyroi-navy" />
        </div>
      </DashboardLayout>
    );
  }
  
  if (!dashboardData) {
    return (
      <DashboardLayout title={t('dashboard')}>
        <div className="text-center py-10">
          <h2 className="text-2xl font-bold mb-2">No data available</h2>
          <p>Please try refreshing the page or contact support.</p>
        </div>
      </DashboardLayout>
    );
  }

  const { stats, investmentGrowth, portfolioAllocation, properties } = dashboardData;

  const statItems = [
    {
      title: t('totalInvestment'),
      value: formatCurrency(stats.totalInvestment),
      change: `${stats.investmentChange > 0 ? '+' : ''}${stats.investmentChange}%`,
      isPositive: stats.investmentChange >= 0,
      icon: TrendingUp,
    },
    {
      title: t('properties'),
      value: stats.properties.toString(),
      change: stats.propertiesChange > 0 ? `+${stats.propertiesChange}` : stats.propertiesChange.toString(),
      isPositive: stats.propertiesChange >= 0,
      icon: Building2,
    },
    {
      title: t('roi'),
      value: `${stats.roi}%`,
      change: `${stats.roiChange > 0 ? '+' : ''}${stats.roiChange}%`,
      isPositive: stats.roiChange >= 0,
      icon: BarChart3,
    },
    {
      title: t('events'),
      value: stats.events.toString(),
      change: t('events'),
      isPositive: true,
      icon: Calendar,
    },
  ];

  return (
    <DashboardLayout title={t('dashboard')}>
      <div className="grid gap-4 md:gap-8 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {statItems.map((stat) => (
            <Card key={stat.title}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className={`text-xs ${stat.isPositive ? "text-easyroi-success" : "text-easyroi-danger"} flex items-center mt-1`}>
                      {stat.change}
                    </p>
                  </div>
                  <div className="bg-easyroi-navy/10 p-3 rounded-full">
                    <stat.icon className="h-5 w-5 text-easyroi-navy" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>{t('investmentGrowth')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={investmentGrowth} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tickFormatter={(value) => `€${Math.floor(value / 1000)}k`} 
                    />
                    <Tooltip 
                      formatter={(value: number) => [`€${value.toLocaleString()}`, "Value"]} 
                    />
                    <Bar dataKey="value" fill="#D4AF37" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('portfolioAllocation')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={portfolioAllocation}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {portfolioAllocation.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value}%`, t('allocation')]} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t('yourProperties')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium">{t('property')}</th>
                    <th className="text-left py-3 px-4 font-medium">{t('location')}</th>
                    <th className="text-left py-3 px-4 font-medium">{t('roi')}</th>
                    <th className="text-left py-3 px-4 font-medium">{t('value')}</th>
                    <th className="text-left py-3 px-4 font-medium">{t('status')}</th>
                  </tr>
                </thead>
                <tbody>
                  {properties.map((property) => (
                    <tr key={property.id} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4">{property.name}</td>
                      <td className="py-3 px-4">{property.location}</td>
                      <td className="py-3 px-4 text-easyroi-success">{property.roi}</td>
                      <td className="py-3 px-4">{property.value}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          property.status === 'active' ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"
                        }`}>
                          {property.status === 'active' ? t('active') : t('development')}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
