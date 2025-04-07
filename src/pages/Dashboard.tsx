
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

const Dashboard = () => {
  // Sample data for demonstration purposes
  const investmentData = [
    { name: "Jan", value: 12000 },
    { name: "Feb", value: 19000 },
    { name: "Mar", value: 16000 },
    { name: "Apr", value: 25000 },
    { name: "May", value: 28000 },
    { name: "Jun", value: 20000 },
  ];

  const portfolioData = [
    { name: "Italy", value: 45 },
    { name: "Dubai", value: 35 },
    { name: "Spain", value: 20 },
  ];

  const COLORS = ["#0C2340", "#D4AF37", "#4CAF50", "#E57373"];

  const stats = [
    {
      title: "Total Investment",
      value: "€2,450,000",
      change: "+12.5%",
      isPositive: true,
      icon: TrendingUp,
    },
    {
      title: "Properties",
      value: "8",
      change: "+1",
      isPositive: true,
      icon: Building2,
    },
    {
      title: "ROI",
      value: "7.4%",
      change: "+0.6%",
      isPositive: true,
      icon: BarChart3,
    },
    {
      title: "Events",
      value: "3",
      change: "Upcoming",
      isPositive: true,
      icon: Calendar,
    },
  ];

  const propertyList = [
    { id: 1, name: "Villa Toscana", location: "Florence, Italy", roi: "8.2%", value: "€650,000", status: "Active" },
    { id: 2, name: "Marina Apartments", location: "Dubai, UAE", roi: "7.5%", value: "€820,000", status: "Active" },
    { id: 3, name: "Vatican View", location: "Rome, Italy", roi: "6.9%", value: "€540,000", status: "Active" },
    { id: 4, name: "Plaza Investment", location: "Madrid, Spain", roi: "7.2%", value: "€440,000", status: "Development" },
  ];

  return (
    <DashboardLayout>
      <div className="grid gap-4 md:gap-8 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
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
              <CardTitle>Investment Growth</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={investmentData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
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
              <CardTitle>Portfolio Allocation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={portfolioData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {portfolioData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value}%`, "Allocation"]} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Your Properties</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium">Property</th>
                    <th className="text-left py-3 px-4 font-medium">Location</th>
                    <th className="text-left py-3 px-4 font-medium">ROI</th>
                    <th className="text-left py-3 px-4 font-medium">Value</th>
                    <th className="text-left py-3 px-4 font-medium">Status</th>
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
                          property.status === "Active" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"
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
