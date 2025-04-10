
import React from "react";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { useLanguage } from "@/contexts/LanguageContext";

const Messages = () => {
  const { t } = useLanguage();

  return (
    <DashboardLayout title={t('messages')}>
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <h2 className="text-2xl font-semibold mb-6">{t('messages')}</h2>
          
          <div className="text-center p-8">
            <p>{t('messages')} {t('comingSoon')}</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Messages;
