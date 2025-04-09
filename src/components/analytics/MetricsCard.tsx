
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Percent, TrendingUp, LineChart } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface MetricsCardProps {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  icon: React.ElementType;
  description: string;
}

export const MetricsCard = ({
  title,
  value,
  change,
  isPositive,
  icon: Icon,
  description,
}: MetricsCardProps) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            <p className={`text-xs ${isPositive ? "text-easyroi-success" : "text-easyroi-danger"} flex items-center mt-1`}>
              {change} <span className="text-gray-500 ml-1">{description}</span>
            </p>
          </div>
          <div className="bg-easyroi-navy/10 p-3 rounded-full">
            <Icon className="h-5 w-5 text-easyroi-navy" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
