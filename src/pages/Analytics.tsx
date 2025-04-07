
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowDown, ArrowUp, LineChart, Percent, TrendingUp } from "lucide-react";
import {
  LineChart as RechartsLineChart,
  Line,
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
  Legend
} from "recharts";

const Analytics = () => {
  // Sample data for charts
  const performanceData = [
    { month: "Jan", roi: 3.2, benchmark: 2.7 },
    { month: "Feb", roi: 3.5, benchmark: 2.8 },
    { month: "Mar", roi: 3.1, benchmark: 2.9 },
    { month: "Apr", roi: 3.8, benchmark: 2.7 },
    { month: "May", roi: 3.6, benchmark: 2.8 },
    { month: "Jun", roi: 4.1, benchmark: 2.9 },
    { month: "Jul", roi: 4.3, benchmark: 3.0 },
    { month: "Aug", roi: 4.2, benchmark: 3.1 },
    { month: "Sep", roi: 4.5, benchmark: 3.0 },
    { month: "Oct", roi: 4.4, benchmark: 2.9 },
    { month: "Nov", roi: 4.7, benchmark: 3.0 },
    { month: "Dec", roi: 4.9, benchmark: 3.1 },
  ];

  const allocationData = [
    { name: "Residential", value: 45 },
    { name: "Commercial", value: 30 },
    { name: "Mixed-Use", value: 15 },
    { name: "Hospitality", value: 10 },
  ];

  const regionData = [
    { name: "Italy", value: 40 },
    { name: "Dubai", value: 35 },
    { name: "Spain", value: 15 },
    { name: "Portugal", value: 10 },
  ];

  const yearlyPerformance = [
    { year: "2020", roi: 5.8 },
    { year: "2021", roi: 6.2 },
    { year: "2022", roi: 6.7 },
    { year: "2023", roi: 7.1 },
    { year: "2024 (YTD)", roi: 4.5 },
  ];

  const COLORS = ["#0C2340", "#D4AF37", "#4CAF50", "#6E59A5"];

  const metrics = [
    {
      title: "Portfolio ROI",
      value: "7.4%",
      change: "+0.6%",
      isPositive: true,
      icon: Percent,
      description: "vs previous year",
    },
    {
      title: "Annual Growth",
      value: "12.3%",
      change: "+2.1%",
      isPositive: true,
      icon: TrendingUp,
      description: "vs previous year",
    },
    {
      title: "Market Comparison",
      value: "+4.2%",
      change: "Above index",
      isPositive: true,
      icon: LineChart,
      description: "vs market average",
    },
  ];

  return (
    <DashboardLayout title="Analytics" subtitle="Comprehensive data analysis of your investment portfolio">
      <div className="grid gap-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {metrics.map((metric) => (
            <Card key={metric.title}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{metric.title}</p>
                    <p className="text-2xl font-bold">{metric.value}</p>
                    <p className={`text-xs ${metric.isPositive ? "text-easyroi-success" : "text-easyroi-danger"} flex items-center mt-1`}>
                      {metric.change} <span className="text-gray-500 ml-1">{metric.description}</span>
                    </p>
                  </div>
                  <div className="bg-easyroi-navy/10 p-3 rounded-full">
                    <metric.icon className="h-5 w-5 text-easyroi-navy" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Performance Chart */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>ROI Performance (2024)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsLineChart
                  data={performanceData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    domain={[0, 'auto']}
                    tickFormatter={(value) => `${value}%`}
                  />
                  <Tooltip formatter={(value) => [`${value}%`, "ROI"]} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="roi"
                    name="Your Portfolio"
                    stroke="#0C2340"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="benchmark"
                    name="Market Average"
                    stroke="#D4AF37"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={{ r: 4 }}
                  />
                </RechartsLineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Portfolio Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Asset Allocation */}
          <Card>
            <CardHeader>
              <CardTitle>Asset Allocation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={allocationData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {allocationData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value}%`, "Allocation"]} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Geographic Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Geographic Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={regionData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {regionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value}%`, "Allocation"]} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Historical Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Historical ROI Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={yearlyPerformance} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="year" axisLine={false} tickLine={false} />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    domain={[0, 'auto']}
                    tickFormatter={(value) => `${value}%`}
                  />
                  <Tooltip formatter={(value) => [`${value}%`, "ROI"]} />
                  <Bar dataKey="roi" fill="#D4AF37" radius={[4, 4, 0, 0]} name="Annual ROI" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Analytics;
