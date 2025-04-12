
import React from "react";
import { Card } from "@/components/ui/card";
import { TrendingUp, Building2, BarChart3, Calendar } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { DashboardStats as DashboardStatsType } from "@/services/dashboard/dashboardService";

interface StatItemProps {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  icon: React.ElementType;
}

const StatItem = ({ title, value, change, isPositive, icon: Icon }: StatItemProps) => {
  return (
    <Card key={title}>
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            <p className={`text-xs ${isPositive ? "text-easyroi-success" : "text-easyroi-danger"} flex items-center mt-1`}>
              {change}
            </p>
          </div>
          <div className="bg-easyroi-navy/10 p-3 rounded-full">
            <Icon className="h-5 w-5 text-easyroi-navy" />
          </div>
        </div>
      </div>
    </Card>
  );
};

interface DashboardStatsProps {
  stats: DashboardStatsType & {
    formattedInvestment: string;
  };
}

export const DashboardStats = ({ stats }: DashboardStatsProps) => {
  const t = useTranslation();

  const statItems = [
    {
      title: t('totalInvestment'),
      value: stats.formattedInvestment,
      change: `${stats.investmentChange > 0 ? '+' : ''}${stats.investmentChange.toFixed(2)}%`,
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
      value: `${stats.roi.toFixed(2)}%`,
      change: `${stats.roiChange > 0 ? '+' : ''}${stats.roiChange.toFixed(2)}%`,
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {statItems.map((stat) => (
        <StatItem key={stat.title} {...stat} />
      ))}
    </div>
  );
};
