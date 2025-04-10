
import React from "react";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/contexts/LanguageContext";
import { AccountSettings } from "@/components/settings/AccountSettings";
import { DisplaySettings } from "@/components/settings/DisplaySettings";
import { NotificationSettings } from "@/components/settings/NotificationSettings";
import { PrivacySettings } from "@/components/settings/PrivacySettings";

const SettingsPage = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = React.useState("account");

  return (
    <DashboardLayout title={t('settings')}>
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <h2 className="text-2xl font-semibold mb-6">{t('settings')}</h2>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="account">{t('accountSettings')}</TabsTrigger>
              <TabsTrigger value="display">{t('displaySettings')}</TabsTrigger>
              <TabsTrigger value="notifications">{t('notificationSettings')}</TabsTrigger>
              <TabsTrigger value="privacy">{t('privacySettings')}</TabsTrigger>
            </TabsList>
            
            <TabsContent value="account" className="pt-4">
              <AccountSettings />
            </TabsContent>
            
            <TabsContent value="display" className="pt-4">
              <DisplaySettings />
            </TabsContent>
            
            <TabsContent value="notifications" className="pt-4">
              <NotificationSettings />
            </TabsContent>
            
            <TabsContent value="privacy" className="pt-4">
              <PrivacySettings />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SettingsPage;
