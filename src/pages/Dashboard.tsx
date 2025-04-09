
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
} from "recharts";
import { BarChart3, Building2, Calendar, TrendingUp } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useDashboardService, DashboardStats, InvestmentGrowthData, PortfolioAllocation, PropertyListItem } from "@/services/dashboardService";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const Dashboard = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { getDashboardData } = useDashboardService();
  
  // State for dashboard data
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [investmentGrowth, setInvestmentGrowth] = useState<InvestmentGrowthData>([]);
  const [portfolioAllocation, setPortfolioAllocation] = useState<PortfolioAllocation>([]);
  const [propertyList, setPropertyList] = useState<PropertyListItem[]>([]);

  // Check authentication and load data
  useEffect(() => {
    const checkAuthAndLoadData = async () => {
      setIsLoading(true);
      
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/login");
        return;
      }
      
      const dashboardData = await getDashboardData();
      
      if (dashboardData) {
        setStats(dashboardData.stats);
        setInvestmentGrowth(dashboardData.investmentGrowth);
        setPortfolioAllocation(dashboardData.portfolioAllocation);
        setPropertyList(dashboardData.properties);
      } else {
        // If no data available, use fallback demo data
        setStats({
          totalInvestment: 2450000,
          investmentChange: 12.5,
          propertiesCount: 8,
          propertiesChange: 1,
          averageRoi: 7.4,
          roiChange: 0.6,
          eventsCount: 3
        });
        
        setInvestmentGrowth([
          { name: "Jan", value: 12000 },
          { name: "Feb", value: 19000 },
          { name: "Mar", value: 16000 },
          { name: "Apr", value: 25000 },
          { name: "May", value: 28000 },
          { name: "Jun", value: 20000 },
        ]);
        
        setPortfolioAllocation([
          { name: "Italy", value: 45 },
          { name: "Dubai", value: 35 },
          { name: "Spain", value: 20 },
        ]);
        
        setPropertyList([
          { id: "1", name: "Villa Toscana", location: "Florence, Italy", roi: "8.2%", value: "€650,000", status: t('active') },
          { id: "2", name: "Marina Apartments", location: "Dubai, UAE", roi: "7.5%", value: "€820,000", status: t('active') },
          { id: "3", name: "Vatican View", location: "Rome, Italy", roi: "6.9%", value: "€540,000", status: t('active') },
          { id: "4", name: "Plaza Investment", location: "Madrid, Spain", roi: "7.2%", value: "€440,000", status: t('development') },
        ]);
      }
      
      setIsLoading(false);
    };
    
    checkAuthAndLoadData();
  }, [navigate, getDashboardData, t]);

  // Colors for the pie chart
  const COLORS = ["#0C2340", "#D4AF37", "#4CAF50", "#E57373"];

  // Generate the stats cards array from the stats data
  const statsCards = !stats ? [] : [
    {
      title: t('totalInvestment'),
      value: `€${stats.totalInvestment.toLocaleString()}`,
      change: `+${stats.investmentChange}%`,
      isPositive: stats.investmentChange >= 0,
      icon: TrendingUp,
    },
    {
      title: t('properties'),
      value: stats.propertiesCount.toString(),
      change: stats.propertiesChange > 0 ? `+${stats.propertiesChange}` : stats.propertiesChange.toString(),
      isPositive: stats.propertiesChange >= 0,
      icon: Building2,
    },
    {
      title: t('roi'),
      value: `${stats.averageRoi}%`,
      change: `+${stats.roiChange}%`,
      isPositive: stats.roiChange >= 0,
      icon: BarChart3,
    },
    {
      title: t('events'),
      value: stats.eventsCount.toString(),
      change: t('events'),
      isPositive: true,
      icon: Calendar,
    },
  ];

  if (isLoading) {
    return (
      <DashboardLayout title={t('dashboard')}>
        <div className="grid gap-4 md:gap-8 mb-8 animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between h-20">
                    <div className="w-full">
                      <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                      <div className="h-6 bg-gray-300 rounded w-4/5"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8">
            <Card className="lg:col-span-2">
              <CardHeader>
                <div className="h-6 bg-gray-200 rounded w-1/4"></div>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-gray-100 rounded"></div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <div className="h-6 bg-gray-200 rounded w-1/3"></div>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-gray-100 rounded"></div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title={t('dashboard')}>
      <div className="grid gap-4 md:gap-8 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {statsCards.map((stat) => (
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
                    <YAxis axisLine={false} tickLine={false} tickFormatter={(value) => `€${value / 1000}k`} />
                    <Tooltip formatter={(value) => [`€${value}`, "Value"]} />
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
                  {propertyList.map((property) => (
                    <tr key={property.id} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4">{property.name}</td>
                      <td className="py-3 px-4">{property.location}</td>
                      <td className="py-3 px-4 text-easyroi-success">{property.roi}</td>
                      <td className="py-3 px-4">{property.value}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          property.status === t('active') ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"
                        }`}>
                          {property.status}
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
