
import { useState, useEffect, useCallback } from "react";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { AccountSettings } from "@/components/settings/AccountSettings";
import { DisplaySettings } from "@/components/settings/DisplaySettings";
import { NotificationSettings } from "@/components/settings/NotificationSettings";
import { PrivacySettings } from "@/components/settings/PrivacySettings";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSettings } from "@/hooks/use-settings";
import { DashboardLoading } from "@/components/dashboard/DashboardLoading";

const Settings = () => {
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(true);
  const { 
    settingsData, 
    isSaving, 
    handleSettingsSubmit,
    updateDisplaySettingsField,
    updateNotificationSettingsField,
    updatePrivacySettingsField
  } = useSettings();
  
  // Memoize settings checking to prevent unnecessary rerenders
  const checkSettingsLoaded = useCallback(() => {
    // Check if we have account email data
    const hasAccountData = Boolean(settingsData.account.email);
    
    // Check if display settings are loaded
    const hasDisplayData = Boolean(settingsData.display.language);
    
    return hasAccountData && hasDisplayData;
  }, [settingsData.account.email, settingsData.display.language]);

  useEffect(() => {
    // Only change loading state if needed to prevent unnecessary rerenders
    if (isLoading && checkSettingsLoaded()) {
      setIsLoading(false);
    }
    
    // Set a timeout to ensure loading state doesn't get stuck
    const timeoutId = setTimeout(() => {
      if (isLoading) setIsLoading(false);
    }, 2000);
    
    return () => clearTimeout(timeoutId);
  }, [isLoading, checkSettingsLoaded]);

  if (isLoading) {
    return (
      <DashboardLayout title={t('settings')} subtitle={t('manageSettings')}>
        <DashboardLoading />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title={t('settings')} subtitle={t('manageSettings')}>
      <div className="space-y-6">
        {/* Account Settings */}
        <AccountSettings 
          name={settingsData.account.name}
          email={settingsData.account.email}
          isSaving={isSaving}
          onSave={() => handleSettingsSubmit('account')}
        />
        
        {/* Display Settings */}
        <DisplaySettings 
          language={settingsData.display.language}
          currency={settingsData.display.currency}
          timezone={settingsData.display.timezone}
          isSaving={isSaving}
          onLanguageChange={(value) => updateDisplaySettingsField('language', value)}
          onCurrencyChange={(value) => updateDisplaySettingsField('currency', value)}
          onTimezoneChange={(value) => updateDisplaySettingsField('timezone', value)}
          onSave={() => handleSettingsSubmit('display')}
        />
        
        {/* Notification Settings */}
        <NotificationSettings 
          emailNotifications={settingsData.notifications.email}
          pushNotifications={settingsData.notifications.push}
          isSaving={isSaving}
          onEmailNotificationsChange={(checked) => updateNotificationSettingsField('email', checked)}
          onPushNotificationsChange={(checked) => updateNotificationSettingsField('push', checked)}
          onSave={() => handleSettingsSubmit('notifications')}
        />
        
        {/* Privacy Settings */}
        <PrivacySettings 
          publicProfile={settingsData.privacy.publicProfile}
          dataSharing={settingsData.privacy.dataSharing}
          profileVisibility={settingsData.privacy.profileVisibility}
          isSaving={isSaving}
          onPublicProfileChange={(checked) => updatePrivacySettingsField('publicProfile', checked)}
          onDataSharingChange={(checked) => updatePrivacySettingsField('dataSharing', checked)}
          onProfileVisibilityChange={(value) => updatePrivacySettingsField('profileVisibility', value)}
          onSave={() => handleSettingsSubmit('privacy')}
        />
      </div>
    </DashboardLayout>
  );
};

export default Settings;
