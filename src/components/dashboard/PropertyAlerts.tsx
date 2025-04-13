
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { CheckCircle } from 'lucide-react';

export function PropertyAlerts() {
  const { t } = useLanguage();
  
  // Demo data - empty alerts
  const alerts = [];
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("propertyAlerts")}</CardTitle>
        <CardDescription>
          {alerts.length > 0 
            ? `${alerts.length} ${t("alerts")}`
            : t("noAlerts")
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        {alerts.length > 0 ? (
          <div className="space-y-2">
            {alerts.map((alert, index) => (
              <div key={index} className="border rounded-md p-2">
                Alert content would go here
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center py-4">
            <CheckCircle className="h-10 w-10 text-emerald-500 mb-2" />
            <p className="font-medium">{t("allSystemsNormal")}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
