
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
    accountSettings,
    isSaving: isAccountSaving, 
    saveAccountSettings
  } = useAccountSettings();
  
  const {
    displaySettings,
    isSaving: isDisplaySaving,
    updateDisplaySettingsField,
    saveDisplaySettings
  } = useDisplaySettings();
  
  const {
    notificationSettings,
    isSaving: isNotificationSaving,
    updateNotificationSettingsField,
    saveNotificationSettings
  } = useNotificationSettings();
  
  const {
    privacySettings,
    isSaving: isPrivacySaving,
    updatePrivacySettingsField,
    savePrivacySettings
  } = usePrivacySettings();

  // Helper functions to adapt the interface
  const handleLanguageChange = (value: any) => updateDisplaySettingsField('language', value);
  const handleCurrencyChange = (value: any) => updateDisplaySettingsField('currency', value);
  const handleTimezoneChange = (value: any) => updateDisplaySettingsField('timezone', value);
  
  const handleEmailNotificationsChange = (value: boolean) => updateNotificationSettingsField('email', value);
  const handlePushNotificationsChange = (value: boolean) => updateNotificationSettingsField('push', value);
  
  const handlePublicProfileChange = (value: boolean) => updatePrivacySettingsField('publicProfile', value);
  const handleDataSharingChange = (value: boolean) => updatePrivacySettingsField('dataSharing', value);
  const handleProfileVisibilityChange = (value: any) => updatePrivacySettingsField('profileVisibility', value);

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
              name={accountSettings.name} 
              email={accountSettings.email} 
              isSaving={isAccountSaving} 
              onSave={saveAccountSettings} 
            />
          </TabsContent>
          
          <TabsContent value="display">
            <DisplaySettings 
              language={displaySettings.language}
              currency={displaySettings.currency}
              timezone={displaySettings.timezone}
              isSaving={isDisplaySaving}
              onLanguageChange={handleLanguageChange}
              onCurrencyChange={handleCurrencyChange}
              onTimezoneChange={handleTimezoneChange}
              onSave={saveDisplaySettings}
            />
          </TabsContent>
          
          <TabsContent value="notifications">
            <NotificationSettings 
              emailNotifications={notificationSettings.email}
              pushNotifications={notificationSettings.push}
              isSaving={isNotificationSaving}
              onEmailNotificationsChange={handleEmailNotificationsChange}
              onPushNotificationsChange={handlePushNotificationsChange}
              onSave={saveNotificationSettings}
            />
          </TabsContent>
          
          <TabsContent value="privacy">
            <PrivacySettings 
              publicProfile={privacySettings.publicProfile}
              dataSharing={privacySettings.dataSharing}
              profileVisibility={privacySettings.profileVisibility}
              isSaving={isPrivacySaving}
              onPublicProfileChange={handlePublicProfileChange}
              onDataSharingChange={handleDataSharingChange}
              onProfileVisibilityChange={handleProfileVisibilityChange}
              onSave={savePrivacySettings}
            />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default SettingsPage;
