
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";

export const DashboardError = () => {
  const { t } = useLanguage();
  
  return (
    <div className="text-center py-10">
      <h2 className="text-2xl font-bold mb-2">{t('noData')}</h2>
      <p>{t('refreshOrContactSupport')}</p>
    </div>
  );
};
