
import React from "react";
import { Loader2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export const DashboardLoading = () => {
  const { t } = useLanguage();
  
  return (
    <div className="flex flex-col items-center justify-center h-96">
      <Loader2 className="h-12 w-12 animate-spin text-easyroi-navy mb-4" />
      <p className="text-easyroi-navy text-lg font-medium">{t('loading')}</p>
    </div>
  );
};
