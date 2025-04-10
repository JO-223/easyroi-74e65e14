
import React from "react";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { useLanguage } from "@/contexts/LanguageContext";

const Notifications = () => {
  const { t } = useLanguage();

  return (
    <DashboardLayout title={t('notifications')}>
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <h2 className="text-2xl font-semibold mb-6">{t('notifications')}</h2>
          
          <div className="text-center p-8">
            <p>{t('notifications')} {t('comingSoon')}</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Notifications;
