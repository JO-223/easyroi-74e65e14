
import React, { useState } from 'react';
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AccountSettings } from "@/components/settings/AccountSettings";
import { DisplaySettings } from "@/components/settings/DisplaySettings";
import { NotificationSettings } from "@/components/settings/NotificationSettings";
import { PrivacySettings } from "@/components/settings/PrivacySettings";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAccountSettings } from '@/hooks/useAccountSettings';
import { useDisplaySettings } from '@/hooks/useDisplaySettings';
import { useNotificationSettings } from '@/hooks/useNotificationSettings';
import { usePrivacySettings } from '@/hooks/usePrivacySettings';

const SettingsPage = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("account");
  
  const { 
    name, 
    email, 
    isSaving: isAccountSaving, 
    updateAccountSettings 
  } = useAccountSettings();
  
  const {
    displaySettings,
    isSaving: isDisplaySaving,
    updateLanguage,
    updateCurrency,
    updateTimezone,
    saveDisplaySettings
  } = useDisplaySettings();
  
  const {
    emailNotifications,
    pushNotifications,
    isSaving: isNotificationSaving,
    updateEmailNotifications,
    updatePushNotifications,
    saveNotificationSettings
  } = useNotificationSettings();
  
  const {
    publicProfile,
    dataSharing,
    profileVisibility,
    isSaving: isPrivacySaving,
    updatePublicProfile,
    updateDataSharing,
    updateProfileVisibility,
    savePrivacySettings
  } = usePrivacySettings();

  return (
    <DashboardLayout title={t('settings')}>
      <div className="container mx-auto py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 gap-2 mb-8">
            <TabsTrigger value="account">{t('account')}</TabsTrigger>
            <TabsTrigger value="display">{t('display')}</TabsTrigger>
            <TabsTrigger value="notifications">{t('notifications')}</TabsTrigger>
            <TabsTrigger value="privacy">{t('privacy')}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="account">
            <AccountSettings 
              name={name} 
              email={email} 
              isSaving={isAccountSaving} 
              onSave={updateAccountSettings} 
            />
          </TabsContent>
          
          <TabsContent value="display">
            <DisplaySettings 
              language={displaySettings.language}
              currency={displaySettings.currency}
              timezone={displaySettings.timezone}
              isSaving={isDisplaySaving}
              onLanguageChange={updateLanguage}
              onCurrencyChange={updateCurrency}
              onTimezoneChange={updateTimezone}
              onSave={saveDisplaySettings}
            />
          </TabsContent>
          
          <TabsContent value="notifications">
            <NotificationSettings 
              emailNotifications={emailNotifications}
              pushNotifications={pushNotifications}
              isSaving={isNotificationSaving}
              onEmailNotificationsChange={updateEmailNotifications}
              onPushNotificationsChange={updatePushNotifications}
              onSave={saveNotificationSettings}
            />
          </TabsContent>
          
          <TabsContent value="privacy">
            <PrivacySettings 
              publicProfile={publicProfile}
              dataSharing={dataSharing}
              profileVisibility={profileVisibility}
              isSaving={isPrivacySaving}
              onPublicProfileChange={updatePublicProfile}
              onDataSharingChange={updateDataSharing}
              onProfileVisibilityChange={updateProfileVisibility}
              onSave={savePrivacySettings}
            />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default SettingsPage;
