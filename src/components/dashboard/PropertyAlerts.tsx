
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { CheckCircle2 } from "lucide-react";

export function PropertyAlerts() {
  const { t } = useLanguage();

  // In a real app, we would fetch alerts from the API
  const alerts = [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('propertyAlerts')}</CardTitle>
      </CardHeader>
      <CardContent>
        {alerts.length > 0 ? (
          <div className="space-y-4">
            {alerts.map((alert, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="rounded-full bg-amber-100 p-1.5 text-amber-600">
                  {/* Icon would depend on alert type */}
                </div>
                <div>
                  <p className="text-sm font-medium">Alert title</p>
                  <p className="text-xs text-muted-foreground">
                    Alert description
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <div className="rounded-full bg-green-100 p-3 text-green-600 mb-3">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <p className="text-sm font-medium">{t('noAlerts')}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {t('allSystemsNormal')}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
