
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { Badge } from '@/components/ui/badge';
import { ArrowUp, ArrowDown } from 'lucide-react';

export function MarketInsights() {
  const { t } = useLanguage();
  
  // Demo data
  const insights = [
    {
      title: "Dubai Property Market",
      trend: "up",
      percentage: 4.2,
      description: "Market prices up 4.2% in Q1 2024 compared to previous quarter."
    },
    {
      title: "London Rental Yields",
      trend: "up",
      percentage: 1.8,
      description: "Average rental yields increased across central London."
    },
    {
      title: "New York Office Space",
      trend: "down",
      percentage: 2.5,
      description: "Office occupancy rates decreased due to remote work trends."
    }
  ];
  
  return (
    <Card className="row-span-2">
      <CardHeader>
        <CardTitle>{t("marketInsights")}</CardTitle>
        <CardDescription>{t("lastUpdated")}: {new Date().toLocaleDateString()}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {insights.map((insight, index) => (
            <div key={index} className="border rounded-md p-3">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium">{insight.title}</h3>
                <Badge variant={insight.trend === "up" ? "success" : "destructive"} className="flex items-center">
                  {insight.trend === "up" ? (
                    <ArrowUp className="h-3 w-3 mr-1" />
                  ) : (
                    <ArrowDown className="h-3 w-3 mr-1" />
                  )}
                  {insight.percentage}%
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{insight.description}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
