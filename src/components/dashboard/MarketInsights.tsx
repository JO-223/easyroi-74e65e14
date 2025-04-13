
import React from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { TrendingUp, TrendingDown } from "lucide-react";

export function MarketInsights() {
  const { t } = useLanguage();
  
  // Mock data - in a real app, we would fetch this from an API
  const insights = [
    {
      title: "Milan Real Estate",
      change: 3.5,
      isPositive: true
    },
    {
      title: "Dubai Market",
      change: 7.2,
      isPositive: true
    },
    {
      title: "Swiss Property",
      change: -1.3,
      isPositive: false
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('marketInsights')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {insights.map((insight, index) => (
            <div key={index} className="flex items-center justify-between">
              <span className="text-sm">{insight.title}</span>
              <div 
                className={`flex items-center text-sm ${
                  insight.isPositive ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {insight.isPositive ? (
                  <TrendingUp className="mr-1 h-4 w-4" />
                ) : (
                  <TrendingDown className="mr-1 h-4 w-4" />
                )}
                <span>{insight.isPositive ? '+' : ''}{insight.change}%</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <div className="text-xs text-muted-foreground">
          {t('lastUpdated')}: {new Date().toLocaleDateString()}
        </div>
      </CardFooter>
    </Card>
  );
}
