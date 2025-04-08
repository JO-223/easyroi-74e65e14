
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EyeOff } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export function NetworkEmpty() {
  const { t } = useLanguage();
  
  return (
    <Card className="border-none shadow-none">
      <CardContent className="flex flex-col items-center justify-center py-12">
        <div className="rounded-full bg-amber-100 p-3 mb-4">
          <EyeOff className="h-6 w-6 text-amber-600" />
        </div>
        <h3 className="text-xl font-medium text-center mb-2">
          {t('privateProfileNetworkRestricted')}
        </h3>
        <p className="text-muted-foreground text-center max-w-md mb-6">
          {t('privateProfileNetworkMessage')}
        </p>
        <Button
          onClick={() => {
            window.location.href = "/dashboard/settings";
          }}
        >
          {t('goToPrivacySettings')}
        </Button>
      </CardContent>
    </Card>
  );
}
